import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';

const prisma = new PrismaClient();

export const downloadReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reportType = (req.query.type as string) || 'all';
    const format = ((req.query.format as string) || 'csv').toLowerCase();

    const [customers, products, challans] = await Promise.all([
      prisma.customer.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
      prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
      prisma.challan.findMany({
        include: { customer: true, createdBy: true },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    const dateStr = new Date().toISOString().slice(0, 10);

    if (format === 'pdf') {
      const filename = `CRM_Audit_Report_${reportType}_${dateStr}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      doc.pipe(res);

      // Title & Subheader
      doc.fillColor('#1E293B').fontSize(20).text('MiniERP + CRM Operational Audit Report', { align: 'center' });
      doc.fontSize(10).fillColor('#64748B').text(`Generated on: ${new Date().toLocaleString()} | Report Target: ${reportType.toUpperCase()}`, { align: 'center' });
      doc.moveDown(1.5);

      if (reportType === 'challans' || reportType === 'all') {
        doc.fontSize(14).fillColor('#5B90E5').text('1. Sales Challans Audit Report');
        doc.moveDown(0.5);
        challans.forEach((ch, idx) => {
          doc.fontSize(9).fillColor('#1E293B').text(
            `${idx + 1}. #${ch.challanNumber} | Customer: ${ch.customer?.name || 'N/A'} (${ch.customer?.businessName || ''}) | Qty: ${ch.totalQuantity} | Status: ${ch.status} | Date: ${new Date(ch.createdAt).toLocaleDateString()}`
          );
        });
        doc.moveDown(1);
      }

      if (reportType === 'customers' || reportType === 'all') {
        doc.fontSize(14).fillColor('#5B90E5').text('2. Customer CRM Directory Report');
        doc.moveDown(0.5);
        customers.forEach((c, idx) => {
          doc.fontSize(9).fillColor('#1E293B').text(
            `${idx + 1}. ${c.name} (${c.businessName}) | Mobile: ${c.mobile} | Type: ${c.customerType} | Status: ${c.status} | Address: ${c.address}`
          );
        });
        doc.moveDown(1);
      }

      if (reportType === 'products' || reportType === 'all') {
        doc.fontSize(14).fillColor('#5B90E5').text('3. Inventory & Product Stock Report');
        doc.moveDown(0.5);
        products.forEach((p, idx) => {
          const isLow = p.currentStock <= p.minimumStock;
          doc.fontSize(9).fillColor(isLow ? '#E76576' : '#1E293B').text(
            `${idx + 1}. ${p.name} [SKU: ${p.sku}] | Category: ${p.category} | Price: ₹${p.unitPrice} | Stock: ${p.currentStock} (Min Alert: ${p.minimumStock}) | Loc: ${p.warehouseLocation}`
          );
        });
        doc.moveDown(1);
      }

      // Footer
      doc.fontSize(8).fillColor('#94A3B8').text('Confidential System Audit Document - Generated automatically by MiniERP Portal', 40, doc.page.height - 30, { align: 'center' });

      doc.end();
      return;
    }

    // Default CSV Format Output
    let csvContent = '';
    if (reportType === 'challans') {
      csvContent = 'Challan Number,Customer Name,Business Name,Total Quantity,Status,Created By,Created Date\n';
      challans.forEach((ch) => {
        csvContent += `"${ch.challanNumber}","${ch.customer?.name || ''}","${ch.customer?.businessName || ''}",${ch.totalQuantity},"${ch.status}","${ch.createdBy?.name || ''}","${new Date(ch.createdAt).toISOString()}"\n`;
      });
    } else if (reportType === 'customers') {
      csvContent = 'Customer Name,Business Name,Mobile,Email,Type,Status,Address,Joined Date\n';
      customers.forEach((c) => {
        csvContent += `"${c.name}","${c.businessName}","${c.mobile}","${c.email}","${c.customerType}","${c.status}","${c.address.replace(/"/g, '""')}","${new Date(c.createdAt).toISOString()}"\n`;
      });
    } else if (reportType === 'products') {
      csvContent = 'Product Name,SKU,Category,Unit Price,Current Stock,Min Stock,Location,Updated Date\n';
      products.forEach((p) => {
        csvContent += `"${p.name}","${p.sku}","${p.category}",${p.unitPrice},${p.currentStock},${p.minimumStock},"${p.warehouseLocation}","${new Date(p.updatedAt).toISOString()}"\n`;
      });
    } else {
      csvContent = '--- SYSTEM AUDIT SUMMARY REPORT ---\n\n';
      csvContent += '--- SALES CHALLANS AUDIT ---\n';
      csvContent += 'Challan Number,Customer Name,Total Quantity,Status,Created Date\n';
      challans.forEach((ch) => {
        csvContent += `"${ch.challanNumber}","${ch.customer?.name || ''}",${ch.totalQuantity},"${ch.status}","${new Date(ch.createdAt).toISOString().slice(0, 10)}"\n`;
      });

      csvContent += '\n--- CUSTOMER DIRECTORY AUDIT ---\n';
      csvContent += 'Customer Name,Business Name,Type,Status,Joined Date\n';
      customers.forEach((c) => {
        csvContent += `"${c.name}","${c.businessName}","${c.customerType}","${c.status}","${new Date(c.createdAt).toISOString().slice(0, 10)}"\n`;
      });

      csvContent += '\n--- INVENTORY STOCK AUDIT ---\n';
      csvContent += 'Product Name,SKU,Category,Current Stock,Min Stock Alert\n';
      products.forEach((p) => {
        csvContent += `"${p.name}","${p.sku}","${p.category}",${p.currentStock},${p.minimumStock}\n`;
      });
    }

    const filename = `CRM_Audit_Report_${reportType}_${dateStr}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

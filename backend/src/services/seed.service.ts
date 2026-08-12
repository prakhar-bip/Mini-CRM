import { PrismaClient, Role, CustomerType, CustomerStatus, StockMovementType, ChallanStatus, RequestStatus } from '@prisma/client';
import { hashPassword } from '../utils/password';

const prisma = new PrismaClient();

const INITIAL_PASSWORD = 'Password@123';

const seedUsers = [
  { name: 'Admin User', email: 'admin@example.com', role: Role.ADMIN },
  { name: 'Sales User', email: 'sales@example.com', role: Role.SALES },
  { name: 'Warehouse User', email: 'warehouse@example.com', role: Role.WAREHOUSE },
  { name: 'Accounts User', email: 'accounts@example.com', role: Role.ACCOUNTS },
];

const firstNames = [
  'Rohan', 'Amit', 'Priya', 'Rajesh', 'Sneh', 'Vikram', 'Ananya', 'Suresh', 'Deepak', 'Meera',
  'Karan', 'Pooja', 'Rahul', 'Neha', 'Sanjay', 'Sunita', 'Manish', 'Kavita', 'Ramesh', 'Aarti',
  'Vikas', 'Preeti', 'Alok', 'Shweta', 'Nikhil', 'Divya', 'Gaurav', 'Ritu', 'Arjun', 'Sneha',
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Patel', 'Joshi', 'Mehta', 'Kumar', 'Shah', 'Agarwal',
  'Rao', 'Reddy', 'Nair', 'Chawla', 'Deshmukh', 'Kulkarni', 'Bhat', 'Malhotra', 'Kapoor', 'Saxena',
];

const companyTypes = ['Traders', 'Enterprises', 'Industries', 'Solutions', 'Logistics', 'Supplies', 'Corporation', 'Hardware Mart', 'Agencies', 'Hub'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Ahmedabad', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur', 'Surat'];

const productBases = [
  { name: 'Copper Cable Wire 10mm', cat: 'Electrical', price: 450, stock: 120, min: 20 },
  { name: 'Industrial Safety Helmet - Yellow', cat: 'Safety Gear', price: 350, stock: 85, min: 15 },
  { name: 'Stainless Steel Bolt M8 x 50', cat: 'Fasteners', price: 12, stock: 2500, min: 500 },
  { name: 'PVC Rigid Conduit Pipe 25mm', cat: 'Plumbing', price: 180, stock: 400, min: 50 },
  { name: 'Heavy Duty Angle Grinder 850W', cat: 'Tools & Machinery', price: 2800, stock: 25, min: 5 },
  { name: 'High-Visibility Safety Vest', cat: 'Safety Gear', price: 220, stock: 150, min: 30 },
  { name: 'Brass Ball Valve 1/2 Inch', cat: 'Plumbing', price: 320, stock: 60, min: 10 },
  { name: 'LED Floodlight 100W IP65', cat: 'Electrical', price: 1450, stock: 40, min: 8 },
  { name: 'Galvanized Iron Wire Mesh', cat: 'Building Materials', price: 950, stock: 75, min: 10 },
  { name: 'Digital Clamp Meter Pro', cat: 'Electronics', price: 1850, stock: 18, min: 4 },
  { name: 'Heavy Duty Drill Bit Set (13 Pcs)', cat: 'Tools & Machinery', price: 650, stock: 90, min: 15 },
  { name: 'Nylon Cable Ties 300mm (Pack of 100)', cat: 'Hardware', price: 140, stock: 600, min: 100 },
  { name: 'Industrial Heat Resistant Gloves', cat: 'Safety Gear', price: 280, stock: 110, min: 20 },
  { name: 'Miniature Circuit Breaker (MCB) 32A', cat: 'Electrical', price: 240, stock: 300, min: 40 },
  { name: 'Waterproof Junction Box IP66', cat: 'Electrical', price: 190, stock: 180, min: 25 },
];

export async function runDatabaseSeed() {
  console.log('🚀 Starting bulk database seeding (~100 sample records per entity)...');

  // Ensure DB schema matches missing migrations
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;`);
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
          CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ApprovalRequest" (
          "id" SERIAL NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "category" TEXT NOT NULL,
          "targetRole" "Role" NOT NULL,
          "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
          "requestedById" INTEGER NOT NULL,
          "reviewedById" INTEGER,
          "reviewNote" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
      );
    `);
  } catch (schemaErr) {
    console.log('[AutoSeed Schema Sync Note]:', schemaErr);
  }

  const passwordHash = await hashPassword(INITIAL_PASSWORD);

  // 1. Seed System Users
  const createdUsers: any[] = [];
  for (const uData of seedUsers) {
    const user = await prisma.user.upsert({
      where: { email: uData.email },
      update: { name: uData.name, role: uData.role, passwordHash },
      create: { name: uData.name, email: uData.email, passwordHash, role: uData.role },
    });
    createdUsers.push(user);
  }
  const adminUser = createdUsers.find((u) => u.role === Role.ADMIN) || createdUsers[0];
  const salesUser = createdUsers.find((u) => u.role === Role.SALES) || createdUsers[0];
  const warehouseUser = createdUsers.find((u) => u.role === Role.WAREHOUSE) || createdUsers[0];
  const accountsUser = createdUsers.find((u) => u.role === Role.ACCOUNTS) || createdUsers[0];

  // 2. Seed 100 Customers
  console.log('Creating 100 Customers...');
  const customerTypes: CustomerType[] = [CustomerType.RETAIL, CustomerType.WHOLESALE, CustomerType.DISTRIBUTOR];
  const customerStatuses: CustomerStatus[] = [CustomerStatus.ACTIVE, CustomerStatus.LEAD, CustomerStatus.INACTIVE];
  const createdCustomers: any[] = [];

  for (let i = 1; i <= 100; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const company = companyTypes[i % companyTypes.length];
    const city = cities[i % cities.length];
    const type = customerTypes[i % customerTypes.length];
    const status = customerStatuses[i % 3 === 0 ? 1 : i % 5 === 0 ? 2 : 0];

    const mobile = `98765${String(10000 + i).slice(0, 5)}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@business.com`;
    const gstNumber = `27${fn.slice(0, 2).toUpperCase()}PA${1000 + i}A1Z${i % 9 + 1}`;

    const customer = await prisma.customer.upsert({
      where: { id: i },
      update: {
        name: `${fn} ${ln}`,
        mobile,
        email,
        businessName: `${ln} ${company}`,
        gstNumber,
        customerType: type,
        address: `Plot #${10 + i}, Industrial Zone, ${city}`,
        status,
      },
      create: {
        id: i,
        name: `${fn} ${ln}`,
        mobile,
        email,
        businessName: `${ln} ${company}`,
        gstNumber,
        customerType: type,
        address: `Plot #${10 + i}, Industrial Zone, ${city}`,
        status,
        followUpDate: status === CustomerStatus.LEAD ? new Date(Date.now() + i * 86400000) : null,
        notes: `Regular client in ${city} region. Preferred contact mode: Mobile/WhatsApp.`,
      },
    });
    createdCustomers.push(customer);
  }

  // 3. Seed 100 Products
  console.log('Creating 100 Products...');
  const createdProducts: any[] = [];

  for (let i = 1; i <= 100; i++) {
    const base = productBases[i % productBases.length];
    const sku = `SKU-IND-${1000 + i}`;
    const name = `${base.name} Mod #${i}`;
    const price = base.price + (i % 15) * 10;
    const currentStock = Math.max(0, (i * 13) % 200 - 10);
    const minimumStock = base.min;
    const loc = `Warehouse Section ${String.fromCharCode(65 + (i % 6))}-${(i % 10) + 1}`;

    const product = await prisma.product.upsert({
      where: { sku },
      update: {
        name,
        category: base.cat,
        unitPrice: price,
        currentStock,
        minimumStock,
        warehouseLocation: loc,
      },
      create: {
        name,
        sku,
        category: base.cat,
        unitPrice: price,
        currentStock,
        minimumStock,
        warehouseLocation: loc,
        imageUrl: '',
      },
    });
    createdProducts.push(product);
  }

  // 4. Seed 50 Sales Challans
  console.log('Creating 50 Sales Challans...');
  const challanStatuses: ChallanStatus[] = [ChallanStatus.CONFIRMED, ChallanStatus.DRAFT, ChallanStatus.CANCELLED];

  for (let i = 1; i <= 50; i++) {
    const challanNumber = `CH-2026-${1000 + i}`;
    const customer = createdCustomers[i % createdCustomers.length];
    const status = challanStatuses[i % 4 === 0 ? 1 : i % 7 === 0 ? 2 : 0];

    const p1 = createdProducts[i % createdProducts.length];
    const p2 = createdProducts[(i + 5) % createdProducts.length];
    const q1 = (i % 5) + 2;
    const q2 = (i % 3) + 1;
    const totalQuantity = q1 + q2;

    const existingChallan = await prisma.challan.findUnique({ where: { challanNumber } });

    if (!existingChallan) {
      await prisma.challan.create({
        data: {
          challanNumber,
          customerId: customer.id,
          status,
          totalQuantity,
          createdById: salesUser.id,
          items: {
            create: [
              {
                productId: p1.id,
                productNameSnapshot: p1.name,
                skuSnapshot: p1.sku,
                unitPriceSnapshot: p1.unitPrice,
                quantity: q1,
              },
              {
                productId: p2.id,
                productNameSnapshot: p2.name,
                skuSnapshot: p2.sku,
                unitPriceSnapshot: p2.unitPrice,
                quantity: q2,
              },
            ],
          },
        },
      });
    }
  }

  // 5. Seed Stock Movements
  console.log('Creating 50 Stock Movement Logs...');
  for (let i = 1; i <= 50; i++) {
    const p = createdProducts[i % createdProducts.length];
    const type = i % 2 === 0 ? StockMovementType.IN : StockMovementType.OUT;
    const qty = (i % 10) * 5 + 5;

    await prisma.stockMovement.create({
      data: {
        productId: p.id,
        quantity: qty,
        type,
        reason: type === StockMovementType.IN ? `Bulk Inward Shipment PO #${8000 + i}` : `Dispatched for Sales Order CH-2026-${1000 + i}`,
        createdById: warehouseUser.id,
      },
    });
  }

  // 6. Seed Approval Requests
  console.log('Creating 30 Inter-Department Requests...');
  const reqCategories = [
    'Express Stock Reservation',
    'Payment Clearance & Credit Hold',
    'Extra Discount Approval',
    'Product Substitution / Stock Shortage',
    'Freight & Shipping Charge Release',
  ];
  const targetRoles: Role[] = [Role.WAREHOUSE, Role.ACCOUNTS, Role.SALES, Role.ADMIN];
  const reqStatuses: RequestStatus[] = [RequestStatus.PENDING, RequestStatus.APPROVED, RequestStatus.REJECTED];

  for (let i = 1; i <= 30; i++) {
    const category = reqCategories[i % reqCategories.length];
    const targetRole = targetRoles[i % targetRoles.length];
    const status = reqStatuses[i % 3];
    const requester = i % 2 === 0 ? salesUser : warehouseUser;
    const reviewer = status !== RequestStatus.PENDING ? (targetRole === Role.ADMIN ? adminUser : accountsUser) : null;

    await prisma.approvalRequest.create({
      data: {
        title: `Request #${100 + i}: ${category} for Order #${5000 + i}`,
        description: `High-priority customer request requiring clearance from ${targetRole} team. Urgency: ${i % 2 === 0 ? 'High' : 'Normal'}.`,
        category,
        targetRole,
        status,
        requestedById: requester.id,
        reviewedById: reviewer ? reviewer.id : null,
        reviewNote: status === RequestStatus.APPROVED ? 'Approved after review by department lead.' : status === RequestStatus.REJECTED ? 'Declined due to policy/credit limits.' : null,
      },
    });
  }

  console.log('🎉 Bulk Database Seeding Completed Successfully!');
  return true;
}

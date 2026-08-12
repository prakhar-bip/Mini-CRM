import React, { useState, useEffect, useCallback } from 'react';
import { axiosClient } from '../../api/axiosClient';
import { useAuth } from '../../auth/authContext';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  X,
  AlertCircle,
  ArrowRightLeft,
} from 'lucide-react';

interface RequestsViewProps {
  autoOpenTrigger?: number;
}

export const RequestsView: React.FC<RequestsViewProps> = ({ autoOpenTrigger }) => {
  const { user } = useAuth();
  const userRole = user?.role || 'SALES';

  const [activeTab, setActiveTab] = useState<'assigned' | 'sent'>('assigned');
  const [assignedRequests, setAssignedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [reviewingRequest, setReviewingRequest] = useState<any | null>(null);
  const [reviewActionType, setReviewActionType] = useState<'approve' | 'reject'>('approve');
  const [reviewNote, setReviewNote] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [newReq, setNewReq] = useState({
    title: '',
    category: 'Express Stock Reservation',
    targetRole: 'WAREHOUSE',
    description: '',
  });

  useEffect(() => {
    if (autoOpenTrigger && autoOpenTrigger > 0) {
      setShowSubmitModal(true);
    }
  }, [autoOpenTrigger]);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/requests');
      setAssignedRequests(res.data.assigned || []);
      setSentRequests(res.data.sent || []);
    } catch (err: any) {
      console.warn('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleSubmitNewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReq.title.trim() || !newReq.description.trim()) return;

    setFormError(null);
    setSubmitting(true);

    try {
      const res = await axiosClient.post('/requests', {
        title: newReq.title.trim(),
        category: newReq.category,
        targetRole: newReq.targetRole,
        description: newReq.description.trim(),
      });

      setSuccessMsg(res.data.message || 'Request submitted successfully!');
      setShowSubmitModal(false);
      setNewReq({
        title: '',
        category: 'Express Stock Reservation',
        targetRole: 'WAREHOUSE',
        description: '',
      });
      loadRequests();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewingRequest) return;
    setFormError(null);
    setSubmitting(true);

    try {
      const endpoint = `/requests/${reviewingRequest.id}/${reviewActionType}`;
      const res = await axiosClient.put(endpoint, {
        reviewNote: reviewNote.trim() || undefined,
      });

      setSuccessMsg(res.data.message || `Request ${reviewActionType.toUpperCase()}D successfully!`);
      setReviewingRequest(null);
      setReviewNote('');
      loadRequests();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setFormError(err.response?.data?.message || `Failed to ${reviewActionType} request`);
    } finally {
      setSubmitting(false);
    }
  };

  const pendingAssignedCount = assignedRequests.filter((r) => r.status === 'PENDING').length;
  const pendingSentCount = sentRequests.filter((r) => r.status === 'PENDING').length;

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Inter-Department Requests & Approvals</h2>
          <p style={styles.subheading}>
            Peer-to-peer workflow approvals across Sales, Warehouse, Accounts, and Executive Admin teams.
          </p>
        </div>
        <button onClick={() => setShowSubmitModal(true)} style={styles.addBtn}>
          <Plus size={16} />
          <span>+ Submit Inter-Department Request</span>
        </button>
      </div>

      {successMsg && (
        <div style={styles.successBanner}>
          <CheckCircle2 size={16} color="#45C98A" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="#5B90E5" />
            <span style={styles.statLabel}>Pending Assigned To My Dept</span>
          </div>
          <strong style={styles.statVal}>{pendingAssignedCount}</strong>
          <span style={styles.statSub}>Awaiting {userRole} Department Review</span>
        </div>

        <div style={styles.statCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowRightLeft size={16} color="#45C98A" />
            <span style={styles.statLabel}>My Submitted Requests</span>
          </div>
          <strong style={styles.statVal}>{sentRequests.length}</strong>
          <span style={styles.statSub}>{pendingSentCount} Pending • {sentRequests.length - pendingSentCount} Resolved</span>
        </div>

        <div style={styles.statCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#45C98A" />
            <span style={styles.statLabel}>Approved Requests</span>
          </div>
          <strong style={{ ...styles.statVal, color: '#45C98A' }}>
            {assignedRequests.filter((r) => r.status === 'APPROVED').length}
          </strong>
          <span style={styles.statSub}>Target Role Clearance</span>
        </div>

        <div style={styles.statCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={16} color="#E76576" />
            <span style={styles.statLabel}>Rejected Requests</span>
          </div>
          <strong style={{ ...styles.statVal, color: '#E76576' }}>
            {assignedRequests.filter((r) => r.status === 'REJECTED').length}
          </strong>
          <span style={styles.statSub}>Declined Requests</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={styles.tabHeader}>
        <button
          onClick={() => setActiveTab('assigned')}
          style={{
            ...styles.tabBtn,
            borderBottom: activeTab === 'assigned' ? '2px solid #5B90E5' : 'none',
            color: activeTab === 'assigned' ? '#5B90E5' : 'var(--text-sub)',
            fontWeight: activeTab === 'assigned' ? 700 : 600,
          }}
        >
          <span>Assigned to My Department ({userRole})</span>
          {pendingAssignedCount > 0 && <span style={styles.badge}>{pendingAssignedCount}</span>}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          style={{
            ...styles.tabBtn,
            borderBottom: activeTab === 'sent' ? '2px solid #5B90E5' : 'none',
            color: activeTab === 'sent' ? '#5B90E5' : 'var(--text-sub)',
            fontWeight: activeTab === 'sent' ? 700 : 600,
          }}
        >
          <span>My Submitted Requests</span>
        </button>
      </div>

      {/* Requests Table */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request Details</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>{activeTab === 'assigned' ? 'Requested By' : 'Target Department'}</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Submitted Date</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Actions / Notes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>
                  Loading requests...
                </td>
              </tr>
            ) : (activeTab === 'assigned' ? assignedRequests : sentRequests).length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-sub)' }}>
                  No requests found in this tab.
                </td>
              </tr>
            ) : (
              (activeTab === 'assigned' ? assignedRequests : sentRequests).map((reqItem) => (
                <tr key={reqItem.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div>
                      <strong style={{ fontSize: '0.9rem' }}>{reqItem.title}</strong>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-sub)' }}>
                        {reqItem.description}
                      </p>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.catBadge}>{reqItem.category}</span>
                  </td>
                  <td style={styles.td}>
                    {activeTab === 'assigned' ? (
                      <div>
                        <strong>{reqItem.requestedBy?.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>
                          Role: <code>{reqItem.requestedBy?.role}</code>
                        </div>
                      </div>
                    ) : (
                      <span style={styles.roleBadge}>{reqItem.targetRole}</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor:
                          reqItem.status === 'APPROVED'
                            ? '#F0FDF4'
                            : reqItem.status === 'PENDING'
                            ? '#EFF6FF'
                            : '#FEF2F2',
                        color:
                          reqItem.status === 'APPROVED'
                            ? '#45C98A'
                            : reqItem.status === 'PENDING'
                            ? '#5B90E5'
                            : '#E76576',
                      }}
                    >
                      {reqItem.status}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(reqItem.createdAt).toISOString().slice(0, 10)}</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    {activeTab === 'assigned' && reqItem.status === 'PENDING' ? (
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setReviewingRequest(reqItem);
                            setReviewActionType('approve');
                            setReviewNote('');
                          }}
                          style={styles.approveBtn}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setReviewingRequest(reqItem);
                            setReviewActionType('reject');
                            setReviewNote('');
                          }}
                          style={styles.rejectBtn}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.78rem' }}>
                        {reqItem.reviewedBy && (
                          <div style={{ fontWeight: 600 }}>Reviewed by: {reqItem.reviewedBy.name}</div>
                        )}
                        {reqItem.reviewNote && (
                          <div style={{ fontStyle: 'italic', color: 'var(--text-sub)' }}>"{reqItem.reviewNote}"</div>
                        )}
                        {!reqItem.reviewedBy && reqItem.status === 'PENDING' && (
                          <span style={{ color: '#5B90E5', fontStyle: 'italic' }}>Awaiting Review</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal (Approve / Reject) */}
      {reviewingRequest && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, color: reviewActionType === 'approve' ? '#45C98A' : '#E76576' }}>
                {reviewActionType === 'approve' ? 'Approve Inter-Department Request' : 'Reject Request'}
              </h3>
              <button onClick={() => setReviewingRequest(null)} style={styles.closeBtn} disabled={submitting}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
              <strong>{reviewingRequest.title}</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-sub)' }}>
                {reviewingRequest.description}
              </p>
              <div style={{ marginTop: '8px', fontSize: '0.78rem' }}>
                Requested by <strong>{reviewingRequest.requestedBy?.name}</strong> ({reviewingRequest.requestedBy?.role}) for <code>{reviewingRequest.targetRole}</code> department.
              </div>
            </div>

            {formError && (
              <div style={{ ...styles.errorBox, marginTop: '12px' }}>
                <AlertCircle size={14} color="#E76576" />
                <span>{formError}</span>
              </div>
            )}

            <div style={{ marginTop: '14px' }}>
              <label style={styles.label}>Review Note / Response Comment (Optional)</label>
              <textarea
                rows={2}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                style={styles.input}
                placeholder={
                  reviewActionType === 'approve'
                    ? 'e.g. Approved. Stock reserved in Rack B2.'
                    : 'e.g. Rejected. Dues not cleared.'
                }
              />
            </div>

            <div style={styles.modalActions}>
              <button type="button" onClick={() => setReviewingRequest(null)} style={styles.cancelBtn} disabled={submitting}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReviewSubmit}
                style={reviewActionType === 'approve' ? styles.approveSubmitBtn : styles.rejectSubmitBtn}
                disabled={submitting}
              >
                {submitting ? 'Processing...' : `Confirm ${reviewActionType.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {showSubmitModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Submit Inter-Department Request</h3>
              <button onClick={() => setShowSubmitModal(false)} style={styles.closeBtn} disabled={submitting}>
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div style={{ ...styles.errorBox, marginTop: '12px' }}>
                <AlertCircle size={14} color="#E76576" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitNewRequest} style={styles.form}>
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>Target Department / Role *</label>
                  <select
                    value={newReq.targetRole}
                    onChange={(e) => setNewReq({ ...newReq, targetRole: e.target.value })}
                    style={styles.input}
                  >
                    <option value="WAREHOUSE">WAREHOUSE (Stock & Dispatch)</option>
                    <option value="SALES">SALES (CRM & Account Mgmt)</option>
                    <option value="ACCOUNTS">ACCOUNTS (Finance & Payments)</option>
                    <option value="ADMIN">ADMIN (Executive Override)</option>
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Request Category *</label>
                  <select
                    value={newReq.category}
                    onChange={(e) => setNewReq({ ...newReq, category: e.target.value })}
                    style={styles.input}
                  >
                    <option value="Express Stock Reservation">Express Stock Reservation</option>
                    <option value="Payment Clearance & Credit Hold">Payment Clearance & Credit Hold</option>
                    <option value="Extra Discount Approval">Extra Discount Approval</option>
                    <option value="Product Substitution / Stock Shortage">Product Substitution / Stock Shortage</option>
                    <option value="Freight & Shipping Charge Release">Freight & Shipping Charge Release</option>
                    <option value="Other Operational Approval">Other Operational Approval</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={styles.label}>Request Subject / Title *</label>
                <input
                  required
                  type="text"
                  value={newReq.title}
                  onChange={(e) => setNewReq({ ...newReq, title: e.target.value })}
                  style={styles.input}
                  placeholder="e.g. Reserve 50 Units Copper Wire for Sharma Electronics"
                />
              </div>

              <div>
                <label style={styles.label}>Detailed Description & Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={newReq.description}
                  onChange={(e) => setNewReq({ ...newReq, description: e.target.value })}
                  style={styles.input}
                  placeholder="Provide context and justification for the target department..."
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowSubmitModal(false)} style={styles.cancelBtn} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    margin: 0,
  },
  subheading: {
    fontSize: '0.85rem',
    color: 'var(--text-sub)',
    margin: '4px 0 0 0',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.85rem',
    border: 'none',
    cursor: 'pointer',
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '8px',
    color: '#45C98A',
    fontWeight: 600,
    fontSize: '0.85rem',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: '8px',
    color: '#E76576',
    fontSize: '0.85rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  statCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-sub)',
    fontWeight: 600,
  },
  statVal: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--text-main)',
  },
  statSub: {
    fontSize: '0.75rem',
    color: 'var(--text-sub)',
  },
  tabHeader: {
    display: 'flex',
    gap: '20px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '2px',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '8px 12px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  badge: {
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    fontSize: '0.7rem',
    fontWeight: 700,
    borderRadius: '10px',
    padding: '2px 6px',
  },
  tableCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    backgroundColor: 'var(--bg-section)',
    color: 'var(--text-main)',
    fontWeight: 700,
    borderBottom: '1px solid var(--border-color)',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
  },
  td: {
    padding: '12px',
    color: 'var(--text-main)',
  },
  catBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#5B90E5',
    backgroundColor: 'var(--very-light-blue)',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  roleBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  statusBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '6px',
  },
  approveBtn: {
    padding: '4px 10px',
    backgroundColor: '#45C98A',
    color: '#FFFFFF',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
  },
  rejectBtn: {
    padding: '4px 10px',
    backgroundColor: '#E76576',
    color: '#FFFFFF',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1200,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '24px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border-color)',
  },
  closeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-sub)',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginTop: '12px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: 'var(--bg-section)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-main)',
    fontSize: '0.85rem',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '16px',
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: 'var(--text-main)',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '8px 16px',
    backgroundColor: '#5B90E5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  approveSubmitBtn: {
    padding: '8px 16px',
    backgroundColor: '#45C98A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  rejectSubmitBtn: {
    padding: '8px 16px',
    backgroundColor: '#E76576',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
};

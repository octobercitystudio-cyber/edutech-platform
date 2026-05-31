import React from 'react';

export default function Assignments() {
  // Using Assignments.jsx as the Activities view as mapped in Sidebar
  
  return (
    <div className="fade-in" style={{padding: '20px 0'}}>
      
      {/* Top Row: Timeline and Wallet History */}
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px'}}>
        
        {/* Timeline Events */}
        <div style={{...styles.card, flex: '1 1 400px'}}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Timeline events</h3>
            <span style={styles.viewAll}>View All</span>
          </div>
          <div style={{overflowX: 'auto'}}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Events</th>
                  <th>Date</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="3" style={styles.emptyState}>No events yet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Wallet History */}
        <div style={{...styles.card, flex: '1 1 400px'}}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Wallet history</h3>
            <span style={styles.viewAll}>View All</span>
          </div>
          <div style={{overflowX: 'auto'}}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>After</th>
                  <th>Amount</th>
                  <th>Before</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" style={styles.emptyState}>No history yet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Bottom Row: Invoices */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Invoices</h3>
          <span style={styles.viewAll}>View All</span>
        </div>
        
        <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px'}}>
          
          {/* Invoice Card Mockup */}
          <div style={styles.invoiceCard}>
            <div style={styles.invoiceHeader}>
              <div style={{fontSize: '0.8rem', opacity: 0.8, marginBottom: '5px'}}>رقم الفاتورة</div>
              <div style={{fontWeight: 'bold', fontSize: '1.2rem'}}>r-0000693937</div>
            </div>
            
            <div style={styles.invoiceBody}>
              <div style={styles.invoiceRow}>
                <div style={styles.invoiceItem}>
                  <span style={styles.invoiceLabel}>تاريخ الفاتورة</span>
                  <span style={styles.invoiceValue}>30/05/2026<br/>08:27 م</span>
                </div>
                <div style={styles.invoiceItem}>
                  <span style={styles.invoiceLabel}>المبلغ</span>
                  <span style={styles.invoiceValue}>L.E 100</span>
                </div>
              </div>
              
              <div style={styles.invoiceRow}>
                <div style={styles.invoiceItem}>
                  <span style={styles.invoiceLabel}>النوع</span>
                  <span style={{...styles.invoiceValue, color: '#f97316'}}>Recharge</span>
                </div>
                <div style={styles.invoiceItem}>
                  <span style={styles.invoiceLabel}>الحالة</span>
                  <span style={{...styles.invoiceValue, color: '#38bdf8'}}>New</span>
                </div>
              </div>
              
              <div style={styles.invoiceRow}>
                <div style={styles.invoiceItem}>
                  <span style={styles.invoiceLabel}>طريقة الدفع</span>
                  <span style={styles.invoiceValue}>Opay</span>
                </div>
                <div style={styles.invoiceItem}>
                  <span style={styles.invoiceLabel}>الرقم المرجعى</span>
                  <span style={styles.invoiceValue}>26053014818<br/>7312258731</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    padding: '25px',
    border: '1px solid #f8fafc',
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  cardTitle: {
    margin: 0,
    color: '#1e293b',
    fontSize: '1.2rem',
    direction: 'ltr'
  },
  viewAll: {
    color: '#64748b',
    fontSize: '0.9rem',
    cursor: 'pointer',
    direction: 'ltr'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'center',
    direction: 'ltr'
  },
  emptyState: {
    padding: '40px 20px',
    color: '#cbd5e1',
    fontStyle: 'italic'
  },
  invoiceCard: {
    width: '300px',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff'
  },
  invoiceHeader: {
    backgroundColor: '#33354b', // matching the dark blue/gray
    color: '#fff',
    padding: '20px',
    textAlign: 'center'
  },
  invoiceBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  invoiceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  invoiceItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    textAlign: 'center'
  },
  invoiceLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginBottom: '5px'
  },
  invoiceValue: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#1e293b'
  }
};

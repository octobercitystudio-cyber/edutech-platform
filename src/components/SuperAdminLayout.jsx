import React from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';

export default function SuperAdminLayout() {
  return (
    <div className="app-layout" style={{ backgroundColor: '#f1f5f9' }}>
      <SuperAdminSidebar />
      <div className="main-content">
        {/* We can hide the normal header or style it */}
        <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '15px 30px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#0f172a' }}>المدير العام</span>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#0f172a', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>SA</div>
          </div>
        </div>
        <main className="page-content" style={{ padding: '30px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

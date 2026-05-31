import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MdEdit, MdDelete, MdCheck, MdClose } from 'react-icons/md';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data) setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditRole(user.role || 'student');
  };

  const saveEdit = async (userId) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: editRole })
        .eq('id', userId);
        
      if (!error) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: editRole } : u));
        setEditingUserId(null);
      } else {
        alert('حدث خطأ أثناء التحديث');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const blockUser = async (userId) => {
    if (window.confirm('هل أنت متأكد من حظر هذا المستخدم؟ لن يتمكن من تسجيل الدخول.')) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ role: 'blocked' })
          .eq('id', userId);
          
        if (!error) {
          setUsers(users.map(u => u.id === userId ? { ...u, role: 'blocked' } : u));
        } else {
          alert('حدث خطأ أثناء حظر المستخدم');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.phone && user.phone.includes(searchQuery)) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px'}}>
        <h1 style={{color: 'var(--primary-color)', margin: 0}}>إدارة المستخدمين والصلاحيات</h1>
        <div style={{position: 'relative', width: '300px'}}>
          <input 
            type="text" 
            placeholder="البحث بالاسم، الهاتف، أو الإيميل..." 
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{paddingRight: '15px'}}
          />
        </div>
      </div>
      
      <div className="card" style={{padding: 'var(--space-6)'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '40px'}}>جاري تحميل المستخدمين...</div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
              <thead>
                <tr style={{borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)'}}>
                  <th style={{padding: '15px'}}>الاسم</th>
                  <th style={{padding: '15px'}}>المعرف (ID)</th>
                  <th style={{padding: '15px'}}>تاريخ التسجيل</th>
                  <th style={{padding: '15px'}}>الصلاحية (Role)</th>
                  <th style={{padding: '15px', textAlign: 'center'}}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>لا يوجد مستخدمين مطابقين للبحث</td></tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                      <td style={{padding: '15px', fontWeight: 'bold'}}>{user.name || 'بدون اسم'}</td>
                      <td style={{padding: '15px', color: 'var(--text-muted)', fontSize: '0.85rem'}}>{user.id.split('-')[0]}...</td>
                      <td style={{padding: '15px', color: 'var(--text-muted)'}}>{new Date(user.created_at).toLocaleDateString('ar-EG')}</td>
                      
                      <td style={{padding: '15px'}}>
                        {editingUserId === user.id ? (
                          <select 
                            value={editRole} 
                            onChange={(e) => setEditRole(e.target.value)}
                            style={{padding: '5px 10px', borderRadius: '5px', border: '1px solid var(--border-color)'}}
                          >
                            <option value="student">طالب</option>
                            <option value="teacher">معلم</option>
                            <option value="admin">أدمن</option>
                            <option value="assistant">مساعد</option>
                            <option value="parent">ولي أمر</option>
                            <option value="blocked">محظور</option>
                          </select>
                        ) : (
                          <span className={`badge ${user.role === 'admin' ? 'badge-secondary' : user.role === 'blocked' ? 'badge-danger' : 'badge-primary'}`} style={user.role === 'blocked' ? {backgroundColor: '#fee2e2', color: '#ef4444'} : {}}>
                            {user.role || 'student'}
                          </span>
                        )}
                      </td>
                      
                      <td style={{padding: '15px', textAlign: 'center'}}>
                        {editingUserId === user.id ? (
                          <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                            <button onClick={() => saveEdit(user.id)} style={{background: 'none', border: 'none', color: '#10b981', cursor: 'pointer'}} title="حفظ"><MdCheck size={24} /></button>
                            <button onClick={() => setEditingUserId(null)} style={{background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer'}} title="إلغاء"><MdClose size={24} /></button>
                          </div>
                        ) : (
                          <div style={{display: 'flex', justifyContent: 'center', gap: '15px'}}>
                            <button onClick={() => startEdit(user)} style={{background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer'}} title="تعديل الصلاحية">
                              <MdEdit size={20} />
                            </button>
                            <button onClick={() => blockUser(user.id)} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer'}} title="حظر المستخدم">
                              <MdDelete size={20} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

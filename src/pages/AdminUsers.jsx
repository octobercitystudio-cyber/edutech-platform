import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MdEdit, MdDelete, MdCheck, MdClose } from 'react-icons/md';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student'
  });

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

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // For MVP, we insert directly into profiles with a mock UUID
      // In production, this would use Supabase Admin API to create auth user first
      const mockId = 'mock-' + Date.now();
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: mockId,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role
        }])
        .select();

      if (error) throw error;
      
      if (data) {
        setUsers([data[0], ...users]);
        setShowAddModal(false);
        setNewUser({ name: '', email: '', phone: '', role: 'student' });
        alert('تمت إضافة المستخدم بنجاح!');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة المستخدم');
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
        
        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
          <div style={{position: 'relative', width: '250px'}}>
            <input 
              type="text" 
              placeholder="البحث بالاسم أو الهاتف..." 
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + إضافة مستخدم
          </button>
        </div>
      </div>

      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card fade-in" style={{width: '90%', maxWidth: '500px', padding: '30px', position: 'relative'}}>
            <button 
              onClick={() => setShowAddModal(false)}
              style={{position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem'}}
            >
              <MdClose />
            </button>
            
            <h2 style={{color: 'var(--primary-color)', marginTop: 0}}>إضافة مستخدم جديد</h2>
            <form onSubmit={handleAddUser} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <input type="text" placeholder="الاسم الكامل" required className="form-control" 
                value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
              
              <input type="email" placeholder="البريد الإلكتروني" required className="form-control" 
                value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              
              <input type="tel" placeholder="رقم الهاتف" required className="form-control" 
                value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} />
              
              <select className="form-control" required value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                <option value="student">طالب</option>
                <option value="teacher">معلم</option>
                <option value="assistant">مساعد معلم</option>
                <option value="parent">ولي أمر</option>
                <option value="admin">مدير (أدمن)</option>
              </select>
                
              <button type="submit" className="btn btn-primary" style={{marginTop: '10px'}}>إضافة المستخدم</button>
            </form>
          </div>
        </div>
      )}
      
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

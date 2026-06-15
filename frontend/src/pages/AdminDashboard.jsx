import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getUsers()])
      .then(([s, u]) => {
        setStats(s.data.stats);
        setUsers(u.data.users);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <div className="p-20 text-center text-accent">Loading Admin Data...</div>;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-accent">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glassmorphism p-6 rounded-2xl border border-accent/30 text-center">
          <div className="text-4xl font-bold text-accent mb-2">{stats.totalUsers}</div>
          <div className="text-gray-400 text-sm">Total Users</div>
        </div>
        <div className="glassmorphism p-6 rounded-2xl border border-primary/30 text-center">
          <div className="text-4xl font-bold text-primary mb-2">{stats.totalSimulations}</div>
          <div className="text-gray-400 text-sm">Total Simulations</div>
        </div>
        <div className="glassmorphism p-6 rounded-2xl border border-secondary/30 text-center">
          <div className="text-4xl font-bold text-secondary mb-2">{stats.avgSkillScore}</div>
          <div className="text-gray-400 text-sm">Avg Skill Score</div>
        </div>
        <div className="glassmorphism p-6 rounded-2xl border border-red-500/30 text-center">
          <div className="text-4xl font-bold text-red-400 mb-2">{stats.avgRiskScore}</div>
          <div className="text-gray-400 text-sm">Avg Risk Score</div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <div className="glassmorphism rounded-2xl overflow-hidden mb-12">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Simulations</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4">{u.name} {u.role === 'admin' && <span className="text-accent text-xs ml-2 border border-accent rounded px-1">ADMIN</span>}</td>
                <td className="p-4 text-gray-400">{u.email}</td>
                <td className="p-4 text-gray-400">{u.role}</td>
                <td className="p-4 text-primary">{u.simCount}</td>
                <td className="p-4 text-right">
                  {!u.is_admin && <button onClick={() => handleDeleteUser(u.id)} className="text-sm text-red-400 hover:underline">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

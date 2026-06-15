import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { simulationAPI } from '../services/api';

const HistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    simulationAPI.getHistory(user.id)
      .then(res => setHistory(res.data.simulations))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this simulation?')) return;
    try {
      await simulationAPI.delete(id);
      setHistory(history.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="p-20 text-center">Loading history...</div>;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Simulation History</h1>
      
      {history.length === 0 ? (
        <div className="glassmorphism p-12 text-center rounded-2xl text-gray-400">
          No simulations yet. <button onClick={()=>navigate('/simulate')} className="text-primary hover:underline">Generate one now.</button>
        </div>
      ) : (
        <div className="glassmorphism rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm">
                  <th className="p-4">Date</th>
                  <th className="p-4">Decision</th>
                  <th className="p-4">Skill Score</th>
                  <th className="p-4">Risk Level</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map(sim => (
                  <tr key={sim.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-4 whitespace-nowrap text-gray-300">{new Date(sim.created_at).toLocaleDateString()}</td>
                    <td className="p-4 max-w-xs truncate text-white" title={sim.decision_text}>{sim.decision_text}</td>
                    <td className="p-4 font-medium text-primary">{sim.skill_score}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${sim.risk_score >= 60 ? 'bg-red-500/20 text-red-400' : sim.risk_score >= 35 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {sim.risk_score}/100
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3 whitespace-nowrap">
                      <button onClick={() => navigate(`/result/${sim.id}`)} className="text-sm text-primary hover:underline">View</button>
                      <button onClick={() => handleDelete(sim.id)} className="text-sm text-red-400 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

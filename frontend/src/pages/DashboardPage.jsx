import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { simulationAPI, profileAPI } from '../services/api';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profRes, histRes] = await Promise.all([
          profileAPI.get(user.id),
          simulationAPI.getHistory(user.id)
        ]);
        setProfile(profRes.data.profile);
        setHistory(histRes.data.simulations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user.id]);

  if (loading) return <div className="p-20 text-center">Loading Dashboard...</div>;

  const latestSim = history[0];

  const StatCard = ({ title, value, subtitle, color }) => (
    <motion.div whileHover={{ y: -5 }} className="glassmorphism p-6 rounded-2xl relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition`} />
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </motion.div>
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-gray-400">Here is your future simulation overview.</p>
        </div>
        <div className="flex gap-3">
            <button onClick={() => navigate('/')} aria-label="Back to Home" className="px-6 py-2.5 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 transition focus-visible:ring-2 focus-visible:ring-gray-400">← Back to Home</button>
            <button onClick={() => navigate('/simulate')} className="px-6 py-2.5 bg-primary text-background font-bold rounded-lg hover:bg-[#00e0eb] transition shadow-[0_0_15px_rgba(0,245,255,0.3)]">+ New Simulation</button>
        </div>
      </div>

      {!profile && (
        <div className="bg-secondary/10 border border-secondary/30 p-6 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-secondary mb-1">Profile Incomplete</h3>
            <p className="text-sm text-gray-400">Complete your profile to unlock accurate personalized simulations.</p>
          </div>
          <button onClick={() => navigate('/simulate')} className="px-5 py-2 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition whitespace-nowrap">
            Complete Profile
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Simulations" 
          value={history.length} 
          subtitle="Generated futures"
          color="from-blue-500 to-cyan-500"
        />
        <StatCard 
          title="Avg Skill Score" 
          value={latestSim ? `${latestSim.skill_score}/100` : '--'} 
          subtitle="Based on latest sim"
          color="from-purple-500 to-indigo-500"
        />
        <StatCard 
          title="Career Readiness" 
          value={latestSim ? `${latestSim.career_readiness_score}/100` : '--'} 
          subtitle="Market readiness"
          color="from-emerald-500 to-teal-500"
        />
        <StatCard 
          title="Risk Level" 
          value={latestSim ? `${latestSim.risk_score}/100` : '--'} 
          subtitle="Higher means more risk"
          color="from-rose-500 to-pink-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 glassmorphism p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-6">Recent Growth Projections</h2>
          {latestSim && latestSim.growth_projection ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { name: 'Current', skill: latestSim.skill_score },
                  { name: '3m', skill: latestSim.growth_projection.threeMonths },
                  { name: '6m', skill: latestSim.growth_projection.sixMonths },
                  { name: '1y', skill: latestSim.growth_projection.oneYear },
                  { name: '3y', skill: latestSim.growth_projection.threeYears },
                  { name: '5y', skill: latestSim.growth_projection.fiveYears },
                ]}>
                  <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#050816', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#00f5ff' }}
                  />
                  <Line type="monotone" dataKey="skill" stroke="#00f5ff" strokeWidth={3} dot={{ r: 4, fill: '#050816', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl">
              No projection data available yet.
            </div>
          )}
        </div>

        {/* AI Assistant / Recommend Area */}
        <div className="glassmorphism p-6 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-primary/20 blur-[50px] rounded-full"></div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="text-primary">✨</span> AI Insights</h2>
          
          <div className="flex-1 space-y-4">
            {latestSim && latestSim.recommendations ? (
              <>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-primary mb-1">Top Recommended Skill</div>
                  <div className="font-medium">{latestSim.recommendations.skills[0]}</div>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-accent mb-1">Focus Habit</div>
                  <div className="font-medium">{latestSim.recommendations.habits[0]}</div>
                </div>
                {latestSim.risk_score >= 50 && (
                  <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                    <div className="text-xs text-red-400 mb-1">High Risk Warning</div>
                    <div className="font-medium text-sm text-red-200">Consistency is low. Focus on daily practice.</div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-400 text-sm">
                Run a simulation to get personalized AI insights and roadmap recommendations.
              </div>
            )}
          </div>
          
                    <button onClick={() => navigate(latestSim ? `/result/${latestSim.id}` : '#')} aria-label="View Full Report" className="w-full mt-4 py-2 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition focus-visible:ring-2 focus-visible:ring-primary">View Full Report</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

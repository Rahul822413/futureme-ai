import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { simulationAPI, reportAPI } from '../services/api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';

const SimulationResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sim, setSim] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    simulationAPI.get(id)
      .then(res => setSim(res.data.simulation))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-20 text-center text-primary">Analyzing temporal data...</div>;
  if (!sim) return <div className="p-20 text-center">Simulation not found.</div>;

  const handleDownloadPDF = async () => {
    try {
      const res = await reportAPI.downloadPDF(sim.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FutureMe_Report_${sim.id.slice(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) { alert('Failed to download PDF'); }
  };

  const handleDownloadCSV = async () => {
    try {
      const res = await reportAPI.downloadCSV(sim.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FutureMe_Report_${sim.id.slice(0, 8)}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) { alert('Failed to download CSV'); }
  };

  const opt = sim.optimistic_scenario || {};
  const real = sim.realistic_scenario || {};
  const risk = sim.risk_scenario || {};
  const recs = sim.recommendations || {};

  const radarData = [
    { subject: 'Coding', A: sim.skill_score, fullMark: 100 },
    { subject: 'Consistency', A: sim.consistency_score, fullMark: 100 },
    { subject: 'Career Ready', A: sim.career_readiness_score, fullMark: 100 },
    { subject: 'Risk Factor', A: 100 - sim.risk_score, fullMark: 100 }, // inverted risk for radar
  ];

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary w-fit text-sm font-medium mb-4">
          Simulation Complete
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">"{sim.decision_text}"</h1>
        <p className="text-gray-400">Generated on {new Date(sim.created_at).toLocaleDateString()}</p>
        
        <div className="flex justify-center gap-4 pt-6">
          <button onClick={handleDownloadPDF} aria-label="Download PDF report" className="px-6 py-2.5 bg-primary/20 text-primary border border-primary/50 font-bold rounded-lg hover:bg-primary/30 transition focus-visible:ring-2 focus-visible:ring-primary">
            📄 Download PDF Report
          </button>
          <button onClick={handleDownloadCSV} aria-label="Export CSV report" className="px-6 py-2.5 bg-secondary/20 text-secondary border border-secondary/50 font-bold rounded-lg hover:bg-secondary/30 transition focus-visible:ring-2 focus-visible:ring-secondary">
            📊 Export CSV
          </button>
          <button onClick={() => navigate('/') } aria-label="Back to Home" className="px-6 py-2.5 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 transition focus-visible:ring-2 focus-visible:ring-gray-400">
            ← Back to Home
          </button>
        </div>
      </motion.div>

      {/* Scores & Radar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {[
            { label: 'Skill Score', val: sim.skill_score, col: 'text-primary' },
            { label: 'Consistency', val: sim.consistency_score, col: 'text-secondary' },
            { label: 'Career Readiness', val: sim.career_readiness_score, col: 'text-emerald-400' },
            { label: 'Risk Factor', val: sim.risk_score, col: 'text-red-400' }
          ].map((s, i) => (
            <div key={i} className="glassmorphism p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="text-sm text-gray-400 mb-2">{s.label}</div>
              <div className={`text-4xl font-bold ${s.col}`}>{s.val}/100</div>
            </div>
          ))}
        </div>
        
        <div className="glassmorphism p-6 rounded-2xl flex flex-col items-center justify-center">
          <h3 className="text-gray-300 font-medium mb-4">Profile Balance</h3>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                <Radar name="Profile" dataKey="A" stroke="#00f5ff" fill="#00f5ff" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* 3 Futures Cards */}
      <h2 className="text-3xl font-bold text-center mt-12 mb-8 border-t border-white/10 pt-12">Simulated Realities</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Optimistic */}
        <motion.div whileHover={{ y: -5 }} className="glassmorphism rounded-2xl p-6 relative overflow-hidden border border-primary/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full"></div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">✨</span>
            <h3 className="text-xl font-bold text-primary">Optimistic</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">{opt.summary}</p>
          {opt.narrative && (
            <div className="mb-4 p-3 bg-white/5 border-l-2 border-primary rounded-r-lg">
              <p className="text-sm italic text-gray-200">"{opt.narrative}"</p>
            </div>
          )}
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">Path:</span> <span className="text-white">{opt.careerPath}</span></div>
            <div><span className="text-gray-500">Growth:</span> <span className="text-white">{opt.growthEstimate}</span></div>
            <div><span className="text-gray-500 font-bold block mb-1">Key Actions:</span> 
              <ul className="list-disc pl-4 text-gray-300">{opt.requiredActions?.map((a,i)=><li key={i}>{a}</li>)}</ul>
            </div>
            {/* Scenario-specific recommendations */}
            <div className="mt-4">
              <span className="text-gray-500 font-bold block mb-1">Recommended Courses & Skills:</span>
              <ul className="list-disc pl-4 text-gray-300">
                {opt.recommendations?.courses?.slice(0,3).map((c,i)=> <li key={i}>{c}</li>)}
                {opt.recommendations?.skills?.slice(0,3).map((s,i)=> <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Realistic */}
        <motion.div whileHover={{ y: -5 }} className="glassmorphism rounded-2xl p-6 relative overflow-hidden border border-amber-500/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-[50px] rounded-full"></div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⚖️</span>
            <h3 className="text-xl font-bold text-amber-500">Realistic</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">{real.summary}</p>
          {real.narrative && (
            <div className="mb-4 p-3 bg-white/5 border-l-2 border-amber-500 rounded-r-lg">
              <p className="text-sm italic text-gray-200">"{real.narrative}"</p>
            </div>
          )}
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500">Expected:</span> <span className="text-white">{real.expectedProgress}</span></div>
            <div><span className="text-gray-500 block mb-1 font-bold">Strengths to Leverage:</span>
              <ul className="list-disc pl-4 text-gray-300">{real.strengths?.map((a,i)=><li key={i}>{a}</li>)}</ul>
            </div>
            {/* Scenario-specific recommendations */}
            <div className="mt-4">
              <span className="text-gray-500 font-bold block mb-1">Recommended Courses & Skills:</span>
              <ul className="list-disc pl-4 text-gray-300">
                {real.recommendations?.courses?.slice(0,3).map((c,i)=> <li key={i}>{c}</li>)}
                {real.recommendations?.skills?.slice(0,3).map((s,i)=> <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Risk */}
        <motion.div whileHover={{ y: -5 }} className="glassmorphism rounded-2xl p-6 relative overflow-hidden border border-red-500/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-[50px] rounded-full"></div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-xl font-bold text-red-400">Risk Warning</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">{risk.summary}</p>
          {risk.narrative && (
            <div className="mb-4 p-3 bg-white/5 border-l-2 border-red-500 rounded-r-lg">
              <p className="text-sm italic text-gray-200">"{risk.narrative}"</p>
            </div>
          )}
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500 block mb-1 font-bold">Recovery Strategy:</span>
              <ul className="list-disc pl-4 text-gray-300">{risk.recoveryStrategy?.map((a,i)=><li key={i}>{a}</li>)}</ul>
            </div>
            {/* Scenario-specific recommendations */}
            <div className="mt-4">
              <span className="text-gray-500 font-bold block mb-1">Recommended Courses & Skills:</span>
              <ul className="list-disc pl-4 text-gray-300">
                {risk.recommendations?.courses?.slice(0,3).map((c,i)=> <li key={i}>{c}</li>)}
                {risk.recommendations?.skills?.slice(0,3).map((s,i)=> <li key={i}>{s}</li>)}
              </ul>
            </div>
            {risk.skillGaps?.length > 0 && (
              <div><span className="text-gray-500 block mb-1">Critical Gaps:</span>
                <ul className="list-disc pl-4 text-red-200">{risk.skillGaps.map((a,i)=><li key={i}>{a}</li>)}</ul>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recommendations */}
      <h2 className="text-3xl font-bold text-center mt-12 mb-8 border-t border-white/10 pt-12">Your Action Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glassmorphism p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-primary mb-4">Recommended Courses & Skills</h3>
          <ul className="space-y-2">
            {recs.courses?.slice(0,3).map((c, i) => (
              <li key={i} className="flex items-center gap-3 text-sm bg-white/5 p-3 rounded-lg"><span className="text-primary">▶</span> {c}</li>
            ))}
            {recs.skills?.slice(0,3).map((s, i) => (
              <li key={`s${i}`} className="flex items-center gap-3 text-sm bg-white/5 p-3 rounded-lg"><span className="text-secondary">✦</span> Learn: {s}</li>
            ))}
          </ul>
        </div>
        <div className="glassmorphism p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-accent mb-4">Habits & Projects</h3>
          <ul className="space-y-2">
            {recs.habits?.slice(0,3).map((h, i) => (
              <li key={i} className="flex items-center gap-3 text-sm bg-white/5 p-3 rounded-lg"><span className="text-accent">↻</span> {h}</li>
            ))}
            {recs.projects?.slice(0,3).map((p, i) => (
              <li key={`p${i}`} className="flex items-center gap-3 text-sm bg-white/5 p-3 rounded-lg"><span className="text-emerald-400">⚒</span> Build: {p}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimulationResultPage;

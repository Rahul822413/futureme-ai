import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI, simulationAPI } from '../services/api';

const SimulationFormPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    age: 20, education: 'B.Tech', field: 'Computer Science', currentYear: '2nd Year',
    codingSkill: 5, communicationSkill: 5, aiKnowledge: 5, problemSolving: 5,
    leadership: 5, creativity: 5, financialDiscipline: 5,
    careerGoal: '', higherStudiesGoal: '', startupInterest: false, skillGoal: '',
    codingHours: 1, learningHours: 1, communicationPractice: 'sometimes',
    projectFrequency: 'sometimes', readingHabit: 'sometimes', socialMediaUsage: 3,
    consistencyLevel: 5
  });
  const [decisionText, setDecisionText] = useState('');

  useEffect(() => {
    profileAPI.get(user.id).then(res => {
      if (res.data.profile) setProfile(prev => ({ ...prev, ...res.data.profile }));
    }).catch(console.error);
  }, [user.id]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setProfile({ ...profile, [e.target.name]: value });
  };

  const handleSlider = (name, value) => {
    setProfile({ ...profile, [name]: Number(value) });
  };

  const handleSubmit = async () => {
    if (!decisionText) return alert('Please enter a decision to simulate.');
    setLoading(true);
    try {
      await profileAPI.createOrUpdate(user.id, profile);
      const res = await simulationAPI.generate({ decisionText, profile });
      navigate(`/result/${res.data.simulation.id}`); 
    } catch (err) {
      alert(err.response?.data?.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const getDomainInfo = (field, careerGoal) => {
    const combined = `${field} ${careerGoal}`.toLowerCase();
    
    if (combined.includes('medic') || combined.includes('health') || combined.includes('doctor') || combined.includes('nurs') || combined.includes('surgery')) {
      return {
        type: 'medicine',
        primarySkill: 'Clinical Knowledge',
        secondarySkill: 'Medical Technology',
        practiceHours: 'Study Hours/Day',
        chips: ["What if I prepare for NEET PG/USMLE?", "What if I start clinical rotations?", "What if I publish a research paper?", "What if I shadow a specialist?"]
      };
    } else if (combined.includes('business') || combined.includes('finance') || combined.includes('mba') || combined.includes('market') || combined.includes('manage')) {
      return {
        type: 'business',
        primarySkill: 'Business Strategy',
        secondarySkill: 'Market Analysis',
        practiceHours: 'Strategy Hours/Day',
        chips: ["What if I start a startup?", "What if I get an MBA?", "What if I build a professional network?", "What if I analyze 2 case studies daily?"]
      };
    } else if (combined.includes('art') || combined.includes('design') || combined.includes('ui/ux') || combined.includes('animat')) {
      return {
        type: 'design',
        primarySkill: 'Design Skill',
        secondarySkill: 'Creative Trends',
        practiceHours: 'Creative Hours/Day',
        chips: ["What if I build my portfolio daily?", "What if I learn a new design tool?", "What if I start a freelance design business?", "What if I participate in design challenges?"]
      };
    } else if (combined.includes('law') || combined.includes('legal') || combined.includes('attorney')) {
      return {
        type: 'law',
        primarySkill: 'Legal Reasoning',
        secondarySkill: 'Case Law Knowledge',
        practiceHours: 'Case Study Hours/Day',
        chips: ["What if I prepare for the Bar exam?", "What if I intern at a corporate law firm?", "What if I write legal research papers?", "What if I participate in moot court?"]
      };
    } else if (combined.includes('teach') || combined.includes('educat') || combined.includes('professor')) {
      return {
        type: 'education',
        primarySkill: 'Teaching Skill',
        secondarySkill: 'EdTech Knowledge',
        practiceHours: 'Lesson Prep Hours/Day',
        chips: ["What if I get a Master's degree?", "What if I adopt new teaching methodologies?", "What if I create an online course?", "What if I focus on student psychology?"]
      };
    } else if (combined.includes('computer') || combined.includes('software') || combined.includes('it') || combined.includes('tech') || combined.includes('ai') || combined.includes('engineer')) {
      return {
        type: 'tech',
        primarySkill: 'Coding Skill',
        secondarySkill: 'AI/ML Knowledge',
        practiceHours: 'Coding Hours/Day',
        chips: ["What if I learn AI for the next 1 year?", "What if I spend 2 hours daily coding?", "What if I contribute to open source?", "What if I start freelancing?", "What if I reduce social media usage?"]
      };
    } else {
      return {
        type: 'general',
        primarySkill: 'Core Domain Skill',
        secondarySkill: 'Industry Knowledge',
        practiceHours: 'Skill Practice Hours/Day',
        chips: ["What if I practice my craft 2 hours daily?", "What if I improve my communication skills?", "What if I get a professional certification?", "What if I reduce social media usage?", "What if I start a side hustle?"]
      };
    }
  };

  const domainInfo = getDomainInfo(profile.field, profile.careerGoal);
  const chips = domainInfo.chips;

  return (
    <div className="min-h-screen p-6 md:p-10 flex flex-col items-center">
          <button onClick={() => navigate('/') } aria-label="Back to Home" className="mb-4 self-start px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 transition focus-visible:ring-2 focus-visible:ring-gray-400">← Back to Home</button>
      {/* Progress Bar */}
      <div className="w-full max-w-3xl mb-8 flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-white/10 -z-10 transform -translate-y-1/2 rounded"></div>
        <div className="absolute left-0 top-1/2 h-1 bg-primary -z-10 transform -translate-y-1/2 rounded transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
        
        {[1, 2, 3].map(i => (
          <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors duration-300 ${step >= i ? 'bg-[#050816] border-primary text-primary shadow-[0_0_15px_rgba(0,245,255,0.5)]' : 'bg-[#050816] border-white/20 text-gray-500'}`}>
            {i}
          </div>
        ))}
      </div>

      <div className="glassmorphism w-full max-w-3xl p-8 md:p-12 rounded-3xl relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-gray-400 mb-1 text-sm">Age</label><input type="number" name="age" value={profile.age} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2" /></div>
              <div><label className="block text-gray-400 mb-1 text-sm">Education</label><input type="text" name="education" value={profile.education} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2" /></div>
              <div><label className="block text-gray-400 mb-1 text-sm">Field/Branch</label><input type="text" name="field" value={profile.field} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2" /></div>
              <div><label className="block text-gray-400 mb-1 text-sm">Current Year/Experience</label><input type="text" name="currentYear" value={profile.currentYear} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2" /></div>
            </div>
            
            <h2 className="text-2xl font-bold border-b border-white/10 pb-4 mt-8">Goals</h2>
            <div className="grid grid-cols-1 gap-4">
              <div><label className="block text-gray-400 mb-1 text-sm">Career Goal</label><input type="text" name="careerGoal" value={profile.careerGoal} onChange={handleChange} placeholder="e.g. AI Engineer" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2" /></div>
              <div><label className="block text-gray-400 mb-1 text-sm">Skill Goal</label><input type="text" name="skillGoal" value={profile.skillGoal} onChange={handleChange} placeholder="e.g. Master React and Node.js" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2" /></div>
            </div>
            
            <h2 className="text-2xl font-bold border-b border-white/10 pb-4 mt-8">Integrations (Optional)</h2>
            <div className="grid grid-cols-1 gap-4">
              {domainInfo.type === 'tech' ? (
                <div><label className="block text-gray-400 mb-1 text-sm">GitHub Username (Auto-syncs coding consistency)</label><input type="text" name="githubUsername" value={profile.githubUsername || ''} onChange={handleChange} placeholder="e.g. octocat" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" /></div>
              ) : (
                <p className="text-gray-500 text-sm italic">No automated integrations available for {domainInfo.type} yet.</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button onClick={() => setStep(2)} className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-[#00e0eb]">Next: Skills & Habits ➔</button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Current Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div className="mb-4"><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">{domainInfo.primarySkill}</span><span className="text-primary font-bold">{profile.codingSkill}/10</span></div><input type="range" min={0} max={10} value={profile.codingSkill} onChange={e => handleSlider('codingSkill', e.target.value)} /></div>
              <div className="mb-4"><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Communication</span><span className="text-primary font-bold">{profile.communicationSkill}/10</span></div><input type="range" min={0} max={10} value={profile.communicationSkill} onChange={e => handleSlider('communicationSkill', e.target.value)} /></div>
              <div className="mb-4"><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">{domainInfo.secondarySkill}</span><span className="text-primary font-bold">{profile.aiKnowledge}/10</span></div><input type="range" min={0} max={10} value={profile.aiKnowledge} onChange={e => handleSlider('aiKnowledge', e.target.value)} /></div>
              <div className="mb-4"><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Problem Solving</span><span className="text-primary font-bold">{profile.problemSolving}/10</span></div><input type="range" min={0} max={10} value={profile.problemSolving} onChange={e => handleSlider('problemSolving', e.target.value)} /></div>
              <div className="mb-4"><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Leadership</span><span className="text-primary font-bold">{profile.leadership}/10</span></div><input type="range" min={0} max={10} value={profile.leadership} onChange={e => handleSlider('leadership', e.target.value)} /></div>
              <div className="mb-4"><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Creativity</span><span className="text-primary font-bold">{profile.creativity}/10</span></div><input type="range" min={0} max={10} value={profile.creativity} onChange={e => handleSlider('creativity', e.target.value)} /></div>
            </div>

            <h2 className="text-2xl font-bold border-b border-white/10 pb-4 mt-8">Daily Habits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div className="mb-4"><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">{domainInfo.practiceHours}</span><span className="text-primary font-bold">{profile.codingHours}/12</span></div><input type="range" min={0} max={12} value={profile.codingHours} onChange={e => handleSlider('codingHours', e.target.value)} /></div>
              <div className="mb-4"><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Learning Hours/Day</span><span className="text-primary font-bold">{profile.learningHours}/12</span></div><input type="range" min={0} max={12} value={profile.learningHours} onChange={e => handleSlider('learningHours', e.target.value)} /></div>
              <div className="mb-4"><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Social Media Hours/Day</span><span className="text-primary font-bold">{profile.socialMediaUsage}/12</span></div><input type="range" min={0} max={12} value={profile.socialMediaUsage} onChange={e => handleSlider('socialMediaUsage', e.target.value)} /></div>
              <div className="mb-4"><div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Consistency Level</span><span className="text-primary font-bold">{profile.consistencyLevel}/10</span></div><input type="range" min={0} max={10} value={profile.consistencyLevel} onChange={e => handleSlider('consistencyLevel', e.target.value)} /></div>
            </div>
            
            <div className="flex justify-between pt-4 border-t border-white/10 mt-6">
              <button onClick={() => setStep(1)} className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">⬅ Back</button>
              <button onClick={() => setStep(3)} className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-[#00e0eb]">Next: Decision ➔</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gradient mb-4">The Decision</h2>
              <p className="text-gray-400">What specific choice or habit do you want to simulate?</p>
            </div>

            <div className="relative">
              <textarea 
                value={decisionText} 
                onChange={e => setDecisionText(e.target.value)}
                placeholder="e.g., What if I learn AI for 2 hours daily for the next 1 year?"
                className="w-full bg-black/60 border-2 border-primary/50 focus:border-primary rounded-2xl p-6 text-xl text-white outline-none resize-none min-h-[150px] shadow-[0_0_30px_rgba(0,245,255,0.1)]"
              ></textarea>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((chip, i) => (
                  <button 
                    key={i} 
                    onClick={() => setDecisionText(chip)}
                    className="text-xs px-3 py-1.5 bg-secondary/20 text-secondary border border-secondary/30 rounded-full hover:bg-secondary/40 transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-8">
              <button onClick={() => setStep(2)} className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">⬅ Back</button>
              <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-gradient-to-r from-primary to-blue-500 text-black text-lg font-bold rounded-xl hover:scale-105 transition shadow-[0_0_20px_rgba(0,245,255,0.4)] disabled:opacity-50 disabled:hover:scale-100">
                {loading ? 'Simulating Future...' : '✨ Generate My Future'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SimulationFormPage;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e, isDemo = false) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isDemo) {
        await login('student@futureme.ai', 'student123');
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(167,139,250,0.15)_0,transparent_50%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glassmorphism w-full max-w-md p-8 md:p-10 rounded-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Access your future simulations</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input 
              type={showPass ? "text" : "password"} 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
              placeholder="••••••••"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-9 text-gray-500 hover:text-white"
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-background font-bold rounded-xl py-3 mt-2 hover:bg-[#00e0eb] transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10">
          <button 
            type="button"
            onClick={(e) => handleLogin(e, true)}
            className="w-full bg-secondary/20 text-secondary border border-secondary/30 font-medium rounded-xl py-3 hover:bg-secondary/30 transition mb-4"
          >
            Demo Login (Student)
          </button>
          
          <p className="text-center text-gray-400 text-sm">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Register here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

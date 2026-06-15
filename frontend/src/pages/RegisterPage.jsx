import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,245,255,0.15)_0,transparent_50%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glassmorphism w-full max-w-md p-8 md:p-10 rounded-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Join FutureMe AI today</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input 
              name="name" type="text" value={formData.name} onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              name="email" type="email" value={formData.email} onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
            <select 
              name="role" value={formData.role} onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition appearance-none"
            >
              <option value="student">Student</option>
              <option value="professional">Professional</option>
              <option value="career_counselor">Career Counselor</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input 
                name="password" type="password" value={formData.password} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Confirm</label>
              <input 
                name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-background font-bold rounded-xl py-3 mt-4 hover:bg-[#00e0eb] transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Basic layouts for now
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center text-primary">Loading FutureMe AI...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && !user.is_admin) return <Navigate to="/dashboard" />;
  return children;
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [deploying, setDeploying] = React.useState(false);

  const handleDeploy = async () => {
    if (!window.confirm('Are you sure you want to trigger a production build?')) return;
    setDeploying(true);
    try {
      // In production, you would point this to your API URL. Here we assume the frontend server proxies to backend, or we hit it directly.
      // Since API might be on port 5000:
      const res = await fetch(import.meta.env.PROD ? '/api/deploy' : 'http://localhost:5000/api/deploy', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Deployment successful!\n' + data.message);
      } else {
        alert('Deployment failed: ' + data.message);
      }
    } catch (err) {
      alert('Error triggering deployment: ' + err.message);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col relative z-10">
      <nav className="glassmorphism sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="text-xl font-bold text-gradient cursor-pointer flex items-center gap-2" onClick={() => navigate('/')}>
          ✨ FutureMe AI
        </div>
        {user ? (
          <div className="flex gap-4 items-center">
            <Link to="/dashboard" className="hover:text-primary transition font-medium">Dashboard</Link>
            <Link to="/simulate" className="hover:text-primary transition font-medium">Simulate</Link>
            <Link to="/history" className="hover:text-primary transition font-medium">History</Link>
            {user.is_admin && <Link to="/admin" className="text-accent hover:text-primary transition font-medium">Admin</Link>}
            
            <div className="h-6 w-px bg-white/20 mx-2"></div>
            
            <button 
              onClick={handleDeploy} 
              disabled={deploying}
              className="px-4 py-2 bg-secondary/20 text-secondary border border-secondary/50 rounded-lg hover:bg-secondary/30 transition disabled:opacity-50"
            >
              {deploying ? 'Deploying...' : '🚀 Deploy'}
            </button>
            <button onClick={logout} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition">Logout</button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 hover:text-primary transition">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 rounded-lg transition">Get Started</Link>
          </div>
        )}
      </nav>
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
};

// Page placeholders (to be expanded)
import LandingPage from './pages/LandingPage';
import LiveBackground from './components/LiveBackground';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SimulationFormPage from './pages/SimulationFormPage';
import SimulationResultPage from './pages/SimulationResultPage';
import HistoryPage from './pages/HistoryPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <LiveBackground />
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/simulate" element={<ProtectedRoute><SimulationFormPage /></ProtectedRoute>} />
          <Route path="/result/:id" element={<ProtectedRoute><SimulationResultPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
          
          <Route path="*" element={<div className="p-20 text-center text-2xl">404 - Future timeline not found.</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

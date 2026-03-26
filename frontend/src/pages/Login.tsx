import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Sparkles, Loader2, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Correcting the route to /api/v1/users/login
      const { data } = await API.post('/users/login', {
        email,
        password,
      });

      login(data);
      navigate('/');
    } catch (err: any) {
      console.error('Login Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex flex-col items-center justify-center p-6 relative bg-surface-50 overflow-hidden">
      {/* Soft Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 rounded-full border border-brand-100 mb-4 text-brand-600 font-black">
            <Sparkles size={14} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Secure Gateway Active</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-surface-900 mb-2 uppercase">
            Nexus <span className="text-brand-500 italic">Login</span>
          </h1>
          <p className="text-surface-500 text-sm font-medium">Synchronize your session node.</p>
        </div>

        <div className="card-premium p-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 mb-6 overflow-hidden"
              >
                <AlertCircle size={18} className="text-red-500 mt-0.5" />
                <p className="text-xs font-semibold text-red-600 leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Identifier Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400 group-focus-within:text-brand-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@nexus.io"
                  className="input-standard pl-12 h-14 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center pl-1">
                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Protocol Secret</label>
                <Link to="/" className="text-[10px] font-bold text-brand-600 hover:text-brand-700 uppercase tracking-widest">Lost Key?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400 group-focus-within:text-brand-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-standard pl-12 h-14 text-sm font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 flex items-center justify-center gap-2 group mt-4 font-black uppercase tracking-[0.2em] text-[11px] shadow-brand active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Start Session</span>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-100 text-center">
            <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest">
              Access Required?{' '}
              <Link to="/register" className="text-brand-600 hover:text-brand-700 transition-colors underline decoration-2 underline-offset-8 decoration-brand-200">
                Register Node
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-surface-300 uppercase tracking-widest flex items-center justify-center gap-5">
          <span className="hover:text-surface-600 cursor-pointer">Security</span>
          <div className="w-1 h-1 bg-surface-200 rounded-full" />
          <span className="hover:text-surface-600 cursor-pointer">Compliance</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

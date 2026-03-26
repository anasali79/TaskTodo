import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Shield, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
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
      // Correcting the route to /api/v1/users
      const { data } = await API.post('/users', {
        name,
        email,
        password,
        role,
      });

      login(data);
      navigate('/');
    } catch (err: any) {
      console.error('Registration Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to create account. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-surface-50">
      {/* Decorative Orbs */}
      <div className="absolute top-[0%] left-[-10%] w-[50%] h-[50%] bg-brand-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/30 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg z-10"
      >
        <div className="text-center mb-10">

          <h1 className="text-4xl font-black tracking-tight text-surface-900 mb-2 uppercase">
            Deploy <span className="text-brand-500 italic">User</span>
          </h1>
          <p className="text-surface-500 text-sm font-medium">Initialize your permanent workspace node.</p>
        </div>

        <div className="card-premium p-10">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 mb-8 shadow-sm overflow-hidden"
              >
                <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs font-semibold text-red-600">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Identifier Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400 group-focus-within:text-brand-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="input-standard pl-12 h-14 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">System Email</label>
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
              <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Security Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400 group-focus-within:text-brand-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-standard pl-12 h-14 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Access Tier</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400 group-focus-within:text-brand-500 transition-colors">
                  <Shield size={18} />
                </div>
                <select
                  className="input-standard h-14 pl-12 appearance-none cursor-pointer text-sm font-bold bg-white"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">Product User</option>
                  <option value="admin">System Architect</option>
                </select>
              </div>
            </div>

            <div className="col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-5 flex items-center justify-center gap-2 group transition-all font-black uppercase tracking-[0.2em] text-[11px] shadow-brand"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>Execute Deployment</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-100 text-center">
            <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest">
              Existing Node?{' '}
              <Link to="/login" className="text-brand-600 hover:text-brand-700 transition-colors underline decoration-2 underline-offset-8 decoration-brand-200">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-surface-300 max-w-sm mx-auto leading-relaxed uppercase tracking-widest">
          By deploying, you agree to the <span className="underline hover:text-surface-600 cursor-pointer">Nexus Protocols</span>.
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

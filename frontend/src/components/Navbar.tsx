import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <motion.nav 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="nav-glass h-16 flex items-center px-8 justify-between fixed top-0 left-0 right-0 z-[100]"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 group transition-transform active:scale-95" id="nav-logo">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-brand-500 shadow-brand group-hover:bg-brand-600">
          <Layers className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-bold tracking-tight text-surface-900 group-hover:text-brand-600 transition-colors">
          Task<span className="text-brand-500">Flow</span>
        </span>
      </Link>
      
      {/* Centered Navigation */}
      <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-surface-500">
        <Link to="/" className={`hover:text-brand-600 transition-colors ${location.pathname==='/' ? 'text-brand-600 font-bold' : ''}`} id="nav-overview">
          Overview
        </Link>
      </div>

      {/* Right-side Utils */}
      <div className="flex items-center gap-4">
        {userInfo ? (
          <>
            <div className="flex items-center gap-3 pl-4 border-l border-surface-200" id="nav-user-info">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-surface-900 truncate max-w-[120px]">{userInfo?.name || 'User Name'}</span>
                <span className="text-[10px] text-surface-400 capitalize font-bold leading-tight uppercase tracking-widest">{userInfo?.role || 'User'}</span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-surface-100 border border-surface-200 flex items-center justify-center text-xs font-black text-brand-600 shadow-sm cursor-pointer transition-all hover:border-brand-300">
                {userInfo?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <button 
                onClick={handleLogout} 
                className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                id="nav-logout-btn"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            {!isAuthPage && (
              <>
                <Link to="/login" className="text-sm font-semibold text-surface-600 hover:text-surface-900 transition-colors" id="nav-login-btn">Sign In</Link>
                <Link to="/register" className="btn-primary text-xs py-2.5 px-5 shadow-brand uppercase tracking-widest font-black" id="nav-register-btn">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;

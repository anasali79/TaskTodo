import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Trash2, Edit3, Loader2, LayoutGrid,
  X, AlertCircle, Calendar, ShieldCheck, Users
} from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  user?: { name: string; email: string };
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
  }>({ title: '', description: '', status: 'todo' });
  const [searchQuery, setSearchQuery] = useState('');

  const { userInfo } = useContext(AuthContext);
  const isAdmin = userInfo?.role === 'admin';

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('tasks');
      setTasks(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: any) {
      console.error('Fetch error:', err.response?.data || err.message);
      setError('System Sync Failure. Check Administrative Access.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [userInfo]);

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({ title: task.title, description: task.description, status: task.status });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'todo' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {

      if (editingTask) {
        await API.put(`tasks/${editingTask._id}`, formData);
      } else {
        await API.post('tasks', formData);
      }
      fetchTasks();
      setIsModalOpen(false);
    } catch (err: any) {
      setError('Protocol Update Failed. Access denied.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Erase this system node permanently?')) return;
    try {
      await API.delete(`tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Erase Protocol failed.');
    }
  };

  const filteredTasks = tasks.filter(t =>
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isAdmin ? 'bg-surface-100' : 'bg-surface-50'} flex flex-col md:flex-row relative transition-colors duration-500`}>
      {/* Sidebar - Fixed Padding to clear Nav */}
      <aside className={`w-full md:w-72 border-r ${isAdmin ? 'bg-surface-950 border-surface-800 text-white' : 'bg-white border-surface-200'} shrink-0 relative z-30 pt-28 md:pt-32 transition-all`}>
        <div className="p-7 h-full flex flex-col">
          <div className="mb-10">
            <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isAdmin ? 'text-surface-500' : 'text-surface-400'} mb-6 px-2`}>
              {isAdmin ? 'System Command' : 'Workspace'}
            </h3>
            <nav className="space-y-2 flex-1">
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${isAdmin ? 'bg-brand-500 text-white shadow-brand shadow-lg' : 'bg-brand-50 text-brand-600'}`}>
                {isAdmin ? <ShieldCheck size={18} /> : <LayoutGrid size={18} />}
                {isAdmin ? 'Nexus Core' : 'Dashboard'}
              </button>
            </nav>
          </div>

          <div className={`mt-auto p-5 ${isAdmin ? 'bg-surface-900 border-surface-800' : 'bg-surface-50 border-surface-200'} rounded-[2rem] border flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-2xl ${isAdmin ? 'bg-brand-500' : 'bg-brand-600'} flex items-center justify-center text-white text-xs font-black shadow-lg transform rotate-[-5deg]`}>
              {userInfo?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className={`text-[11px] font-black ${isAdmin ? 'text-white' : 'text-surface-900'} truncate uppercase tracking-tight`}>{userInfo?.name}</span>
              <span className={`text-[9px] ${isAdmin ? 'text-brand-400' : 'text-brand-600'} font-black uppercase tracking-[0.2em]`}>{isAdmin ? 'System Admin' : 'Node User'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Workspace - Fixed Padding to clear Nav */}
      <main className="flex-1 overflow-y-auto pt-28 md:pt-32 p-6 md:p-12 z-10 transition-all">
        <div className="max-w-7xl mx-auto">
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 border border-red-100 p-5 rounded-3xl flex items-center gap-4 mb-12 shadow-sm">
              <AlertCircle size={20} className="text-red-500" />
              <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.15em]">{error}</p>
            </motion.div>
          )}

          {/* Admin Header Context */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-surface-900 tracking-tighter leading-none uppercase">
                {isAdmin ? 'Global ' : 'Private '} <span className="text-brand-600 italic">Nexus</span>.
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isAdmin ? 'text-surface-500 group-focus-within:text-brand-400' : 'text-surface-400 group-focus-within:text-brand-500'}`} size={18} />
                <input
                  type="text"
                  placeholder={isAdmin ? "Target node hash..." : "Search nodes..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-12 pr-6 h-14 min-w-[280px] rounded-3xl shadow-sm text-xs font-bold focus:outline-none transition-all border ${isAdmin ? 'bg-white border-surface-200 focus:border-brand-500' : 'bg-white border-surface-200 focus:border-brand-500'}`}
                />
              </div>
              <button
                onClick={() => handleOpenModal()}
                className={`h-14 px-8 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl rounded-3xl transition-transform active:scale-90 ${isAdmin ? 'bg-surface-950 text-brand-400 border border-surface-800 hover:bg-black' : 'bg-brand-500 text-white hover:bg-brand-600'}`}
              >
                <Plus size={20} /> Deploy
              </button>
            </div>
          </div>

          {/* Management Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border border-surface-200 rounded-[3rem] shadow-sm">
              <Loader2 className="animate-spin text-brand-500 mb-5" size={40} />
              <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Compiling System Nodes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`card-premium h-full flex flex-col group p-8 relative overflow-hidden`}
                  >
                    {isAdmin && task.user && (
                      <div className="absolute top-0 right-0 px-4 py-1.5 bg-surface-950 text-brand-400 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                        <Users size={12} className="inline mr-1" /> {task.user.name}
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-8 transition-all">
                      <div className="flex flex-col">
                        {task.status === 'done' ? <div className="badge badge-done group-hover:bg-emerald-500 group-hover:text-white">Finished</div> :
                          task.status === 'in-progress' ? <div className="badge badge-progress group-hover:bg-brand-500 group-hover:text-white">Active</div> :
                            <div className="badge badge-todo group-hover:bg-surface-900 group-hover:text-white">Queue</div>}
                      </div>

                      <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button onClick={() => handleOpenModal(task)} className="p-3 text-surface-400 hover:text-brand-500 hover:bg-brand-50 rounded-2xl transition-all"><Edit3 size={16} /></button>
                        <button onClick={() => handleDelete(task._id)} className="p-3 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-surface-900 leading-tight mb-4 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{task.title}</h3>
                    <p className="text-xs text-surface-500 line-clamp-3 leading-loose font-medium mb-10 pr-6">{task.description}</p>

                    <div className="mt-auto pt-6 border-t border-surface-100 flex items-center justify-between text-[10px] font-black text-surface-300 uppercase tracking-widest">
                      <span className="flex items-center gap-2.5"><Calendar size={14} /> {new Date().toLocaleDateString()}</span>
                      <span className="opacity-40 group-hover:text-brand-500 transition-colors">Node:{task._id.slice(-4)}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                onClick={() => handleOpenModal()}
                className={`card-premium border-dashed border-2 p-14 transition-all min-h-[280px] group flex flex-col items-center justify-center ${isAdmin ? 'hover:border-surface-950 hover:bg-surface-50' : 'hover:border-brand-500 hover:bg-brand-50/20'}`}
              >
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 transition-all transform group-hover:rotate-12 group-hover:scale-110 shadow-lg ${isAdmin ? 'bg-surface-950 text-brand-400' : 'bg-surface-100 text-surface-400 group-hover:bg-brand-500 group-hover:text-white'}`}>
                  <Plus size={28} />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-[0.3em] transition-colors ${isAdmin ? 'text-surface-950' : 'text-surface-400 group-hover:text-brand-600'}`}>
                  {isAdmin ? 'Add Global Node' : 'Init Node'}
                </span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modal is already z-200, safe from overlap */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-surface-950/70 backdrop-blur-xl" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 40 }}
              className={`w-full max-w-lg rounded-[3.5rem] shadow-2xl border p-12 z-[201] overflow-hidden relative ${isAdmin ? 'bg-surface-950 border-surface-800 text-white' : 'bg-white border-surface-100'}`}
            >
              <div className={`absolute top-0 left-0 right-0 h-2.5 shadow-brand ${isAdmin ? 'bg-brand-400' : 'bg-brand-600'}`} />
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">{editingTask ? 'Override State' : 'New Protocol'}</h2>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mt-3 ${isAdmin ? 'text-brand-400' : 'text-surface-400'}`}>
                    Nexus Authorization: Level {isAdmin ? '09 (Admin)' : '01 (User)'}
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className={`p-3 rounded-2xl transition-colors ${isAdmin ? 'hover:bg-surface-800 text-surface-500' : 'hover:bg-surface-50 text-surface-400'}`}><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className={`text-[10px] font-black uppercase tracking-widest pl-2 ${isAdmin ? 'text-surface-500' : 'text-surface-400'}`}>Deployment Label</label>
                  <input type="text" required placeholder="Identifier name..." className={`input-standard h-14 text-sm px-6 font-bold ${isAdmin ? 'bg-surface-900 border-surface-800 text-white focus:border-brand-400' : 'bg-surface-50 border-surface-200'}`} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>

                <div className="space-y-3">
                  <label className={`text-[10px] font-black uppercase tracking-widest pl-2 ${isAdmin ? 'text-surface-500' : 'text-surface-400'}`}>Protocol Specifications</label>
                  <textarea rows={3} placeholder="Requirements..." className={`input-standard resize-none py-5 text-sm px-6 font-medium ${isAdmin ? 'bg-surface-900 border-surface-800 text-white focus:border-brand-400' : 'bg-surface-50 border-surface-200'}`} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <div className="space-y-3">
                  <label className={`text-[10px] font-black uppercase tracking-widest pl-2 ${isAdmin ? 'text-surface-500' : 'text-surface-400'}`}>Operational Status</label>
                  <div className="grid grid-cols-3 gap-4">
                    {(['todo', 'in-progress', 'done'] as const).map((s) => (
                      <button
                        key={s} type="button"
                        onClick={() => setFormData({ ...formData, status: s })}
                        className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.status === s ? (isAdmin ? 'bg-brand-400 text-surface-950 border-brand-400 shadow-lg' : 'bg-brand-600 text-white border-brand-600 shadow-brand translate-y-[-2px]') : (isAdmin ? 'bg-surface-900 text-surface-500 border-surface-800 hover:border-brand-500/50' : 'bg-surface-50 text-surface-400 border-surface-100 hover:border-brand-200')}`}
                      >
                        {s.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 flex gap-5">
                  <button type="button" onClick={() => setIsModalOpen(false)} className={`flex-1 py-5 font-black uppercase tracking-widest text-[11px] rounded-[2rem] border ${isAdmin ? 'bg-surface-900 border-surface-800 text-surface-400 hover:bg-surface-800' : 'bg-white border-surface-200 text-surface-400 hover:bg-surface-50'}`}>Abort Node</button>
                  <button type="submit" className={`flex-1 py-5 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[11px] shadow-2xl rounded-[2rem] transition-transform active:scale-95 ${isAdmin ? 'bg-brand-400 text-surface-950 hover:bg-brand-300' : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand'}`}>
                    {editingTask ? 'Commit Protocol' : 'Deploy Deployment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

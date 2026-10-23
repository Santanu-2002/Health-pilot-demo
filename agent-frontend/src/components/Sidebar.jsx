import { Activity, CalendarDays, LayoutDashboard, MessageCircle, Stethoscope, LogIn, LogOut, UserRound, X } from 'lucide-react';
import Brand from './Brand.jsx';
import { navigate } from '../utils/navigation.js';
import { useApp } from '../context/useApp.js';
import { api } from '../services/api.js';

const items = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Find a doctor', path: '/doctors', icon: Stethoscope },
  { label: 'Appointments', path: '/appointments', icon: CalendarDays, protected: true },
  { label: 'HealthPilot AI', path: '/assistant', icon: MessageCircle },
];
export default function Sidebar({ path, open, onClose }) {
  const { user, setUser, setAppointments, notify } = useApp();
  const activePath = path.split('?')[0];
  async function signOut() { try { await api('/auth/logout', { method: 'POST' }); } catch { /* Local session state is cleared even if logout request fails. */ } setUser(null); setAppointments([]); notify('You have signed out.'); navigate('/'); onClose?.(); }
  function go(item) { if (item.protected && !user) { navigate('/login?next=%2Fappointments'); } else navigate(item.path); onClose?.(); }
  return <><div className={`sidebar-backdrop ${open ? 'visible' : ''}`} onClick={onClose} /><aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
    <div className="sidebar-top"><Brand /><button className="icon-button sidebar-close" aria-label="Close menu" onClick={onClose}><X size={19}/></button></div>
    <div className="workspace-label">WORKSPACE</div>
    <nav className="nav-list" aria-label="Main navigation">{items.map((item) => { const Icon = item.icon; const active = activePath === item.path || (item.path !== '/' && activePath.startsWith(item.path)); return <button key={item.path} className={`nav-item ${active ? 'nav-item-active' : ''}`} onClick={() => go(item)}><Icon size={19}/><span>{item.label}</span>{item.protected && !user && <span className="nav-lock">Sign in</span>}</button>; })}</nav>
    <div className="sidebar-spacer" />
    <div className="sidebar-ai-card"><div className="ai-card-icon"><Activity size={18}/></div><strong>Your care, made simpler</strong><p>Get help finding the right next step.</p><button onClick={() => { navigate('/assistant'); onClose?.(); }}>Talk to HealthPilot AI <span>↗</span></button></div>
    <div className="sidebar-profile">{user ? <><div className="avatar avatar-user">{user.name?.slice(0,1).toUpperCase()}</div><div className="profile-copy"><strong>{user.name}</strong><span>{user.email}</span></div><button className="icon-button profile-action" title="Sign out" onClick={signOut}><LogOut size={17}/></button></> : <><div className="avatar avatar-guest"><UserRound size={18}/></div><div className="profile-copy"><strong>Guest access</strong><span>AI assistant available</span></div><button className="profile-login" onClick={() => { navigate('/login'); onClose?.(); }}><LogIn size={16}/> Sign in</button></>}</div>
  </aside></>;
}

import { Bell, Menu, Search } from 'lucide-react';
import { navigate } from '../utils/navigation.js';
import { useApp } from '../context/useApp.js';
export default function Topbar({ onMenu }) {
  const { user } = useApp();
  return <header className="topbar"><button className="icon-button mobile-menu" aria-label="Open menu" onClick={onMenu}><Menu size={21}/></button><div className="topbar-search"><Search size={17}/><input aria-label="Search doctors" placeholder="Search doctors, specialties..." onKeyDown={(e) => { if (e.key === 'Enter' && e.currentTarget.value.trim()) navigate(`/doctors?q=${encodeURIComponent(e.currentTarget.value.trim())}`); }}/><kbd>↵</kbd></div><div className="topbar-actions"><span className="secure-note"><span/> Secure health space</span><button className="icon-button notification-button" aria-label="Assistant" onClick={() => navigate('/assistant')}><Bell size={19}/><i/></button>{user ? <button className="topbar-user" onClick={() => navigate('/appointments')}><span className="avatar avatar-user">{user.name?.slice(0,1).toUpperCase()}</span><span>{user.name.split(' ')[0]}</span></button> : <button className="button button-primary topbar-signin" onClick={() => navigate('/login')}>Sign in</button>}</div></header>;
}

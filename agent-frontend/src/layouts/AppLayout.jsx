import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
export default function AppLayout({ path, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="app-shell"><Sidebar path={path} open={menuOpen} onClose={() => setMenuOpen(false)}/><div className="app-main"><Topbar onMenu={() => setMenuOpen(true)}/><main className="page-content">{children}</main><footer className="app-footer"><span>© 2026 HealthPilot AI</span><span><i/> Your health information stays yours.</span></footer></div></div>;
}

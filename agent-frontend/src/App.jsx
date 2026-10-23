import { Suspense, lazy, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import AppLayout from './layouts/AppLayout.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { navigate, usePathname } from './utils/navigation.js';

const Overview = lazy(() => import('./pages/Overview.jsx'));
const Doctors = lazy(() => import('./pages/Doctors.jsx'));
const Appointments = lazy(() => import('./pages/Appointments.jsx'));
const Assistant = lazy(() => import('./pages/Assistant.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const BookAppointment = lazy(() => import('./pages/BookAppointment.jsx'));

function RouteContent({ path }) {
  const route = path.split('?')[0];
  useEffect(() => { document.title = `${route === '/login' ? 'Sign in' : route === '/signup' ? 'Create account' : route === '/assistant' ? 'HealthPilot AI' : route === '/doctors' ? 'Find a doctor' : route === '/appointments' ? 'Appointments' : route === '/book' ? 'Book appointment' : 'Overview'} | HealthPilot AI`; }, [route]);
  if (route === '/login' || route === '/signup') return <Suspense fallback={<PageLoader/>}><AuthPage mode={route === '/signup' ? 'signup' : 'login'}/></Suspense>;
  let page;
  if (route === '/doctors') page = <Doctors/>;
  else if (route === '/appointments') page = <Appointments/>;
  else if (route === '/assistant') page = <Assistant/>;
  else if (route === '/book') page = <BookAppointment/>;
  else page = <Overview/>;
  return <AppLayout path={path}><Suspense fallback={<PageLoader/>}>{page}</Suspense></AppLayout>;
}
function PageLoader() { return <div className="page-loader"><LoaderCircle className="spin" size={24}/><span>Preparing your health space...</span></div>; }
function AppRoot() {
  const path = usePathname();
  useEffect(() => { const onKey = (event) => { if (event.key === 'Escape' && window.location.pathname !== '/') navigate('/'); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, []);
  return <RouteContent path={path}/>;
}
export default function App() { return <AppProvider><AppRoot/></AppProvider>; }

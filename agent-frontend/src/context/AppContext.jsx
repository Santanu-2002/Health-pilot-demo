import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { AppContext } from './appContextInstance.js';
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const refreshAppointments = useCallback(async () => {
    setAppointmentsLoading(true);
    try { const data = await api('/appointments'); setAppointments(data.appointments || []); }
    catch (error) { if (error.status === 401) setUser(null); setAppointments([]); }
    finally { setAppointmentsLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    api('/auth/me').then(async (data) => {
      if (!active) return;
      setUser(data.user);
      try { const result = await api('/appointments'); if (active) setAppointments(result.appointments || []); } catch { if (active) setAppointments([]); }
    }).catch(() => { if (active) setUser(null); }).finally(() => { if (active) setAuthLoading(false); });
    return () => { active = false; };
  }, []);
  const notify = useCallback((message, type = 'success') => { setToast({ message, type, id: Date.now() }); window.setTimeout(() => setToast(null), 3600); }, []);
  const value = useMemo(() => ({ user, setUser, authLoading, appointments, setAppointments, appointmentsLoading, refreshAppointments, notify }), [user, authLoading, appointments, appointmentsLoading, refreshAppointments, notify]);
  return <AppContext.Provider value={value}>{children}{toast && <div className={`toast toast-${toast.type}`} role="status">{toast.message}</div>}</AppContext.Provider>;
}


export function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
export function usePathname() {
  const [path, setPath] = React.useState(`${window.location.pathname}${window.location.search}`);
  React.useEffect(() => { const update = () => setPath(`${window.location.pathname}${window.location.search}`); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update); }, []);
  return path;
}
import React from 'react';

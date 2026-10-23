import { Activity } from 'lucide-react';
export default function Brand({ compact = false }) {
  return <div className={`brand ${compact ? 'brand-compact' : ''}`}><span className="brand-mark"><Activity size={21} strokeWidth={2.7} /></span><span className="brand-word">HealthPilot <b>AI</b></span></div>;
}

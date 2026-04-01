import { ReactNode } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

export function SectionCard({ title, icon, children, action, className = '' }: { title: string; icon: ReactNode; children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={`glass-card p-3 sm:p-5 rounded-xl border border-gold/10 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gold">{icon}</span>
          <h3 className="text-sm sm:text-base font-bold text-foreground">{title}</h3>
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}

export function MiniStat({ label, value, sub, color = 'text-gold', trend }: { label: string; value: string | number; sub?: string; color?: string; trend?: { value: string; up: boolean } }) {
  return (
    <div className="glass-card p-3 rounded-lg border border-gold/5 text-center hover:scale-[1.02] transition-transform">
      <div className="flex items-center justify-center gap-2">
        <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
        {trend && <span className={`text-[10px] font-semibold ${trend.up ? 'text-success' : 'text-destructive'}`}>{trend.up ? '▲' : '▼'}{trend.value}</span>}
      </div>
      <p className="text-xs text-chrome mt-1">{label}</p>
      {sub && <p className="text-[10px] text-chrome/60 mt-0.5">{sub}</p>}
    </div>
  );
}

export function ProgressBar({ value, max, color = 'bg-gold', label }: { value: number; max: number; color?: string; label?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      {label && <div className="flex justify-between text-xs text-chrome mb-1"><span>{label}</span><span>{pct}%</span></div>}
      <div className="w-full bg-card/50 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) {
  const colors = { default: 'bg-chrome/10 text-chrome border-chrome/20', success: 'bg-success/10 text-success border-success/20', warning: 'bg-warning/10 text-warning border-warning/20', danger: 'bg-destructive/10 text-destructive border-destructive/20', info: 'bg-info/10 text-info border-info/20' };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[variant]}`}>{children}</span>;
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-chrome/30 mb-3">{icon}</span>
      <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-xs text-chrome">{description}</p>
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = 'بحث...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative flex-1 min-w-0">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome" />
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full pr-10 pl-8 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-chrome focus:outline-none focus:ring-2 focus:ring-primary/30" />
      {value && <button onClick={() => onChange('')} className="absolute left-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5 text-chrome hover:text-foreground" /></button>}
    </div>
  );
}

export function FilterSelect({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder: string }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="appearance-none bg-surface border border-border rounded-lg px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[120px]">
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome pointer-events-none" />
    </div>
  );
}

export function HrModal({ open, onClose, title, children, size = 'md' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  if (!open) return null;
  const sizeMap = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-surface border border-border rounded-2xl shadow-2xl w-full ${sizeMap[size]} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-3 sm:p-5 border-b border-border">
          <h3 className="text-sm sm:text-lg font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X className="w-5 h-5 text-chrome" /></button>
        </div>
        <div className="overflow-y-auto p-3 sm:p-5 flex-1">{children}</div>
      </div>
    </div>
  );
}

export function TabBtn({ active, onClick, children, count }: { active: boolean; onClick: () => void; children: ReactNode; count?: number }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${active ? 'bg-gold/10 text-gold border border-gold/30' : 'text-chrome hover:text-foreground hover:bg-muted'}`}>
      {children}
      {count !== undefined && <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-gold/20 text-gold' : 'bg-muted text-chrome'}`}>{count}</span>}
    </button>
  );
}

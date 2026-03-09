import { HOSPITAL_NAME } from '../config/constants';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
      <div>
        <p className="text-xs font-medium text-teal-600 uppercase tracking-wider mb-1">{HOSPITAL_NAME}</p>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm mt-1.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

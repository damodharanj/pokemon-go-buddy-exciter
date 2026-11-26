import React, { useState } from 'react';
import { History, ChevronDown, ChevronUp } from 'lucide-react';
import { ActivityLogEntry } from '../types/buddy';

interface ActivityHistoryProps {
  history: ActivityLogEntry[];
}

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({ history }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!history || history.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white font-semibold transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400" />
          <span>Activity Log ({history.length})</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 max-h-48 overflow-y-auto pr-1">
          {history.slice(0, 15).map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-950/40 border border-slate-800/60"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-slate-200 truncate">{entry.title}</span>
              </div>
              {entry.epChange > 0 && (
                <span className="text-[10px] font-bold text-amber-400 font-mono flex-shrink-0">
                  +{entry.epChange} EP
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

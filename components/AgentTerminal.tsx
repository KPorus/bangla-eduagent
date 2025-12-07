import React, { useEffect, useRef } from 'react';
import { Log } from '../types';
import { Terminal, Activity } from 'lucide-react';

interface AgentTerminalProps {
  logs: Log[];
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto my-6 bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700 animate-fade-in font-mono text-sm">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2 text-gray-300">
          <Terminal size={14} />
          <span className="text-xs font-semibold tracking-wider">AGENT TERMINAL</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      <div className="p-4 h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3">
            <span className="text-gray-500 shrink-0">
              [{log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
            </span>
            <div className="flex gap-2">
              <span className={`font-bold shrink-0 ${
                log.source === 'Agent' ? 'text-primary' : 
                log.source === 'System' ? 'text-blue-400' : 'text-gray-300'
              }`}>
                {log.source}:
              </span>
              <span className="text-gray-300">{log.message}</span>
            </div>
          </div>
        ))}
        {/* Animated cursor line */}
        <div className="flex gap-3 animate-pulse">
           <span className="text-gray-500 invisible">
              [00:00:00]
           </span>
           <div className="flex gap-2 items-center">
              <span className="text-primary font-bold">&gt;</span>
              <span className="w-2 h-4 bg-primary inline-block"></span>
           </div>
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
};

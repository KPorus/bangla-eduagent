import React, { useEffect, useRef } from 'react';
import { AgentLog } from '../types';
import { Terminal, Activity, CheckCircle2 } from 'lucide-react';

interface AgentTerminalProps {
  logs: AgentLog[];
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <div className="w-full bg-dark rounded-lg overflow-hidden border border-gray-700 shadow-xl mb-6 font-mono text-sm">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2 text-gray-300">
          <Terminal size={16} />
          <span className="font-semibold">Agent Orchestrator</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="p-4 max-h-48 overflow-y-auto space-y-2 text-gray-300"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 animate-fade-in">
            <span className="text-gray-500 shrink-0">
              [{log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
            </span>
            <div className="flex-1">
              <span className={`font-bold mr-2 ${
                log.agentName === 'Scraper' ? 'text-purple-400' :
                log.agentName === 'Translator' ? 'text-blue-400' :
                'text-green-400'
              }`}>
                {log.agentName}:
              </span>
              <span>{log.message}</span>
            </div>
            {log === logs[logs.length - 1] && (
               <Activity size={14} className="animate-pulse text-green-400 mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

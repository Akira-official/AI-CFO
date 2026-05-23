'use client';

import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, PlayCircle, PauseCircle } from 'lucide-react';

const pipelineItems = [
  { id: 1, title: 'AI Regulation Analysis', stage: 'research', progress: 75, time: '2h remaining' },
  { id: 2, title: 'Climate Summit Brief', stage: 'review', progress: 90, time: '30m remaining' },
  { id: 3, title: 'Market Volatility Report', stage: 'draft', progress: 45, time: '4h remaining' },
  { id: 4, title: 'Tech Breakdown: Quantum', stage: 'publish', progress: 100, time: 'Ready' },
];

function getStageIcon(stage: string) {
  switch (stage) {
    case 'research': return Clock;
    case 'draft': return FileText;
    case 'review': return CheckCircle;
    case 'publish': return PlayCircle;
    default: return FileText;
  }
}

function getStageColor(stage: string) {
  switch (stage) {
    case 'research': return 'text-blue-400 bg-blue-400/10';
    case 'draft': return 'text-yellow-400 bg-yellow-400/10';
    case 'review': return 'text-purple-400 bg-purple-400/10';
    case 'publish': return 'text-green-400 bg-green-400/10';
    default: return 'text-gray-400 bg-gray-400/10';
  }
}

export default function PipelineWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-vyoma-white">Content Pipeline</h2>
        <span className="px-2 py-1 rounded-lg bg-vyoma-premium-gray/50 text-vyoma-white/60 text-xs font-medium">
          {pipelineItems.length} Active
        </span>
      </div>

      <div className="space-y-3">
        {pipelineItems.map((item, index) => {
          const StageIcon = getStageIcon(item.stage);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              whileHover={{ scale: 1.02, x: 2 }}
              className="glass rounded-xl p-3 cursor-pointer transition-premium"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${getStageColor(item.stage)}`}>
                  <StageIcon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-vyoma-white truncate">{item.title}</p>
                  <p className="text-xs text-vyoma-white/40 capitalize">{item.stage}</p>
                </div>
                
                <span className="text-xs text-vyoma-white/40 whitespace-nowrap">{item.time}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-vyoma-premium-gray/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                    className={`h-full rounded-full ${
                      item.progress === 100 
                        ? 'bg-green-400' 
                        : 'bg-gradient-to-r from-vyoma-orange to-vyoma-orange-hover'
                    }`}
                  />
                </div>
                <span className="text-xs text-vyoma-white/40">{item.progress}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2.5 rounded-xl border border-vyoma-premium-gray/50 text-vyoma-white/60 hover:text-vyoma-white hover:border-vyoma-orange/50 transition-premium text-sm font-medium">
        Manage Pipeline
      </button>
    </motion.div>
  );
}

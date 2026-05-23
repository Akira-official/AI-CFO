'use client';

import { motion } from 'framer-motion';
import { Brain, Activity, Zap, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const agents = [
  { 
    id: 1, 
    name: 'Trend Hunter', 
    status: 'active', 
    tasks: 23, 
    icon: TrendingUp,
    description: 'Monitoring trends'
  },
  { 
    id: 2, 
    name: 'Verification', 
    status: 'active', 
    tasks: 15, 
    icon: Shield,
    description: 'Fact-checking'
  },
  { 
    id: 3, 
    name: 'Research', 
    status: 'processing', 
    tasks: 8, 
    icon: Brain,
    description: 'Deep analysis'
  },
  { 
    id: 4, 
    name: 'Content Script', 
    status: 'idle', 
    tasks: 12, 
    icon: FileText,
    description: 'Ready for tasks'
  },
  { 
    id: 5, 
    name: 'SEO Intelligence', 
    status: 'active', 
    tasks: 19, 
    icon: Activity,
    description: 'Keyword analysis'
  },
  { 
    id: 6, 
    name: 'Social Listening', 
    status: 'active', 
    tasks: 31, 
    icon: Globe,
    description: 'Social monitoring'
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'text-green-400 bg-green-400/10';
    case 'processing': return 'text-vyoma-orange bg-vyoma-orange/10';
    case 'idle': return 'text-gray-400 bg-gray-400/10';
    case 'error': return 'text-red-400 bg-red-400/10';
    default: return 'text-gray-400 bg-gray-400/10';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'active': return CheckCircle;
    case 'processing': return Clock;
    case 'idle': return AlertCircle;
    case 'error': return AlertCircle;
    default: return AlertCircle;
  }
}

export default function AgentStatus() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-vyoma-white">AI Agents</h2>
        <span className="px-2 py-1 rounded-lg bg-vyoma-orange/10 text-vyoma-orange text-xs font-medium">
          {agents.filter(a => a.status === 'active').length} Active
        </span>
      </div>

      <div className="space-y-3">
        {agents.map((agent, index) => {
          const StatusIcon = getStatusIcon(agent.status);
          
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.02, x: 2 }}
              className="glass rounded-xl p-3 cursor-pointer transition-premium group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(agent.status)}`}>
                  <agent.icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-vyoma-white truncate">{agent.name}</p>
                    <StatusIcon className={`w-3 h-3 ${getStatusColor(agent.status).split(' ')[0]}`} />
                  </div>
                  <p className="text-xs text-vyoma-white/40 truncate">{agent.description}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-semibold text-vyoma-white">{agent.tasks}</p>
                  <p className="text-xs text-vyoma-white/40">tasks</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2.5 rounded-xl border border-vyoma-premium-gray/50 text-vyoma-white/60 hover:text-vyoma-white hover:border-vyoma-orange/50 transition-premium text-sm font-medium">
        View All Agents
      </button>
    </motion.div>
  );
}

// Import icons dynamically
import { TrendingUp, Shield, FileText, Globe } from 'lucide-react';

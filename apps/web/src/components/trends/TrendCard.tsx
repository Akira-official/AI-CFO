'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, Shield, CheckCircle, AlertCircle, Globe, ArrowRight } from 'lucide-react';

interface Trend {
  id: number;
  title: string;
  source: string;
  velocity: number;
  viralityScore: number;
  category: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  verified: boolean;
}

interface TrendCardProps {
  trend: Trend;
}

export default function TrendCard({ trend }: TrendCardProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400 bg-green-400/10';
      case 'negative': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getVelocityColor = (velocity: number) => {
    if (velocity >= 90) return 'text-vyoma-orange';
    if (velocity >= 70) return 'text-yellow-400';
    return 'text-blue-400';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className="glass-card rounded-2xl p-5 cursor-pointer transition-premium group"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getSentimentColor(trend.sentiment)}`}>
              {trend.sentiment}
            </span>
            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-vyoma-premium-gray/50 text-vyoma-white/60">
              {trend.category}
            </span>
            {trend.verified && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-green-400/10 text-green-400">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-vyoma-white mb-2 group-hover:text-vyoma-orange transition-premium">
            {trend.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-vyoma-white/50">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>{trend.source}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{trend.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <TrendingUp className={`w-4 h-4 ${getVelocityColor(trend.velocity)}`} />
                <span className={`text-lg font-bold ${getVelocityColor(trend.velocity)}`}>
                  {trend.velocity}
                </span>
              </div>
              <p className="text-xs text-vyoma-white/40">Velocity</p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-lg font-bold text-purple-400">{trend.viralityScore}</span>
              </div>
              <p className="text-xs text-vyoma-white/40">Virality</p>
            </div>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-vyoma-orange/10 hover:bg-vyoma-orange/20 text-vyoma-orange text-sm font-medium transition-premium opacity-0 group-hover:opacity-100">
            <span>Analyze</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-vyoma-premium-gray/30">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-vyoma-premium-gray/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${trend.velocity}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-vyoma-orange to-vyoma-orange-hover"
            />
          </div>
          <span className="text-xs text-vyoma-white/40 whitespace-nowrap">Trend strength</span>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Activity, Zap, Globe, Shield, Brain,
  Bell, Search, Plus, Filter, MoreHorizontal, RefreshCw,
  CheckCircle, AlertCircle, Clock, ArrowUpRight, Users, FileText
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import TrendCard from '@/components/trends/TrendCard';
import AgentStatus from '@/components/agents/AgentStatus';
import PipelineWidget from '@/components/pipeline/PipelineWidget';

const mockTrends = [
  {
    id: 1,
    title: 'AI Regulation Summit Announced',
    source: 'TechCrunch',
    velocity: 94,
    viralityScore: 87,
    category: 'Technology',
    timestamp: '5m ago',
    sentiment: 'neutral',
    verified: true,
  },
  {
    id: 2,
    title: 'Breaking: Major Climate Agreement Reached',
    source: 'Reuters',
    velocity: 89,
    viralityScore: 92,
    category: 'Politics',
    timestamp: '12m ago',
    sentiment: 'positive',
    verified: true,
  },
  {
    id: 3,
    title: 'New Quantum Computing Breakthrough',
    source: 'Nature',
    velocity: 76,
    viralityScore: 78,
    category: 'Science',
    timestamp: '23m ago',
    sentiment: 'positive',
    verified: false,
  },
  {
    id: 4,
    title: 'Market Volatility Increases Amid Fed Decision',
    source: 'Bloomberg',
    velocity: 82,
    viralityScore: 85,
    category: 'Finance',
    timestamp: '31m ago',
    sentiment: 'negative',
    verified: true,
  },
];

const stats = [
  { label: 'Active Agents', value: '10', change: '+2', icon: Brain, color: 'text-vyoma-orange' },
  { label: 'Trends Detected', value: '847', change: '+124', icon: TrendingUp, color: 'text-green-400' },
  { label: 'Content Generated', value: '2,341', change: '+89', icon: FileText, color: 'text-blue-400' },
  { label: 'Virality Score', value: '94%', change: '+12%', icon: Activity, color: 'text-purple-400' },
];

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [trends, setTrends] = useState(mockTrends);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="flex h-screen bg-vyoma-black">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-vyoma-white mb-2">Dashboard</h1>
              <p className="text-vyoma-white/60">Real-time intelligence overview</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className={`p-3 glass rounded-xl hover:bg-vyoma-premium-gray/50 transition-premium ${refreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCw className="w-5 h-5 text-vyoma-white/80" />
              </button>
              <button className="p-3 glass rounded-xl hover:bg-vyoma-premium-gray/50 transition-premium relative">
                <Bell className="w-5 h-5 text-vyoma-white/80" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-vyoma-orange rounded-full" />
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-vyoma-orange hover:bg-vyoma-orange-hover rounded-xl transition-premium shadow-glow">
                <Plus className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">New Workflow</span>
              </button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="glass-card rounded-2xl p-6 hover:shadow-glow transition-premium cursor-pointer magnetic-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-vyoma-premium-gray/50 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-3xl font-bold text-vyoma-white mb-1">{stat.value}</p>
                <p className="text-sm text-vyoma-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trends Feed */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-vyoma-white">Live Trends</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 glass rounded-lg hover:bg-vyoma-premium-gray/50 transition-premium">
                    <Filter className="w-4 h-4 text-vyoma-white/80" />
                  </button>
                  <button className="p-2 glass rounded-lg hover:bg-vyoma-premium-gray/50 transition-premium">
                    <MoreHorizontal className="w-4 h-4 text-vyoma-white/80" />
                  </button>
                </div>
              </div>
              
              {trends.map((trend, index) => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <TrendCard trend={trend} />
                </motion.div>
              ))}
            </motion.div>

            {/* Right Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <AgentStatus />
              <PipelineWidget />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

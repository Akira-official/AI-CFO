'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Activity, Zap, Globe, Shield, Brain } from 'lucide-react';

const features = [
  { icon: TrendingUp, text: 'Real-time Trend Detection' },
  { icon: Activity, text: 'Multi-source Monitoring' },
  { icon: Zap, text: 'AI-Powered Verification' },
  { icon: Globe, text: 'Global News Coverage' },
  { icon: Shield, text: 'Fake News Detection' },
  { icon: Brain, text: 'Autonomous Agents' },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-vyoma-black via-vyoma-graphite to-vyoma-premium-gray">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vyoma-orange/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-vyoma-orange/5 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 glass border-b border-vyoma-premium-gray/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vyoma-orange to-vyoma-orange-hover flex items-center justify-center ai-glow">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Vyoma Intelligence</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <button className="px-4 py-2 text-sm text-vyoma-white/80 hover:text-vyoma-white transition-premium">
              Features
            </button>
            <button className="px-4 py-2 text-sm text-vyoma-white/80 hover:text-vyoma-white transition-premium">
              Pricing
            </button>
            <button className="px-6 py-2.5 text-sm font-medium text-white bg-vyoma-orange hover:bg-vyoma-orange-hover rounded-lg transition-premium shadow-glow">
              Launch App
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-vyoma-premium-gray/50 mb-8">
            <span className="pulse-dot" />
            <span className="text-sm text-vyoma-white/80">AI Newsroom Operating System v1.0</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="text-vyoma-white">The Future of</span>
            <br />
            <span className="gradient-text">AI Journalism</span>
          </h1>

          <p className="text-xl text-vyoma-white/60 max-w-3xl mx-auto mb-12">
            Premium Enterprise-Grade Agentic AI Content Sourcing Platform for Media, 
            Newsrooms, Content Teams, and Digital Journalists.
          </p>

          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 text-base font-semibold text-white bg-vyoma-orange hover:bg-vyoma-orange-hover rounded-xl transition-premium shadow-glow ai-glow"
            >
              Start Free Trial
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 text-base font-semibold text-vyoma-white glass hover:bg-vyoma-premium-gray/50 rounded-xl transition-premium"
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-32"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer magnetic-hover"
            >
              <feature.icon className="w-8 h-8 text-vyoma-orange" />
              <span className="text-sm text-vyoma-white/80 text-center">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-32"
        >
          <div className="glass-card rounded-3xl p-2 border border-vyoma-premium-gray/50 shadow-premium">
            <div className="bg-vyoma-black/80 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-vyoma-premium-gray/50">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="p-8">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Active Agents', value: '10', change: '+2' },
                    { label: 'Trends Detected', value: '847', change: '+124' },
                    { label: 'Content Generated', value: '2,341', change: '+89' },
                    { label: 'Virality Score', value: '94%', change: '+12%' },
                  ].map((stat) => (
                    <div key={stat.label} className="glass rounded-xl p-4">
                      <p className="text-xs text-vyoma-white/50 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-vyoma-white">{stat.value}</p>
                      <p className="text-xs text-vyoma-orange">{stat.change}</p>
                    </div>
                  ))}
                </div>
                <div className="h-64 rounded-xl glass flex items-center justify-center">
                  <p className="text-vyoma-white/40">Live Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-vyoma-premium-gray/50 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-vyoma-white/40 text-sm">
          <p>© 2024 Vyoma Intelligence. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

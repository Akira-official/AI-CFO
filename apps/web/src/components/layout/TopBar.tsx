'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Command, Sparkles } from 'lucide-react';

export default function TopBar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass border-b border-vyoma-premium-gray/50 px-8 py-4"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className={`flex-1 max-w-2xl relative transition-premium ${searchFocused ? 'scale-[1.02]' : ''}`}>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-premium ${
            searchFocused 
              ? 'bg-vyoma-premium-gray/50 border-vyoma-orange' 
              : 'bg-vyoma-graphite/50 border-vyoma-premium-gray/50'
          }`}>
            <Search className="w-5 h-5 text-vyoma-white/40" />
            <input
              type="text"
              placeholder="Search trends, agents, or content... (⌘K)"
              className="flex-1 bg-transparent text-vyoma-white placeholder-vyoma-white/40 outline-none text-sm"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-vyoma-premium-gray/50">
              <Command className="w-3.5 h-3.5 text-vyoma-white/40" />
              <span className="text-xs text-vyoma-white/40">K</span>
            </div>
          </div>
          
          {/* AI Suggestions Dropdown */}
          {searchFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden shadow-xl z-50"
            >
              <div className="p-3 border-b border-vyoma-premium-gray/50">
                <p className="text-xs text-vyoma-white/40 font-medium">AI Suggestions</p>
              </div>
              {[
                { icon: Sparkles, text: 'Trending: AI Regulation Summit', category: 'Trend' },
                { icon: Sparkles, text: 'Breaking: Climate Agreement', category: 'News' },
                { icon: Sparkles, text: 'Agent: Research Agent Active', category: 'Agent' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-vyoma-premium-gray/50 cursor-pointer transition-premium"
                >
                  <item.icon className="w-4 h-4 text-vyoma-orange" />
                  <span className="text-sm text-vyoma-white">{item.text}</span>
                  <span className="ml-auto text-xs text-vyoma-white/40">{item.category}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-vyoma-white/80">System Online</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

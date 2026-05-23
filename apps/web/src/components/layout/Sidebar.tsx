'use client';

import { motion } from 'framer-motion';
import { 
  LayoutDashboard, TrendingUp, Bot, FileText, 
  Settings, Users, Bell, Search, Zap,
  ChevronDown, Home, Compass, FolderOpen, MessageSquare
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', href: '/', active: false },
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: TrendingUp, label: 'Trends', href: '/trends', active: false },
  { icon: Bot, label: 'Agents', href: '/agents', active: false },
  { icon: FileText, label: 'Pipeline', href: '/pipeline', active: false },
  { icon: Users, label: 'Team', href: '/team', active: false },
  { icon: Settings, label: 'Settings', href: '/settings', active: false },
];

const workspaceItems = [
  { icon: Compass, label: 'Explore', count: 12 },
  { icon: FolderOpen, label: 'Projects', count: 8 },
  { icon: MessageSquare, label: 'Discussions', count: 3 },
];

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-72 glass border-r border-vyoma-premium-gray/50 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-vyoma-premium-gray/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vyoma-orange to-vyoma-orange-hover flex items-center justify-center ai-glow">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-vyoma-white">Vyoma</h1>
            <p className="text-xs text-vyoma-white/40">Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="mb-6">
          <p className="px-3 mb-2 text-xs font-semibold text-vyoma-white/40 uppercase tracking-wider">
            Main Menu
          </p>
          {navItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-premium cursor-pointer group ${
                item.active
                  ? 'bg-vyoma-orange/20 text-vyoma-orange'
                  : 'text-vyoma-white/70 hover:bg-vyoma-premium-gray/50 hover:text-vyoma-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-vyoma-orange' : 'group-hover:text-vyoma-white'}`} />
              <span className="text-sm font-medium">{item.label}</span>
              {item.active && (
                <motion.div
                  layoutId="activeNav"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-vyoma-orange"
                />
              )}
            </motion.a>
          ))}
        </div>

        {/* Workspaces */}
        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-vyoma-white/40 uppercase tracking-wider">
            Workspaces
          </p>
          {workspaceItems.map((item, index) => (
            <motion.a
              key={item.label}
              href="#"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-vyoma-white/70 hover:bg-vyoma-premium-gray/50 hover:text-vyoma-white transition-premium cursor-pointer group"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
              <span className="ml-auto text-xs text-vyoma-white/40">{item.count}</span>
            </motion.a>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-vyoma-premium-gray/50">
        <div className="glass rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-vyoma-premium-gray/50 transition-premium">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vyoma-orange to-vyoma-orange-hover flex items-center justify-center">
            <span className="text-sm font-bold text-white">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-vyoma-white truncate">John Doe</p>
            <p className="text-xs text-vyoma-white/40 truncate">Editor-in-Chief</p>
          </div>
          <ChevronDown className="w-4 h-4 text-vyoma-white/40" />
        </div>
      </div>
    </motion.aside>
  );
}

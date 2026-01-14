import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  HelpCircle, 
  BookOpen, 
  Plus, 
  Mic, 
  MessageSquare, 
  LogOut,
  Files,
  Activity
} from 'lucide-react';
import { HOSPITAL_NAME, PRIMARY_COLOR } from '../constants';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onStartConsult: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onStartConsult }) => {
  const menuItems = [
    { icon: Files, label: 'My Notes' },
    { icon: FileText, label: 'My Templates' },
    { icon: LayoutDashboard, label: 'Template Library' },
    { icon: Settings, label: 'Preferences' },
    { icon: HelpCircle, label: 'Support' },
    { icon: BookOpen, label: 'Training Resources' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Brand */}
      <div className="p-6 flex items-center space-x-2">
        <div className="bg-red-50 p-1.5 rounded-lg text-red-700">
            <Activity size={24} />
        </div>
        <h1 className="font-bold text-lg text-gray-800 tracking-tight leading-tight">
          BBH Scribe
        </h1>
      </div>

      {/* Primary Actions */}
      <div className="px-4 space-y-3 mb-6">
        <button 
          onClick={onStartConsult}
          className="w-full text-white rounded-lg px-4 py-3 flex items-center justify-center space-x-2 font-medium shadow-md transition-transform active:scale-95 hover:opacity-90"
          style={{ backgroundColor: PRIMARY_COLOR, background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #B71C1C)` }}
        >
          <Mic size={18} />
          <span>Start Consult</span>
        </button>
        
        <button className="w-full bg-teal-600/10 text-teal-700 border border-teal-200 rounded-lg px-4 py-2.5 flex items-center justify-center space-x-2 font-medium hover:bg-teal-50 transition-colors">
          <Plus size={18} />
          <span>Custom Notes</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {menuItems.map((item, index) => (
          <button 
            key={index}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <item.icon size={18} className="text-gray-400" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 space-y-4 border-t border-gray-100">
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100 relative overflow-hidden group cursor-pointer hover:shadow-sm transition-shadow">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-teal-800 font-semibold mb-1">
              <MessageSquare size={16} />
              <span className="text-sm">Ask BBH AI</span>
            </div>
            <p className="text-xs text-teal-600">AI Medical Assistant</p>
          </div>
          <div className="absolute -right-2 -bottom-4 text-teal-100 opacity-50 group-hover:scale-110 transition-transform">
             <Activity size={64} />
          </div>
        </div>

        <button className="flex items-center space-x-2 text-gray-400 hover:text-red-600 px-2 text-sm font-medium transition-colors">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
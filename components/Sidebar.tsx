import React from 'react';
import { 
  Home,
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
import { PRIMARY_COLOR } from '../constants';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onStartConsult: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onStartConsult }) => {
  const menuItems: { icon: any; label: string; id: AppView }[] = [
    { icon: Home, label: 'Home', id: 'DASHBOARD' },
    { icon: Files, label: 'My Notes', id: 'MY_NOTES' },
    { icon: Settings, label: 'Preferences', id: 'PREFERENCES' },
    { icon: HelpCircle, label: 'Support', id: 'SUPPORT' },
    { icon: BookOpen, label: 'Training Resources', id: 'TRAINING' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 flex-shrink-0 z-40 print:hidden">
      {/* Brand / Logo Area */}
      <div 
        className="px-5 py-6 flex flex-col items-center cursor-pointer group hover:bg-gray-50 transition-colors border-b border-gray-100"
        onClick={() => onChangeView('DASHBOARD')}
      >
        <div className="flex items-center w-full space-x-3 mb-2">
            {/* Logo Icon: Stylized Red Heart with Cross */}
            <div className="relative flex-shrink-0 drop-shadow-sm">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Heart Shape */}
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#DC2626" stroke="#B91C1C" strokeWidth="0.5"/>
                    {/* Cross */}
                    <path d="M12 8.5v7M8.5 12h7" stroke="white" strokeWidth="2.5" strokeLinecap="square"/>
                </svg>
            </div>
            <div className="flex flex-col justify-center">
                 <h1 className="font-bold text-sm text-gray-900 leading-tight">
                    Bangalore<br/>Baptist Hospital
                 </h1>
            </div>
        </div>
        
        {/* Ribbon Quote */}
        <div className="w-full relative mt-1 mx-1">
            <div className="bg-[#B71C1C] text-white text-[9px] py-1 px-1 text-center font-serif italic leading-tight shadow-sm rounded-sm">
                "I came that they may have life. John 10:10"
            </div>
            {/* Ribbon Ends Effect (Visual Polish) */}
            <div className="absolute top-0 -left-1 w-1 h-full bg-[#8B0000] transform skew-y-12 -z-10 rounded-l-sm"></div>
            <div className="absolute top-0 -right-1 w-1 h-full bg-[#8B0000] transform -skew-y-12 -z-10 rounded-r-sm"></div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="px-4 space-y-3 my-6">
        <button 
          onClick={onStartConsult}
          className="w-full text-white rounded-lg px-4 py-3 flex items-center justify-center space-x-2 font-medium shadow-md transition-transform active:scale-95 hover:opacity-90"
          style={{ backgroundColor: PRIMARY_COLOR, background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #B71C1C)` }}
        >
          <Mic size={18} />
          <span>Start Consult</span>
        </button>
        
        <button 
            onClick={() => onChangeView('MY_TEMPLATES')}
            className="w-full bg-teal-600/10 text-teal-700 border border-teal-200 rounded-lg px-4 py-2.5 flex items-center justify-center space-x-2 font-medium hover:bg-teal-50 transition-colors"
        >
          <Plus size={18} />
          <span>Custom Notes</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
                <button 
                    key={item.id}
                    onClick={() => onChangeView(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium
                        ${isActive 
                            ? 'bg-gray-100 text-gray-900 font-semibold' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                >
                    <item.icon size={18} className={isActive ? 'text-gray-800' : 'text-gray-400'} />
                    <span>{item.label}</span>
                </button>
            );
        })}
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
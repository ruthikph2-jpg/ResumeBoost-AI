import React from 'react';
import { 
  LayoutGrid, 
  FileText, 
  PlusCircle, 
  Edit3, 
  History, 
  Compass, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';

export type NavTab = 'dashboard' | 'analyze' | 'create' | 'modify' | 'history' | 'roadmaps' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutGrid },
    { id: 'analyze' as NavTab, label: 'Analyze', icon: FileText },
    { id: 'create' as NavTab, label: 'Create Resume', icon: PlusCircle },
    { id: 'modify' as NavTab, label: 'Modify Resume', icon: Edit3 },
    { id: 'history' as NavTab, label: 'History', icon: History },
    { id: 'roadmaps' as NavTab, label: 'Roadmaps', icon: Compass },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-screen flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-extrabold text-sm tracking-wider">
              RB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base tracking-tight leading-tight">
                  Analyze Resume
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  v1
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">AI Career Booster</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-600 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-600 stroke-[2.5]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Pill at Bottom */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100/70 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              R
            </div>
            <div>
              <div className="font-bold text-xs text-slate-800 leading-tight">Ruthik ph</div>
              <div className="text-[11px] text-indigo-600 font-medium">CSE • Java Stack</div>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('analyze')} 
            className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg transition-colors"
            title="Switch to scan"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

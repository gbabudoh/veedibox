"use client";

import { useState } from "react";
import { 
  User, Lock, Bell, ChevronRight
} from "lucide-react";
import { useSession } from "next-auth/react";

export function SettingsView() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");

  const SECTIONS = [
    { 
      id: "profile", 
      title: "Profile Settings", 
      description: "Manage your personal information and branding.",
      icon: User
    },
    { 
      id: "security", 
      title: "Login & Security", 
      description: "Update your password and secure your account.",
      icon: Lock
    },
    { 
      id: "notifications", 
      title: "Notifications", 
      description: "Configure how you receive premieres alerts.",
      icon: Bell
    },
  ];

  return (
    <div className="max-w-4xl">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Account <span className="text-primary italic">Control.</span></h1>
        <p className="text-white/40 text-sm font-medium uppercase tracking-widest">
          Logged in as {session?.user?.email || "User"}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Settings Navigation */}
        <div className="space-y-4">
          {SECTIONS.map((section) => (
            <button 
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                activeTab === section.id 
                  ? "bg-white/5 border-primary/50" 
                  : "bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${activeTab === section.id ? "bg-primary text-white" : "bg-white/5 text-white/40 group-hover:text-white"}`}>
                  <section.icon size={18} />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${activeTab === section.id ? "text-white" : "text-white/60 group-hover:text-white"}`}>
                    {section.title}
                  </h3>
                </div>
              </div>
              {activeTab === section.id && <ChevronRight size={16} className="text-primary" />}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-2 glass-card p-8 border border-white/5 min-h-[400px]">
          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-8">
                <User size={24} className="text-primary" />
                <h2 className="text-xl font-black uppercase tracking-widest">Profile Settings</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">First Name</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-primary transition-colors outline-none" placeholder="Enter first name" />
                  </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Last Name</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-primary transition-colors outline-none" placeholder="Enter last name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Email Address</label>
                  <input 
                    type="email" 
                    value={session?.user?.email || ""} 
                    disabled 
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white/40 cursor-not-allowed outline-none" 
                  />
                </div>

                <div className="pt-8 flex justify-end">
                  <button className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-white/90 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center h-full text-center opacity-40">
              <Lock size={48} className="mb-4" />
              <h3 className="text-lg font-black uppercase tracking-widest">Security Settings</h3>
              <p className="text-xs">Coming Soon</p>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center h-full text-center opacity-40">
              <Bell size={48} className="mb-4" />
              <h3 className="text-lg font-black uppercase tracking-widest">Notification Preferences</h3>
              <p className="text-xs">Coming Soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

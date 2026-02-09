"use client";

import { 
  User, Lock, Bell, ChevronRight
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();

  const SECTIONS = [
    { 
      id: "profile", 
      title: "Profile Settings", 
      description: "Manage your personal information and branding.",
      icon: User,
      active: true 
    },
    { 
      id: "security", 
      title: "Login & Security", 
      description: "Update your password and secure your account.",
      icon: Lock,
      active: false 
    },
    { 
      id: "notifications", 
      title: "Notifications", 
      description: "Configure how you receive premieres alerts.",
      icon: Bell,
      active: false 
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 px-8 pb-12">
      <div className="max-w-4xl mx-auto">
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
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                  section.active 
                    ? "bg-white/5 border-primary/50" 
                    : "bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${section.active ? "bg-primary text-white" : "bg-white/5 text-white/40 group-hover:text-white"}`}>
                    <section.icon size={18} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${section.active ? "text-white" : "text-white/60 group-hover:text-white"}`}>
                      {section.title}
                    </h3>
                  </div>
                </div>
                {section.active && <ChevronRight size={16} className="text-primary" />}
              </button>
            ))}
          </div>

          {/* Settings Content Area */}
          <div className="md:col-span-2 glass-card p-8 border border-white/5 min-h-[400px]">
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
        </div>
      </div>
    </div>
  );
}

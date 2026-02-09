"use client";

import { motion } from "framer-motion";
import { 
  Search, Filter, Trash2, Edit2, 
  CheckCircle, MoreVertical, Shield, Mail
} from "lucide-react";

const MOCK_USERS = [
  { id: 1, name: "Marcus Thorne", email: "filmmaker@veedibox.com", role: "CREATOR", joinDate: "Feb 09, 2026", status: "Verified" },
  { id: 2, name: "John Cinema", email: "viewer@veedibox.com", role: "VIEWER", joinDate: "Feb 08, 2026", status: "Verified" },
  { id: 3, name: "Sarah Lens", email: "sarah@indie.com", role: "CREATOR", joinDate: "Jan 15, 2026", status: "Pending" },
  { id: 4, name: "Mike Stream", email: "mike@watch.com", role: "VIEWER", joinDate: "Jan 20, 2026", status: "Verified" },
  { id: 5, name: "System Administrator", email: "admin@veedibox.com", role: "ADMIN", joinDate: "Nov 01, 2025", status: "Verified" },
];

export default function AdminUsersPage() {
  return (
    <main className="flex-1 p-12 overflow-y-auto w-full">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">User <span className="text-accent italic font-serif">Registry.</span></h1>
        <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Manage access and account status across the platform.</p>
      </header>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-8">
         <div className="flex gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search by name, email, or ID..." 
                className="bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-accent/50 focus:bg-white/10 w-80 transition-all placeholder:text-white/20" 
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-xs font-black uppercase tracking-widest text-white/60 hover:text-white">
                <Filter size={16} /> Filter
            </button>
         </div>

         <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-accent text-black rounded-xl hover:bg-accent/90 transition-colors text-xs font-black uppercase tracking-widest">
                <Mail size={16} /> Broadcast Email
            </button>
         </div>
      </div>

      {/* User Table */}
      <div className="glass-card border border-white/5 overflow-hidden rounded-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-6">User Identity</th>
              <th className="px-8 py-6">Role</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6">Joined</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs font-bold">
            {MOCK_USERS.map((user) => (
              <motion.tr 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={user.id} 
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center text-white/40 font-mono text-xs">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white group-hover:text-accent transition-colors">{user.name}</p>
                      <p className="text-white/40 font-mono text-[10px]">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border ${
                    user.role === 'ADMIN' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                    user.role === 'CREATOR' ? 'bg-accent/10 border-accent/20 text-accent' :
                    'bg-white/5 border-white/10 text-white/60'
                  }`}>
                    {user.role === 'ADMIN' && <Shield size={10} />}
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                     <CheckCircle size={14} className={user.status === 'Verified' ? 'text-green-500' : 'text-white/20'} /> 
                     <span className={user.status === 'Verified' ? 'text-green-500' : 'text-white/40'}>{user.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6 opacity-40 font-mono text-[10px]">{user.joinDate}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"><Edit2 size={14} /></button>
                     <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-white/60 hover:text-red-500"><Trash2 size={14} /></button>
                     <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"><MoreVertical size={14} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-6 flex items-center justify-between border-t border-white/5 bg-white/[0.01]">
           <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Showing 5 of 12,840 Users</span>
           <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest disabled:opacity-30" disabled>Previous</button>
              <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest">Next</button>
           </div>
        </div>
      </div>
    </main>
  );
}

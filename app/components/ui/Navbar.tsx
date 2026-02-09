"use client";

import { Film, LogOut, LayoutDashboard } from "lucide-react";
import { CinemaButton } from "./CinemaButton";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isAuthPage = pathname?.startsWith("/auth");
  const isDashboardPage = pathname?.startsWith("/dashboard");

  if (isAuthPage || isDashboardPage) return null;

  const navLinks = [
    { name: "Premieres", href: "/premieres" },
    { name: "Box Office", href: "/box-office" },
    { name: "Masterclass", href: "/masterclass" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b-0 py-4 px-6 md:px-12 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 bg-primary rounded-lg thermal-glow flex items-center justify-center">
          <Film className="text-white" size={18} />
        </div>
        <span className="text-xl font-black tracking-tighter uppercase text-glow">Veedibox</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            className={`hover:text-primary transition-all duration-300 ${
              pathname === link.href ? "text-primary opacity-100" : "opacity-70"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {session ? (
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/${session.user.role.toLowerCase()}`}>
              <CinemaButton variant="outline" className="px-6 py-2 text-[10px] hidden sm:flex" icon={LayoutDashboard}>
                Dashboard
              </CinemaButton>
            </Link>
            <button 
              onClick={() => signOut()}
              className="p-2 text-foreground/40 hover:text-red-500 transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
              Login
            </Link>
            <Link href="/auth/register">
              <CinemaButton variant="primary" className="px-6 py-2 text-[10px]">
                Join Now
              </CinemaButton>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

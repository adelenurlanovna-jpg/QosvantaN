"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type NavLink = { label: string; href: string; desc?: string };
type NavGroup = { label: string; links: NavLink[] };

const navGroups: NavGroup[] = [
  {
    label: "Methods",
    links: [
      { label: "All Providers", href: "/search", desc: "Browse the full catalog" },
      { label: "Fiat & Card Methods", href: "/search?method=fiat", desc: "Cards, bank transfers, wallets" },
      { label: "Crypto Rails", href: "/search?method=crypto", desc: "USDT, BTC, ETH, stablecoins" },
      { label: "Local Methods", href: "/search?method=local", desc: "PIX, UPI, M-Pesa and more" },
      { label: "Bank Transfers", href: "/search?method=bank", desc: "SWIFT, SEPA, local banks" },
    ],
  },
  {
    label: "Segments",
    links: [
      { label: "Business Standard", href: "/search?segment=business", desc: "E-commerce, SaaS, platforms" },
      { label: "High-Risk Fiat", href: "/search?segment=high_risk_fiat", desc: "iGaming, forex, regulated" },
      { label: "High-Risk Crypto", href: "/search?segment=high_risk_crypto", desc: "Crypto-native infrastructure" },
      { label: "Alternative", href: "/search?segment=alternative_dark", desc: "Non-standard payment rails" },
    ],
  },
  {
    label: "Access",
    links: [
      { label: "Verified Providers", href: "/search?verified=true", desc: "KYC-checked, audited" },
      { label: "Featured Providers", href: "/search?verified=featured", desc: "Hand-picked top-tier" },
      { label: "No KYC Required", href: "/search?kyc=none", desc: "Anonymous onboarding" },
      { label: "Basic KYC Only", href: "/search?kyc=basic", desc: "Light identity check" },
    ],
  },
  {
    label: "Solutions",
    links: [
      { label: "For Merchants", href: "/search?segment=business", desc: "Standard payment processing" },
      { label: "For Crypto Businesses", href: "/search?segment=high_risk_crypto", desc: "Blockchain-native providers" },
      { label: "High-Risk Industries", href: "/search?segment=high_risk_fiat", desc: "Compliance-reviewed access" },
      { label: "Alternative Needs", href: "/search?segment=alternative_dark", desc: "Non-standard rails" },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setIsAdmin(Boolean((data as { is_admin?: boolean } | null)?.is_admin)));
  }, [user]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserMenuOpen(false);
  };

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  };

  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  };

  const userInitial = user?.email?.[0]?.toUpperCase() ?? "?";
  const userName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email;

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(255,255,255,0.93)",
        borderColor: "rgba(15,23,42,0.08)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setActiveMenu(null)}>
            <img
              src="/logo-icon-transparent.png"
              alt=""
              aria-hidden
              className="w-8 h-8 rounded-lg flex-shrink-0"
              style={{ display: "block" }}
            />
            <span className="font-bold text-[15px] tracking-tight" style={{ color: "#0F172A" }}>
              Qosvanta
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            <Link
              href="/blog"
              onClick={() => setActiveMenu(null)}
              className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-50"
              style={{ color: "#334155" }}
            >
              Blog
            </Link>
            {navGroups.map((group) => (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => openMenu(group.label)}
                onMouseLeave={closeMenu}
              >
                <button
                  className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-50"
                  style={{ color: activeMenu === group.label ? "#0F172A" : "#334155" }}
                >
                  {group.label}
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    style={{
                      transition: "transform 0.2s",
                      transform: activeMenu === group.label ? "rotate(180deg)" : "rotate(0deg)",
                      color: "#94A3B8",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {activeMenu === group.label && (
                  <div
                    className="absolute top-full left-0 mt-1 rounded-2xl py-3"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(15,23,42,0.09)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)",
                      width: "320px",
                    }}
                    onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
                    onMouseLeave={closeMenu}
                  >
                    <ul className="px-2">
                      {group.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="block px-3 py-2 rounded-lg transition-colors hover:bg-slate-50"
                            onClick={() => setActiveMenu(null)}
                          >
                            <span className="text-sm font-medium block" style={{ color: "#0F172A" }}>
                              {link.label}
                            </span>
                            {link.desc && (
                              <span className="text-xs block mt-0.5" style={{ color: "#94A3B8" }}>
                                {link.desc}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA group */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/partners"
              className="px-4 h-10 inline-flex items-center rounded-full text-sm font-medium transition-all hover:bg-slate-50 hover:border-slate-300"
              style={{ color: "#0F172A", border: "1px solid rgba(15,23,42,0.14)" }}
            >
              List solution
            </Link>

            <Link
              href="/search"
              className="px-5 h-10 inline-flex items-center rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
            >
              Get started
            </Link>

            {/* Vertical divider */}
            <div className="h-6 w-px" style={{ background: "rgba(15,23,42,0.12)" }} />

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-label="Account menu"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #7C3AED)",
                    outline: userMenuOpen ? "2px solid rgba(59,130,246,0.35)" : "2px solid transparent",
                    outlineOffset: "2px",
                  }}
                >
                  {userInitial}
                </button>
                {userMenuOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 w-64 rounded-xl py-2"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(15,23,42,0.09)",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(15,23,42,0.07)" }}>
                      <p className="text-sm font-semibold truncate" style={{ color: "#0F172A" }}>
                        {userName}
                      </p>
                      <p className="text-xs truncate mt-0.5" style={{ color: "#94A3B8" }}>
                        {user.email}
                      </p>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin/review"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                        style={{ color: "#0F172A" }}
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: "#0D0F1E", color: "#C9A84C" }}>Admin</span>
                          Review queue
                        </span>
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                      style={{ color: "#0F172A" }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                aria-label="Sign in"
                title="Sign in"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-slate-50"
                style={{ color: "#475569", border: "1px solid rgba(15,23,42,0.14)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}
          </div>

          {/* Mobile: visible auth + burger */}
          <div className="lg:hidden flex items-center gap-2">
            {user ? (
              <Link
                href={isAdmin ? "/admin/review" : "/"}
                aria-label="Account"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
              >
                {userInitial}
              </Link>
            ) : (
              <Link
                href="/login"
                aria-label="Sign in"
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ color: "#475569", border: "1px solid rgba(15,23,42,0.14)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}
          <button
            className="p-2 rounded-lg transition-colors hover:bg-slate-50"
            style={{ color: "#334155" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
            </svg>
          </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t py-4" style={{ borderColor: "rgba(15,23,42,0.07)" }}>
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="block px-2 py-2 mb-3 rounded-lg text-sm font-semibold hover:bg-slate-50"
              style={{ color: "#0F172A" }}
            >
              Blog
            </Link>
            {navGroups.map((group) => (
              <div key={group.label} className="mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest px-2 mb-1" style={{ color: "#94A3B8" }}>
                  {group.label}
                </p>
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block px-2 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
                    style={{ color: "#334155" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t" style={{ borderColor: "rgba(15,23,42,0.07)" }}>
              {user ? (
                <>
                  <div className="px-2 py-1">
                    <p className="text-sm font-semibold truncate" style={{ color: "#0F172A" }}>{userName}</p>
                    <p className="text-xs truncate" style={{ color: "#94A3B8" }}>{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      href="/admin/review"
                      onClick={() => setMobileOpen(false)}
                      className="text-center py-2.5 rounded-full text-sm font-semibold text-white"
                      style={{ background: "#0D0F1E" }}
                    >
                      Admin · Review queue
                    </Link>
                  )}
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="text-center py-2.5 rounded-full text-sm font-medium"
                    style={{ color: "#334155", border: "1px solid rgba(15,23,42,0.14)" }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2.5 rounded-full text-sm font-medium"
                  style={{ color: "#334155", border: "1px solid rgba(15,23,42,0.14)" }}
                >
                  Sign in
                </Link>
              )}
              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2.5 rounded-full text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

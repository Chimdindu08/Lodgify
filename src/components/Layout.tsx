import { BookOpenText, Building2, History, Home, LayoutDashboard, LogIn, LogOut, Menu, PlusCircle, Search, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/lodges", label: "Browse lodges", icon: Search },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  return <div className="site-shell"><header className="topbar"><div className="container topbar-inner"><Logo /><nav className="desktop-nav">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === "/"}><Icon size={17} />{label}</NavLink>)}<NavLink to="/submit" className="nav-submit"><PlusCircle size={17} />Submit a lodge</NavLink>{user ? <div className="account-menu">{user.role === "admin" && <NavLink to="/admin"><LayoutDashboard size={17} />Admin</NavLink>}<NavLink to="/history"><History size={17} />My history</NavLink><button onClick={logout} title="Log out"><LogOut size={18} /></button></div> : <NavLink to="/login"><LogIn size={17} />Sign in</NavLink>}</nav><button className="menu-button" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></button></div></header>{open && <button className="drawer-scrim" onClick={() => setOpen(false)} aria-label="Close navigation" />}<aside className={`drawer ${open ? "open" : ""}`}><div className="drawer-head"><Logo /><button onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button></div><nav>{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === "/"}><Icon />{label}</NavLink>)}<NavLink to="/submit"><PlusCircle />Submit a lodge</NavLink>{user?.role === "admin" && <NavLink to="/admin"><LayoutDashboard />Admin dashboard</NavLink>}{user && <NavLink to="/history"><History />My submission history</NavLink>}{user ? <button onClick={logout}><LogOut />Sign out</button> : <NavLink to="/login"><UserRound />Sign in or register</NavLink>}</nav></aside><main><Outlet /></main><footer><div className="container footer-grid"><div><Logo /><p>Student experiences and real lodge information around Nnamdi Azikiwe University.</p></div><div><strong>Explore</strong><Link to="/lodges"><Building2 size={15} />Lodge directory</Link><Link to="/submit"><PlusCircle size={15} />Share an experience</Link></div><div><strong>Student guide</strong><span><BookOpenText size={15} />Verify details before payment</span><span>Independent student reviews</span></div></div><div className="container footer-bottom">IfiteLodge · Student accommodation review platform</div></footer></div>;
}

import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Radar, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/input", label: "New Assessment" },
  { to: "/history", label: "History" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Radar className="h-5 w-5 text-primary" />
            <span className="flex flex-col leading-tight">
              <span>RiskLens</span>
              <span className="hidden text-[10px] font-normal text-muted-foreground sm:block">
                See Risks. Stay Ahead.
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user?.businessName}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Outlet />
      </main>
    </div>
  );
}

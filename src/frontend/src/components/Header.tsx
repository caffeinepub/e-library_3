import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import {
  BookMarked,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

export function Header() {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity;
  const { data: isAdmin } = useIsCallerAdmin();
  const router = useRouter();

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    clear();
    void router.navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <BookMarked className="w-7 h-7 text-forest" />
          </motion.div>
          <div>
            <span className="font-display text-xl font-bold text-foreground tracking-tight">
              Folio
            </span>
            <span className="font-display text-xl font-light text-sienna tracking-tight">
              .lib
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {isLoggedIn && (
            <Link
              to="/favorites"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-ui text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favorites</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-ui text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-2 ml-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-xs font-ui text-muted-foreground">
                <User className="w-3 h-3" />
                <span className="max-w-[100px] truncate">
                  {identity.getPrincipal().toString().slice(0, 8)}…
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="font-ui text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={handleLogin}
              disabled={isLoggingIn || isInitializing}
              className="ml-2 font-ui bg-forest text-primary-foreground hover:bg-forest/90"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              {isLoggingIn ? "Connecting…" : "Login"}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

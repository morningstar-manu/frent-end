import React from "react";
import { DarkThemeToggle, Dropdown, Avatar, Badge } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../_store";
import { Link, useLocation } from "react-router-dom";
import {
  HiHome,
  HiUsers,
  HiCog,
  HiInformationCircle,
  HiLogout,
  HiMenuAlt3,
  HiX,
} from "react-icons/hi";

export default function DefaultNavbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isLogged = useSelector((state) => state.auth?.isLogged);
  const roles = useSelector((state) => state.auth?.roles);
  const user = useSelector((state) => state.auth?.user);

  const logout = () => dispatch(authActions.logout());

  if (!isLogged) return null;

  const hasRole = (role) => roles?.includes(role);
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Accueil", icon: HiHome, show: true },
    {
      to: "/manager",
      label: "Manager",
      icon: HiUsers,
      show: hasRole("ROLE_ADMIN") || hasRole("ROLE_MODERATOR"),
    },
    {
      to: "/admin",
      label: "Administration",
      icon: HiCog,
      show: hasRole("ROLE_ADMIN"),
    },
    { to: "/about", label: "A propos", icon: HiInformationCircle, show: true },
  ];

  const getRoleBadge = () => {
    if (hasRole("ROLE_ADMIN")) return { label: "Admin", color: "failure" };
    if (hasRole("ROLE_MODERATOR"))
      return { label: "Manager", color: "warning" };
    return { label: "Agent", color: "info" };
  };

  const roleBadge = getRoleBadge();

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-soft group-hover:shadow-md transition-shadow">
              <svg
                className="w-6 h-6 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-foreground">
                Linkuup
              </span>
              <span className="text-lg font-light text-primary"> Medical</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks
              .filter((link) => link.show)
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <DarkThemeToggle className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg p-2" />

            {/* User Dropdown */}
            <Dropdown
              inline
              arrowIcon={false}
              label={
                <div className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-secondary transition-colors">
                  <Avatar
                    alt={`${user?.firstName}`}
                    img={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0ea5e9&color=fff`}
                    rounded
                    size="sm"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-foreground">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <Badge color={roleBadge.color} size="xs">
                      {roleBadge.label}
                    </Badge>
                  </div>
                </div>
              }
            >
              <Dropdown.Header>
                <span className="block text-sm font-semibold text-foreground">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="block text-xs text-muted-foreground truncate mt-0.5">
                  {user?.email}
                </span>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item
                icon={HiLogout}
                onClick={logout}
                className="text-destructive"
              >
                Deconnexion
              </Dropdown.Item>
            </Dropdown>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {mobileMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenuAlt3 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-1">
              {navLinks
                .filter((link) => link.show)
                .map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.to)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Stethoscope, Users, BarChart3, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Consultation", url: "/consultation", icon: Stethoscope },
  { title: "Patients", url: "/patients", icon: Users },
  { title: "Insights", url: "/insights", icon: BarChart3 },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); // Default to open on desktop
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On mobile, close sidebar by default
      // On desktop, restore to open state if previously closed due to mobile view
      if (mobile) {
        setIsOpen(false);
      } else {
        // On desktop, keep sidebar open (restore to default state)
        setIsOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle navigation changes - prevent sidebar from opening automatically
  useEffect(() => {
    // Do nothing on navigation - let the sidebar maintain its current state
    // This prevents the sidebar from automatically opening when navigating
  }, [location]);

  return (
    <>
      {/* Mobile Toggle - Show hamburger only when sidebar is closed */}
      {isMobile && !isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="fixed top-24 left-4 z-50 md:hidden rounded-full shadow-lg bg-card"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r shadow-lg transition-all duration-300 z-40 ${
          isOpen ? "w-64" : (isMobile ? "w-0" : "w-16")
        } overflow-hidden`}
      >
        {/* Close button inside sidebar when open - ONLY on mobile */}
        {isOpen && isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 rounded-full shadow-lg bg-card md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        
        <nav className="p-4 space-y-2 pt-16 md:pt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                  isActive
                    ? "medical-gradient text-primary-foreground shadow-md shadow-primary/30"
                    : "hover:bg-accent hover:shadow-sm"
                }`}
                // Removed any onClick that would change sidebar state during navigation
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "" : "text-primary"}`} />
                <span className={`font-medium ${isActive ? "" : "text-card-foreground"} ${!isOpen && !isMobile ? "hidden" : "block"}`}>
                  {item.title}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Spacer for desktop - maintain consistent width */}
      <div className={`hidden md:block transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`} />
    </>
  );
}
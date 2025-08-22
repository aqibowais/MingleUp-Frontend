import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, MessagesSquare, Settings, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  const { logout, authUser } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-md">
      <div className="flex items-center justify-between p-4 md:p-6 bg-base-100 text-base-content">
        <Link to={authUser ? "/" : "/login"} className="flex items-center gap-2">
          <div className="bg-primary/15 flex items-center justify-center rounded-xl p-2">
            <MessagesSquare className="size-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary">Mingle Up</h2>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-base-content"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-3">
          <NavLinks authUser={authUser} logout={logout} />
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-base-100 p-4 shadow-lg">
          <div className="flex flex-col gap-3">
            <NavLinks authUser={authUser} logout={logout} mobile />
          </div>
        </div>
      )}
    </header>
  );
}

// Extracted component for nav links to avoid repetition
function NavLinks({ authUser, logout, mobile = false }) {
  const linkClass = `
    px-4 py-2 rounded-full
    flex items-center gap-2
    font-medium transition-colors
    ${mobile ? "w-full justify-start" : ""}
    bg-primary/10 hover:bg-primary/20 text-base-content
  `;

  return (
    <>
      <Link to="/settings" className={linkClass}>
        <Settings className="size-5 text-primary" />
        <span className={mobile ? "inline" : "hidden sm:inline"}>Settings</span>
      </Link>

      {authUser && (
        <>
          <Link to="/profile" className={linkClass}>
            <User className="size-5 text-primary" />
            <span className={mobile ? "inline" : "hidden sm:inline"}>Profile</span>
          </Link>

          <button
            onClick={logout}
            className={`
              ${linkClass}
              text-error hover:bg-error/10
            `}
          >
            <LogOut className="size-5 text-error" />
            <span className={mobile ? "inline" : "hidden sm:inline"}>Logout</span>
          </button>
        </>
      )}
    </>
  );
}

export default Navbar;

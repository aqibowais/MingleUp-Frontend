import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  const { logout, authUser } = useAuthStore();
  return (
    <header>
      <div className="flex items-center justify-between p-6 bg-primary/10 text-white">
        <Link
          to={authUser ? "/" : "/login"}
        >
        <div className="flex items-center justify-center gap-2 ml-8">
          <MessageSquare className="size-6 text-primary" />
          <h2 className="text-lg font-semibold">Mingle Up</h2>
        </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={"/settings"}
            className={`
              btn btn-sm gap-2 transition-colors
              bg-primary/20 hover:bg-primary/30
              rounded-full px-4 py-2
              flex items-center
              `}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {authUser && (
            <>
              <Link
                to={"/profile"}
                className={`
                     btn btn-sm gap-2 transition-colors
                     bg-primary/20 hover:bg-primary/30
                     rounded-full px-4 py-2
                     flex items-center
                  `}
              >
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                className={`
                    btn btn-sm gap-2 transition-colors
                    bg-red-500/20 hover:bg-red-500/30
                    rounded-full px-4 py-2
                    flex items-center
                  `}
                onClick={logout}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

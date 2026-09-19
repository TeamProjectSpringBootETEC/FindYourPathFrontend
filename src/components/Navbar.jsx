import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { User, LogOut, LayoutDashboard, Bell } from "lucide-react";
import { getStudentProfileByUserId } from "@/service/studentProfileApi";
import { getNotificationsByUser } from "@/service/notificationApi";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [selectedLang, setSelectedLang] = useState("English");
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const langDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const initial = (user?.name || "U").trim().charAt(0).toUpperCase();

  // Load the user's profile photo (from their student profile) for the avatar
  useEffect(() => {
    if (!user?.id) {
      setPhotoUrl(null);
      return;
    }
    getStudentProfileByUserId(user.id)
      .then((profile) => setPhotoUrl(profile.profile_photo || null))
      .catch(() => setPhotoUrl(null));
  }, [user?.id]);

  // Load the unread notification count for the bell badge
  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    getNotificationsByUser(user.id)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        if (active) setUnreadCount(list.filter((n) => !n.isRead).length);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user?.id]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/job" },
    { name: "Events", path: "/events" },
    { name: "Company", path: "/company" },
    { name: "About Us", path: "/about" },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "km", name: "Khmer" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setLangOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setPhotoUrl(null);
    setProfileOpen(false);
    navigate("/");
  };

  const role = String(user?.roleName || "").toUpperCase();
  const dashboardPath = role.includes("ADMIN")
    ? "/dashboard"
    : role.includes("COMPANY") || user?.roleId === 2
      ? "/company-dashboard"
      : null;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-100 bg-white px-8 py-4 shadow-sm">
      {/* ================= LOGO ================= */}
      <Link to="/" className="text-2xl font-semibold ">
        <span className="font-bold text-4xl">Find </span>
        <span className="font-bold text-blue-600">Scholarships & Jobs</span>
      </Link>

      {/* ================= NAVIGATION ================= */}
      <div className="flex items-center gap-8">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `relative py-2 text-base font-medium transition-colors ${
                isActive
                  ? "font-semibold text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* ================= RIGHT CONTROLS ================= */}
      <div className="flex items-center gap-6">
        {/* ================= LANGUAGE ================= */}
        <div className="relative z-[100]" ref={langDropdownRef}>
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 font-medium text-gray-700 transition-colors hover:text-blue-600 focus:outline-none"
          >
            {/* Globe Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.6 9h16.8M3.6 15h16.8"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.5 3a17 17 0 000 18M12.5 3a17 17 0 010 18"
              />
            </svg>

            {/* Selected Language */}
            <span>{selectedLang}</span>

            {/* Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                langOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* ================= LANGUAGE DROPDOWN ================= */}
          {langOpen && (
            <div className="absolute right-0 top-full z-[100] mt-2 w-36 overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-xl">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setSelectedLang(lang.name);
                    setLangOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    lang.name === selectedLang
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= NOTIFICATION ================= */}
        <Link
          to={user ? "/notifications" : "/login"}
          className="relative p-1 text-gray-600 transition-colors hover:text-blue-600"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {user && unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        {/* ================= AUTH ================= */}
        {user ? (
          <div ref={profileDropdownRef} className="relative">
            {/* ================= PROFILE AVATAR (first letter) ================= */}
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="focus:outline-none"
              aria-label="Profile menu"
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={user.name || "User"}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 transition-colors hover:border-blue-600"
                />
              ) : (
                <span className="w-10 h-10 rounded-full bg-blue-600 text-white text-base font-semibold flex items-center justify-center transition-colors hover:bg-blue-700">
                  {initial}
                </span>
              )}
            </button>

            {/* ================= PROFILE DROPDOWN ================= */}
            {profileOpen && (
              <div className="absolute right-0 top-full z-[100] mt-2 w-52 overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-xl">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user.name || "User"}
                  </p>
                  <p className="truncate text-xs text-gray-500">{user.email}</p>
                </div>

                {dashboardPath && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate(dashboardPath);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/profile");
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
                >
                  <User className="h-4 w-4" /> Profile
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* ================= LOGIN ================= */}
            <Link
              to="/login"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              Login
            </Link>

            {/* ================= REGISTER ================= */}
            <Link
              to="/register"
              className="rounded-full bg-blue-600 px-6 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

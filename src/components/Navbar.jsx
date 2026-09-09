import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

function Navbar() {
  const [selectedLang, setSelectedLang] = useState("English");
  const [langOpen, setLangOpen] = useState(false);
  const langDropdownRef = useRef(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/job" },
    { name: "Scholarships", path: "/scholarships" },
    { name: "Events", path: "/events" },
    { name: "Companies", path: "/companies" },
    { name: "Universities", path: "/universities" },
    { name: "About Us", path: "/about" },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "km", name: "Khmer" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm border-b border-gray-100">
      <h1 className="text-2xl text-blue-600 font-bold">Job Website</h1>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `relative py-2 text-base font-medium transition-colors ${
                isActive
                  ? "text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full"
                  : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-6">
        {/* Language Selector Dropdown */}
        <div className="relative" ref={langDropdownRef}>
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 text-gray-700 hover:text-blue-600 font-medium focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-600"
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
            <span>{selectedLang}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 text-gray-500 transition-transform ${
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

          {/* Language Dropdown List */}
          {langOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setSelectedLang(lang.name);
                    setLangOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 hover:text-blue-600 ${
                    lang.name === selectedLang
                      ? "font-semibold text-blue-600 bg-blue-50/50"
                      : "text-gray-700"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button
          className="text-gray-600 hover:text-blue-600 p-1"
          aria-label="Notifications"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* Login Link */}
        <Link
          to="/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          Login
        </Link>

        {/* Register Button */}
        <Link
          to="/register"
          className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
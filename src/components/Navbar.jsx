import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

function Navbar() {
  const [selectedLang, setSelectedLang] = useState("English");
  const [langOpen, setLangOpen] = useState(false);

  const langDropdownRef = useRef(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/job" },
    { name: "Events", path: "/events" },
    { name: "About Us", path: "/about" },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "km", name: "Khmer" },
  ];

  // Close language dropdown when clicking outside
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <button
          type="button"
          className="p-1 text-gray-600 transition-colors hover:text-blue-600"
          aria-label="Notifications"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
      </div>
    </nav>
  );
}

export default Navbar;

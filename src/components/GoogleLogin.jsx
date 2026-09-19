import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '@/service/authApi';
import { GOOGLE_CLIENT_ID } from '@/config/google';

const getRedirectPath = (user) => {
  if (user?.roleId === 1) return "/dashboard";
  if (user?.roleId === 2) return "/company-dashboard";
  return "/";
};

const loadGsiScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector("script[data-gsi]");
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.gsi = "true";
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.head.appendChild(script);
  });

export default function GoogleLogin({ roleId, onError }) {
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  useEffect(() => {
    let active = true;

    const handleCredentialResponse = async (response) => {
      try {
        const user = await googleLogin({ idToken: response.credential, roleId });
        localStorage.setItem("user", JSON.stringify(user));
        if (active) navigate(getRedirectPath(user));
      } catch (err) {
        onError?.(err.response?.data?.message || "Google sign-in failed. Please try again.");
      }
    };

    const initGoogle = () => {
      if (!active || !window.google?.accounts?.id || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        ux_mode: "popup",
      });
      buttonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: buttonRef.current.clientWidth || 240,
      });
    };

    loadGsiScript()
      .then(initGoogle)
      .catch(() => onError?.("Could not load Google sign-in."));

    return () => {
      active = false;
      window.google?.accounts?.id?.cancel();
      if (buttonRef.current) buttonRef.current.innerHTML = "";
    };
  }, [roleId, navigate, onError]);

  return (
    <div className="w-full flex items-center justify-center">
      <div ref={buttonRef} className="w-full" />
    </div>
  );
}
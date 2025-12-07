"use client";

import { useState, useEffect } from "react";
import { parseJwt, JWTPayload } from "@/lib/jwt";

export function useAuth() {
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = () => {
      const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
      if (match) return match[2];
      return null;
    };

    const token = getToken();
    if (token) {
      const decoded = parseJwt(token);
      setUser(decoded);
    }
    setLoading(false);
  }, []);

  return { user, loading, isAdmin: user?.role === "admin" };
}

// src/shared/hooks/useScrollLock.js
import { useEffect } from "react";

export const useScrollLock = (isLocked) => {
  useEffect(() => {
    document.body.style.overflow = isLocked ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLocked]);
};

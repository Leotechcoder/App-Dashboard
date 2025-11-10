import { useState, useRef, useEffect } from "react";

export function useScrollTo({ top = 30, offset = 0 } = {}) {
  const [scrollTo, setScrollTo] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => {
    if (!scrollTo) return;

    if (tableRef.current) {
      const elementTop = tableRef.current.getBoundingClientRect().top + window.scrollY;
      const scrollPosition = elementTop - offset;

      window.scrollTo({ top: scrollPosition, behavior: "smooth" });
    } else {
      window.scrollTo({ top, behavior: "smooth" });
    }

    setScrollTo(false);
  }, [scrollTo, top, offset]);

  return { scrollTo, setScrollTo, tableRef };
}

import { useLayoutEffect } from "react";

// Your three CSS files style global tags (body, form, button...) and would clash
// if loaded together. This injects a page's CSS while that page is mounted and
// removes it on leave, so each page looks exactly like before.
export default function useStyle(cssText) {
  useLayoutEffect(() => {
    const el = document.createElement("style");
    el.textContent = cssText;
    document.head.appendChild(el);
    return () => el.remove();
  }, [cssText]);
}

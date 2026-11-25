import { useState } from "react";
import { useLocation } from "react-router-dom";
import HelpDrawer from "./HelpDrawer";

export default function HelpLauncher() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname.startsWith("/product/")) return null;

  return (
    <>
      <button type="button" className="help-launcher" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <span aria-hidden="true">💬</span> Help
      </button>
      <HelpDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
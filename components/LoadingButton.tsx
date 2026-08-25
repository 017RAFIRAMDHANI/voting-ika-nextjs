"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export default function LoadingButton({
  busy,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { busy: boolean; children: ReactNode }) {
  return (
    <button {...props} disabled={busy || props.disabled}>
      {busy && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
      {children}
    </button>
  );
}

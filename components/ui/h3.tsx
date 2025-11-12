import { ReactNode } from "react";

export function TypographyH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="scroll-m-20 mb-4 text-xl font-semibold tracking-tight">
      {children}
    </h3>
  );
}

import { useHref, useNavigate } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { ReactNode } from "react";

export function Provider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      {children}
    </HeroUIProvider>
  );
}

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const WindowContext = createContext<{
  windowWidth: number;
} | null>(null);

export function WindowContextProvider({ children }: { children: ReactNode }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      // cleanup
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <WindowContext.Provider value={{ windowWidth }}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindowContext() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error(
      "useWindowContext must be used within a WindowContextProvider",
    );
  }
  return context;
}

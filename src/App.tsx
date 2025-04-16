import "./App.css";
import { useEffect, useState } from "react";
import { useDarkMode } from "usehooks-ts";
import { darkTheme, defaultTheme } from "./Styles/theme";
import { ThemeProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./Page/Dashboard";
import { DashboardMenuType } from "./model/menu";
import { Header } from "./components/layouts/Header";
import { GlobalStyled } from "./components/layouts/Frames/FrameLayouts";
import { SignIn } from "./Page/Sign";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./context/UserContext";
import { WindowContextProvider } from "./context/WindowContext";
import { Chat } from "./components/Chat/Chat";

const QUERY_CLIENT = new QueryClient();

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] =
    useState<DashboardMenuType>("employeeList");
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    setDarkMode(isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : defaultTheme}>
      <QueryClientProvider client={QUERY_CLIENT}>
        <WindowContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <Header activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
              <Routes>
                <Route
                  path="/"
                  element={<Dashboard activeMenu={activeMenu} />}
                />
                <Route path="/login" element={<SignIn />} />
                <Route path="/write/:type" element={<></>} />
              </Routes>
              <Chat />
            </BrowserRouter>
            <GlobalStyled />
            <Toaster />
          </UserContextProvider>
        </WindowContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

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
import { SignIn } from "./Page/Sign";
import { Toaster } from "react-hot-toast";
import { EmployeeContextProvider } from "./context/EmployeeContext";
import { WindowContextProvider } from "./context/WindowContext";
import { Chat } from "./components/Chat/Chat";
import { GlobalStyled } from "./components/layouts/Frames";
import { Provider } from "./provider";
import { Calculator, CalculatorButton } from "./components/Calculator";
import { DraggableNode } from "./components/Draggable";

const QUERY_CLIENT = new QueryClient();

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<DashboardMenuType>("userManage");
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    setDarkMode(isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : defaultTheme}>
      <QueryClientProvider client={QUERY_CLIENT}>
        <WindowContextProvider>
          <BrowserRouter>
            <EmployeeContextProvider>
              <Provider>
                <Header activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                <Routes>
                  <Route
                    path="/"
                    element={<Dashboard activeMenu={activeMenu} />}
                  />
                  <Route path="/login" element={<SignIn />} />
                </Routes>
              </Provider>
              <Chat />
              <CalculatorButton setOpen={setOpen}></CalculatorButton>
              <GlobalStyled />
              <Toaster />
              <footer style={{ height: "20px" }}></footer>
              {open && (
                <DraggableNode children={<Calculator />}></DraggableNode>
              )}
            </EmployeeContextProvider>
          </BrowserRouter>
        </WindowContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

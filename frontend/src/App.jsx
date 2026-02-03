import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Landing from "./Landing";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <>
      <Navbar theme={theme} setTheme={setTheme} />
      <Landing />
    </>
  );
}

export default App;

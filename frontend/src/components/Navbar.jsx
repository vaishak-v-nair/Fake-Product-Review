import ThemeToggle from "./ThemeToggle";

export default function Navbar({ theme, setTheme }) {
  return (
    <div className="navbar">
      <div className="nav-inner">
        <div className="brand">VeriTrust</div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#how">How</a>
          <a href="#demo">Demo</a>
        </div>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
}

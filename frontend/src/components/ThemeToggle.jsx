export default function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className="btn btn-ghost"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}

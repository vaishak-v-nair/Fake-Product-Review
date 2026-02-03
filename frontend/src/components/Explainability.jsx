export default function Explainability({ signals }) {
  if (!signals || signals.length === 0) return null;

  return (
    <div className="explain">
      <h4>Why this result?</h4>
      <ul>
        {signals.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
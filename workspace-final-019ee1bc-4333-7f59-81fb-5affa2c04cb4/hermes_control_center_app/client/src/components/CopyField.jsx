export default function CopyField({ label, value }) {
  async function copyValue() {
    await navigator.clipboard.writeText(value);
    alert(`${label} kopiert.`);
  }

  return (
    <div className="copyField">
      <label>{label}</label>
      <div className="copyRow">
        <code>{value}</code>
        <button onClick={copyValue}>Kopieren</button>
      </div>
    </div>
  );
}

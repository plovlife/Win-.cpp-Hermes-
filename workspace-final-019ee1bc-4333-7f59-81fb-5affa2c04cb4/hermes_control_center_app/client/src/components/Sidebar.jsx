export default function Sidebar({ page, setPage }) {
  const entries = [
    ['dashboard', 'Dashboard'],
    ['llama', 'llama.cpp'],
    ['chat', 'Chat-Test'],
    ['integrations', 'Integrationen'],
    ['profiles', 'Profile'],
    ['settings', 'Einstellungen']
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <h1>Hermes Control Center</h1>
        <p>Desktop-Grundgeruest</p>
      </div>
      <nav className="nav">
        {entries.map(([id, label]) => (
          <button
            key={id}
            className={page === id ? 'navButton active' : 'navButton'}
            onClick={() => setPage(id)}
          >
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

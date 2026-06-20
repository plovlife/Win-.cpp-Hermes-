export default function Section({ title, children, actions = null }) {
  return (
    <section className="section">
      <div className="sectionHeader">
        <div>
          <h2>{title}</h2>
        </div>
        {actions ? <div className="sectionActions">{actions}</div> : null}
      </div>
      <div className="sectionBody">{children}</div>
    </section>
  );
}

import { useState } from 'react';
import Section from '../components/Section';

export default function ProfilesPage({ profiles, config, onCreateProfile, onLoadProfile, onDeleteProfile, refreshProfiles }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  async function saveCurrentAsProfile() {
    if (!name.trim()) {
      alert('Bitte zuerst einen Profilnamen eingeben.');
      return;
    }

    await onCreateProfile({
      name,
      description,
      llamacpp: config.llamacpp,
      hermes: config.hermes
    });

    setName('');
    setDescription('');
    await refreshProfiles();
    alert('Profil gespeichert.');
  }

  return (
    <>
      <Section title="Aktuelle Konfiguration als Profil speichern">
        <div className="formGrid twoCols">
          <label>
            Profilname
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Kurzbeschreibung
            <input value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
        </div>
        <div className="buttonRow" style={{ marginTop: 12 }}>
          <button className="primaryButton" onClick={saveCurrentAsProfile}>Profil speichern</button>
        </div>
      </Section>

      <Section title="Gespeicherte Profile">
        <div className="listStack">
          {profiles.map((profile) => (
            <div className="card subtle" key={profile.id}>
              <h3>{profile.name}</h3>
              <p>{profile.description || 'Keine Beschreibung.'}</p>
              <p><strong>Modell:</strong> {profile?.llamacpp?.modelPath}</p>
              <p><strong>Kontext:</strong> {profile?.llamacpp?.context}</p>
              <div className="buttonRow">
                <button onClick={() => onLoadProfile(profile.id)}>Als aktiv laden</button>
                <button className="dangerButton" onClick={() => onDeleteProfile(profile.id)}>Löschen</button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

// src/roles/ManagerPage.tsx
export default function ManagerPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Espace Manager</h2>

      <p>
        <a href="/manager/staff">👥 Gérer le personnel (staff_rules)</a>
      </p>

      <p>
        <a href="/manager/select-station">🖥️ Accéder à une station POS</a>
      </p>
    </div>
  );
}

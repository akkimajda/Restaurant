import { useNavigate } from "react-router-dom";
import { clearActiveRole } from "../../lib/session";

export default function LogoutButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => { clearActiveRole(); navigate("/"); }}
      className="rounded-xl border px-3 py-2 text-sm"
      title="Logout"
    >
      Logout
    </button>
  );
}

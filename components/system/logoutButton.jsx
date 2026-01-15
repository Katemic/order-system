import { logoutAction } from "@/actions/auth/logoutAction";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="rounded border px-3 py-2">
        Log ud
      </button>
    </form>
  );
}
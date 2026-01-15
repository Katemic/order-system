import { loginAction } from "@/actions/auth/loginAction";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="text-xl font-semibold">Log ind</h1>

      <form action={loginAction} className="mt-4 space-y-3">
        <input name="userName" type="text" placeholder="Brugernavn" required className="w-full rounded border p-2" />
        <input name="password" type="password" placeholder="Password" required className="w-full rounded border p-2" />
        <button className="w-full rounded bg-black px-4 py-2 text-white">Log ind</button>
      </form>
    </main>
  );
}

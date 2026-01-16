"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth/loginAction";

const initialState = {
  success: false,
  error: null, 
  fieldErrors: {}, 
  values: { userName: "" },
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-neutral-900">Log ind</h1>

        {state?.error && (
          <p className="mt-3 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <form action={formAction} className="mt-4 space-y-3">
          <div className="space-y-1">
            <input
              name="userName"
              type="text"
              placeholder="Brugernavn"
              defaultValue={state?.values?.userName ?? ""}
              className={`w-full rounded border p-2 outline-none transition ${
                state?.fieldErrors?.userName
                  ? "border-red-500 focus:border-red-500"
                  : "border-neutral-300 focus:border-neutral-900"
              }`}
              aria-invalid={Boolean(state?.fieldErrors?.userName)}
            />
            {state?.fieldErrors?.userName && (
              <p className="text-sm text-red-600">
                {state.fieldErrors.userName}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className={`w-full rounded border p-2 outline-none transition ${
                state?.fieldErrors?.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-neutral-300 focus:border-neutral-900"
              }`}
              aria-invalid={Boolean(state?.fieldErrors?.password)}
            />
            {state?.fieldErrors?.password && (
              <p className="text-sm text-red-600">
                {state.fieldErrors.password}
              </p>
            )}
          </div>

          <button
            disabled={isPending}
            className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-60 hover:bg-neutral-800"
          >
            {isPending ? "Logger ind..." : "Log ind"}
          </button>
        </form>
      </div>
    </main>
  );
}



"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomizationForm({
    mode = "create",
    initialTitle = "",
    initialOptions = [],
    action
}) {
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(action, {
        fieldErrors: {},
        values: { title: initialTitle, options: initialOptions }
    });

    const errors = state.fieldErrors || {};
    const values = state.values || {};

    const [optionInput, setOptionInput] = useState("");
    const [options, setOptions] = useState(values.options || initialOptions);

    function addOption() {
        const v = optionInput.trim();
        if (!v) return;
        setOptions(prev => [...prev, v]);
        setOptionInput("");
    }

    function removeOption(i) {
        setOptions(prev => prev.filter((_, idx) => idx !== i));
    }

    return (
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    {mode === "create" ? "Opret tilpasning" : "Rediger tilpasning"}
                </h1>

                <button
                    type="button"
                    onClick={() => router.push("/customizations")}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    Tilbage til tilpasninger
                </button>
            </div>

            {/* FORM */}
            <form action={formAction} className="space-y-6">

                {/* TITLE */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titel <span className="text-red-500">*</span>
                    </label>

                    <input
                        type="text"
                        name="title"
                        defaultValue={values.title}
                        className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.title ? "border-red-500" : "border-gray-300"}`}
                    />

                    {errors.title && (
                        <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                    )}
                </div>

                {/* OPTIONS INPUT */}
                <div className="border-t border-gray-200 pt-4">
                    <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Muligheder
                    </h2>
                    <p className="text-xs text-gray-500 mb-3">
                        Tilføj mindst én mulighed. &quot;Andet, se note&quot; tilføjes automatisk ved oprettelse.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={optionInput}
                            onChange={e => setOptionInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addOption();
                                }
                            }}
                            placeholder="Skriv en mulighed…"
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />

                        <button
                            type="button"
                            onClick={addOption}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-sm
               sm:w-auto w-full"
                        >
                            Tilføj
                        </button>
                    </div>

                    {errors.options && (
                        <p className="mt-1 text-xs text-red-500">{errors.options}</p>
                    )}
                </div>

                {/* OPTION LIST */}
                {options.length > 0 && (
                    <div className="space-y-2">
                        {options.map((opt, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between items-center p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                            >
                                <input type="hidden" name="options[]" value={opt} />
                                <span>{opt}</span>

                                <button
                                    type="button"
                                    onClick={() => removeOption(idx)}
                                    className="text-red-600 hover:text-red-800 text-lg leading-none px-2"
                                    aria-label="Slet mulighed"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* BUTTONS */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                {!isPending && Object.keys(errors).length > 0 && (
                    <p className="text-red-600 text-sm font-medium mr-auto">
                    Udfyld venligst alle krævede felter.
                    </p>
                )}

                <button
                    type="button"
                    disabled={isPending}
                    onClick={() => router.push("/customizations")}
                    className={`
                    px-4 py-2 rounded-lg border text-sm transition
                    ${
                        isPending
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 hover:bg-gray-50"
                    }
                    `}
                >
                    Annuller
                </button>

                <button
                    type="submit"
                    disabled={isPending}
                    className={`
                    px-5 py-2.5 rounded-lg text-sm text-white font-medium transition
                    ${
                        isPending
                        ? "bg-emerald-400 cursor-wait"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }
                    `}
                >
                    {isPending
                    ? mode === "create"
                        ? "Opretter..."
                        : "Gemmer..."
                    : mode === "create"
                    ? "Opret"
                    : "Gem ændringer"}
                </button>
                </div>

                {errors.general && (
                    <p className="text-red-600 text-center mt-4 text-sm">
                        {errors.general}
                    </p>
                )}
            </form>
        </div>
    );
}



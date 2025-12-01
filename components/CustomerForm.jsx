export default function CustomerForm({
    form,
    onChange,
    onCheckboxChange,
    onFulfillmentChange,
    isPickup,
    isDelivery,
    state,
    isPending,
    formAction,
    orderItems,
    hasItems,
}) {
    return (
        <section className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Kundeoplysninger</h2>

            {state?.message && (
                <p
                    className={`mb-4 text-sm ${state.success ? "text-emerald-700" : "text-red-600"
                        }`}
                >
                    {state.message}
                </p>
            )}

            <form className="space-y-4" action={formAction}>
                <input
                    type="hidden"
                    name="orderItems"
                    value={JSON.stringify(orderItems)}
                />
                <input
                    type="hidden"
                    name="fulfillmentType"
                    value={form.fulfillmentType}
                />

                <div>
                    <label className="text-sm font-medium" htmlFor="orderDate">
                        Dato<span className="text-red-500">*</span>
                    </label>
                    <input
                        id="orderDate"
                        type="date"
                        name="orderDate"
                        value={form.orderDate}
                        onChange={onChange}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {state?.errors?.orderDate && (
                        <p className="text-sm text-red-600">{state.errors.orderDate}</p>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium" htmlFor="customerName">
                        Navn på kunde<span className="text-red-500">*</span>
                    </label>
                    <input
                        id="customerName"
                        type="text"
                        name="customerName"
                        value={form.customerName}
                        onChange={onChange}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {state?.errors?.customerName && (
                        <p className="text-sm text-red-600">{state.errors.customerName}</p>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium" htmlFor="phone">
                            Telefonnr
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={onChange}
                            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium" htmlFor="agreedPrice">
                            Aftalt pris
                        </label>
                        <input
                            id="agreedPrice"
                            type="number"
                            step="0.01"
                            name="agreedPrice"
                            value={form.agreedPrice}
                            onChange={onChange}
                            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[2fr_1fr] items-center">
                    <div>
                        <label className="text-sm font-medium" htmlFor="orderedBy">
                            Bestilt af<span className="text-red-500">*</span>
                        </label>
                        <input
                            id="orderedBy"
                            type="text"
                            name="orderedBy"
                            value={form.orderedBy}
                            onChange={onChange}
                            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        {state?.errors?.orderedBy && (
                            <p className="text-sm text-red-600">{state.errors.orderedBy}</p>
                        )}
                    </div>

                    <label className="inline-flex items-center gap-2 text-sm mt-2">
                        <input
                            type="checkbox"
                            name="paid"
                            checked={form.paid}
                            onChange={onCheckboxChange}
                            className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Betalt</span>
                    </label>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Leveringsform</span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => onFulfillmentChange("pickup")}
                            className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium
                ${isPickup
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                    : "bg-neutral-100 border-neutral-200 text-neutral-500"
                                }`}
                        >
                            {isPickup ? "✔ " : ""}Afhentning
                        </button>

                        <button
                            type="button"
                            onClick={() => onFulfillmentChange("delivery")}
                            className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium
                ${isDelivery
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                    : "bg-neutral-100 border-neutral-200 text-neutral-500"
                                }`}
                        >
                            {isDelivery ? "✔ " : ""}Levering
                        </button>
                    </div>
                </div>

                {isPickup && (
                    <div>
                        <label className="text-sm font-medium" htmlFor="pickupTime">
                            Afhentningstidspunkt<span className="text-red-500">*</span>
                        </label>
                        <input
                            id="pickupTime"
                            type="text"
                            name="pickupTime"
                            value={form.pickupTime}
                            onChange={onChange}
                            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        {state?.errors?.pickupTime && (
                            <p className="text-sm text-red-600">
                                {state.errors.pickupTime}
                            </p>
                        )}
                    </div>
                )}

                {isDelivery && (
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium" htmlFor="address">
                                Adresse<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="address"
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={onChange}
                                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            {state?.errors?.address && (
                                <p className="text-sm text-red-600">
                                    {state.errors.address}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium" htmlFor="zip">
                                Postnr<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="zip"
                                type="text"
                                name="zip"
                                value={form.zip}
                                onChange={onChange}
                                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            {state?.errors?.zip && (
                                <p className="text-sm text-red-600">{state.errors.zip}</p>
                            )}
                        </div>

                        <div>
                            <label
                                className="text-sm font-medium"
                                htmlFor="deliveryTime"
                            >
                                Leveringstidspunkt<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="deliveryTime"
                                type="text"
                                name="deliveryTime"
                                value={form.deliveryTime}
                                onChange={onChange}
                                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            {state?.errors?.deliveryTime && (
                                <p className="text-sm text-red-600">
                                    {state.errors.deliveryTime}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div>
                    <label className="text-sm font-medium" htmlFor="orderNote">
                        Note til bestillingen
                    </label>
                    <textarea
                        id="orderNote"
                        name="orderNote"
                        value={form.orderNote}
                        onChange={onChange}
                        rows={3}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isPending || !hasItems}
                    >
                        {isPending ? "Gemmer bestilling..." : "Gennemfør bestilling"}
                    </button>
                </div>
            </form>
        </section>
    );
}

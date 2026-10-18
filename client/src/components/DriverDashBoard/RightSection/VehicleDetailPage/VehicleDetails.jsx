const inputCls =
  "w-full rounded-lg bg-[#0f1a17] border border-gray-700 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60";

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="mb-1 block text-sm text-gray-400">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
  </label>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-gray-400">{label}</span>
    <span className="font-semibold text-white">{value}</span>
  </div>
);

export default function VehicleDetails() {
  const onSubmitHandler = (e)=>{
    e.preventDefault();

  }
  return (
    <div className="mx-auto max-w-4xl space-y-8 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vehicle Details</h1>
        <span className="rounded-full bg-emerald-900/50 px-3 py-1 text-sm text-emerald-400">
          Verified
        </span>
      </div>

      {/* Current vehicle summary */}
      <section className="rounded-xl border border-gray-700 bg-[#0f1a17] p-5">
        <h2 className="mb-2 text-lg font-semibold">Current vehicle</h2>
        <div className="divide-y divide-gray-700">
          <InfoRow label="Make" value="Maruti Suzuki" />
          <InfoRow label="Model" value="Baleno" />
          <InfoRow label="Vehicle number" value="GD32HJ2342" />
          <InfoRow label="Color" value="White" />
          <InfoRow label="Vehicle type" value="Car" />
        </div>
      </section>

      {/* Safe to edit directly */}
      <form className="space-y-4 rounded-xl border border-gray-700 p-5">
        <h2 className="text-lg font-semibold">Quick edit</h2>
        <Field label="Color" hint="Riders use this to spot your vehicle.">
          <input placeholder="e.g. White" className={inputCls} />
        </Field>
        <button type="submit" className="rounded-lg bg-emerald-600 px-6 py-2 font-semibold">
          Save
        </button>
      </form>

      {/* Needs re-verification */}
      <form onSubmit={onSubmitHandler} className="space-y-4 rounded-xl border border-amber-700 bg-[#1a1710] p-5">
        <div>
          <h2 className="text-lg font-semibold">Change vehicle</h2>
          <p className="mt-1 text-sm text-amber-300">
            Changing these details needs re-verification. You will not receive rides
            until the new details are approved.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Make">
            <input placeholder="e.g. Maruti Suzuki" className={inputCls} />
          </Field>
          <Field label="Model">
            <input placeholder="e.g. Baleno" className={inputCls} />
          </Field>
          <Field label="Vehicle number">
            <input placeholder="e.g. HR12AB1234" className={`${inputCls} uppercase`} />
          </Field>
          <Field label="Vehicle type">
            <select className={inputCls}>
              <option>Car</option>
              <option>Bike</option>
              <option>Auto</option>
            </select>
          </Field>
        </div>

        <Field label="RC (registration certificate)" hint="JPG, PNG or PDF, max 5 MB.">
          <input
            type="file"
            accept="image/*,.pdf"
            className="block w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-white"
          />
        </Field>

        <button type="submit" className="rounded-lg cursor-pointer bg-amber-600 px-6 py-2 font-semibold">
          Submit for verification
        </button>
      </form>
    </div>
  );
}
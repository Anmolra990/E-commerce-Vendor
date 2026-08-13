const fields = [
  { name: "fullName", label: "Full name", placeholder: "Name of the recipient", required: true },
  { name: "phone", label: "Mobile number", placeholder: "10-digit mobile number", required: true, inputMode: "numeric", maxLength: 10 },
  { name: "addressLine1", label: "House / flat no., building, street", placeholder: "Flat no., building name, street", required: true },
  { name: "addressLine2", label: "Area / locality", placeholder: "Area, colony or village" },
  { name: "landmark", label: "Landmark (optional)", placeholder: "Near school, hospital, etc." },
  { name: "district", label: "City / district", placeholder: "Enter city or district", required: true },
  { name: "state", label: "State", placeholder: "Enter state", required: true },
  { name: "pincode", label: "PIN code", placeholder: "6-digit PIN code", required: true, inputMode: "numeric", maxLength: 6 },
];

function DeliveryAddressForm({ address, onChange, compact = false }) {
  const inputClass = "mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className={`grid grid-cols-1 ${compact ? "" : "sm:grid-cols-2"} gap-4`}>
      {fields.map((field) => (
        <label
          key={field.name}
          className={field.name === "addressLine1" || field.name === "addressLine2" || field.name === "landmark" ? "sm:col-span-2" : ""}
        >
          <span className="text-sm font-medium text-slate-700">
            {field.label}{field.required && <span className="text-rose-600"> *</span>}
          </span>
          <input
            type="text"
            name={field.name}
            value={address[field.name]}
            onChange={onChange}
            placeholder={field.placeholder}
            required={field.required}
            inputMode={field.inputMode}
            maxLength={field.maxLength}
            className={inputClass}
          />
        </label>
      ))}
    </div>
  );
}

export default DeliveryAddressForm;

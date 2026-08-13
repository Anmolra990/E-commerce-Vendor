import { useEffect, useState } from "react";
import API from "../api/axios";
import DeliveryAddressForm from "./DeliveryAddressForm";
import { EMPTY_DELIVERY_ADDRESS, formatDeliveryAddress } from "../utils/deliveryAddress";

function SavedAddressBook({ selectedAddressId, onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formAddress, setFormAddress] = useState(EMPTY_DELIVERY_ADDRESS);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const selectedAddress = addresses.find((address) => address._id === selectedAddressId);

  const loadAddresses = async () => {
    try {
      const response = await API.get("/auth/profile");
      const savedAddresses = response.data.data.addresses || [];
      setAddresses(savedAddresses);
      if (!selectedAddressId && savedAddresses.length) onSelect(savedAddresses.find((address) => address.isDefault) || savedAddresses[0]);
    } catch (error) { setMessage(error.response?.data?.message || "Could not load saved addresses."); }
  };

  useEffect(() => { loadAddresses(); }, []);

  const openForm = (address = null) => {
    setEditingId(address?._id || null);
    setFormAddress(address ? { ...address } : { ...EMPTY_DELIVERY_ADDRESS, isDefault: !addresses.length });
    setShowForm(true); setMessage("");
  };

  const saveAddress = async (event) => {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      const response = editingId ? await API.put(`/auth/addresses/${editingId}`, formAddress) : await API.post("/auth/addresses", formAddress);
      const savedAddresses = response.data.data;
      setAddresses(savedAddresses);
      const selected = savedAddresses.find((address) => address._id === (editingId || savedAddresses.at(-1)?._id));
      onSelect(selected || savedAddresses.find((address) => address.isDefault) || null);
      setShowForm(false);
    } catch (error) { setMessage(error.response?.data?.message || "Could not save the address."); }
    finally { setSaving(false); }
  };

  const deleteAddress = async (addressId) => {
    if (!window.confirm("Delete this saved address?")) return;
    try {
      const response = await API.delete(`/auth/addresses/${addressId}`);
      const savedAddresses = response.data.data;
      setAddresses(savedAddresses);
      if (addressId === selectedAddressId) onSelect(savedAddresses.find((address) => address.isDefault) || savedAddresses[0] || null);
    } catch (error) { setMessage(error.response?.data?.message || "Could not delete the address."); }
  };

  return <>
    <section className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">Deliver to: {selectedAddress ? selectedAddress.fullName : "Choose an address"}</p>
          <p className="mt-1 truncate text-sm text-slate-600">{selectedAddress ? [selectedAddress.addressLine1, selectedAddress.addressLine2, selectedAddress.district, selectedAddress.state, selectedAddress.pincode].filter(Boolean).join(", ") : "Add a delivery address to continue."}</p>
        </div>
        <button type="button" onClick={() => { setDrawerOpen(true); setShowForm(false); }} className="shrink-0 rounded-lg border border-blue-200 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50">Change</button>
      </div>
    </section>

    {drawerOpen && <div className="fixed inset-0 z-[100] bg-slate-900/40" onClick={() => setDrawerOpen(false)}>
      <aside className="ml-auto flex h-full w-full max-w-xl flex-col bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-5"><div><h2 className="text-xl font-bold">Delivery addresses</h2><p className="text-sm text-slate-500">Choose, edit, or add an address.</p></div><button onClick={() => setDrawerOpen(false)} className="rounded-lg p-2 text-2xl leading-none hover:bg-slate-100">×</button></div>
        <div className="grow overflow-y-auto p-5">
          {!showForm && <><button onClick={() => openForm()} className="w-full rounded-xl border-2 border-dashed border-blue-300 p-3 text-sm font-bold text-blue-600 hover:bg-blue-50">+ Add a new address</button><div className="mt-4 space-y-3">{addresses.map((address) => <div key={address._id} className={`rounded-xl border p-4 ${address._id === selectedAddressId ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}><label className="flex cursor-pointer gap-3"><input type="radio" checked={address._id === selectedAddressId} onChange={() => { onSelect(address); setDrawerOpen(false); }} className="mt-1"/><span className="grow whitespace-pre-line text-sm text-slate-700"><strong>{address.fullName}</strong>{address.isDefault && <em className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs not-italic text-blue-700">Default</em>}<br />{formatDeliveryAddress(address)}</span></label><div className="ml-7 mt-3 flex gap-4"><button onClick={() => openForm(address)} className="text-sm font-bold text-blue-600">Edit</button><button onClick={() => deleteAddress(address._id)} className="text-sm font-bold text-rose-600">Delete</button></div></div>)}</div></>}
          {showForm && <form onSubmit={saveAddress}><div className="mb-4 flex items-center justify-between"><h3 className="font-bold">{editingId ? "Edit address" : "Add new address"}</h3><button type="button" onClick={() => setShowForm(false)} className="text-sm font-semibold text-slate-600">Back to addresses</button></div><DeliveryAddressForm address={formAddress} onChange={(event) => setFormAddress({ ...formAddress, [event.target.name]: event.target.value })}/><label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(formAddress.isDefault)} onChange={(event) => setFormAddress({ ...formAddress, isDefault: event.target.checked })}/> Set as default</label>{message && <p className="mt-3 text-sm text-rose-600">{message}</p>}<button disabled={saving} className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-bold text-white disabled:bg-slate-400">{saving ? "Saving..." : "Save address"}</button></form>}
        </div>
      </aside>
    </div>}
  </>;
}

export default SavedAddressBook;

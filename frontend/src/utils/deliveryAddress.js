export const EMPTY_DELIVERY_ADDRESS = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  district: "",
  state: "",
  pincode: "",
};

export const getSavedDeliveryAddress = () => {
  const savedAddress = localStorage.getItem("deliveryAddress");
  if (!savedAddress) return EMPTY_DELIVERY_ADDRESS;

  try {
    return { ...EMPTY_DELIVERY_ADDRESS, ...JSON.parse(savedAddress) };
  } catch {
    // Keep delivery details entered with the previous single-field form.
    return { ...EMPTY_DELIVERY_ADDRESS, addressLine1: savedAddress };
  }
};

export const formatDeliveryAddress = (address) =>
  [
    address.fullName,
    address.phone && `Phone: ${address.phone}`,
    address.addressLine1,
    address.addressLine2,
    address.landmark && `Landmark: ${address.landmark}`,
    [address.district, address.state, address.pincode].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join("\n");

export const isDeliveryAddressComplete = (address) =>
  Boolean(
    address.fullName.trim() &&
      /^[6-9]\d{9}$/.test(address.phone.trim()) &&
      address.addressLine1.trim() &&
      address.district.trim() &&
      address.state.trim() &&
      /^\d{6}$/.test(address.pincode.trim())
  );

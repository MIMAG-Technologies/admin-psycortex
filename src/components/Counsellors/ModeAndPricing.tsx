import { useLoading } from "@/context/LoadingContext";
import { CommunicationModes, PricingItem } from "@/types/counsellors";
import { updateCommunicationModes, updatePricing } from "@/utils/counsellor";
import { Dispatch, SetStateAction } from "react";
import { IoChatbubble, IoCall, IoVideocam, IoPerson } from "react-icons/io5";
import { toast } from "react-toastify";
import { BranchesSelectionBar } from "../ui/BranchesSelectionBar";

export default function ModeAndPricing({
  communication_modes,
  pricing,
  updateCommunicationMode,
  updatePricingItem,
  preferredCenterAddress,
  setpreferredCenterAddress,
  UpdateBranchDetails,
  mode,
  id,
}: {
  communication_modes: CommunicationModes;
  pricing: PricingItem[];
  updateCommunicationMode: (
    mode: keyof CommunicationModes,
    value: boolean
  ) => void;
  updatePricingItem: (index: number, updates: Partial<PricingItem>) => void;
  preferredCenterAddress: {
    id: string;
    full_address: string;
    city: string;
  };
  setpreferredCenterAddress: Dispatch<
    SetStateAction<{
      id: string;
      full_address: string;
      city: string;
    }>
  >;
  UpdateBranchDetails: () => Promise<void>;
  mode: string;
  id?: string;
}) {
  // Handle mode toggle
  const handleModeToggle = (mode: keyof CommunicationModes) => {
    const newValue = !communication_modes[mode];
    updateCommunicationMode(mode, newValue);
  };
  const buildCommunicationModesString = (modes: CommunicationModes): string => {
    return Object.entries(modes)
      .filter(([_, enabled]) => enabled)
      .map(([mode]) => mode)
      .join(",");
  };

  // Map modes to their respective labels and icons
  const modeDetails = {
    chat: { label: "Chat", icon: <IoChatbubble size={20} /> },
    call: { label: "Call", icon: <IoCall size={20} /> },
    video: { label: "Video", icon: <IoVideocam size={20} /> },
    in_person: { label: "In-Person", icon: <IoPerson size={20} /> },
  };

  const { setLoading } = useLoading();
  const UpdateModesAndPricing = async () => {
    setLoading(true);

    if (!id) {
      toast.error("Counsellor ID not provided");
      setLoading(false);
      return;
    }

    const selectedModes =
      Object.values(communication_modes).filter(Boolean).length;
    if (
      selectedModes < 2 ||
      pricing.some((item) => item.price <= 0 || !item.sessionTitle.trim())
    ) {
      toast.error(
        "Select at least two communication modes and ensure their pricing details are complete."
      );
      setLoading(false);
      return;
    }

    const res = await updateCommunicationModes(
      id,
      buildCommunicationModesString(communication_modes)
    );
    const res1 = await updatePricing(id, pricing);
    if (res && res1) {
      toast.success("Communication modes updated successfully");
      if (communication_modes.in_person && preferredCenterAddress.id) {
        await UpdateBranchDetails();
      }
    } else {
      toast.error("Failed to update communication modes");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg">
      {/* Communication Modes Toggle Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {/* Mode Buttons */}
        {Object.entries(modeDetails).map(([mode, { label, icon }]) => (
          <button
            key={mode}
            onClick={() => handleModeToggle(mode as keyof CommunicationModes)}
            className={`flex flex-col items-center p-4 rounded-lg shadow-md transition ${
              communication_modes[mode as keyof CommunicationModes]
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            } hover:shadow-lg`}
          >
            {icon}
            <span className="mt-2 text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Pricing Section */}
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Pricing</h3>
      {pricing.length === 0 ? (
        <p className="text-gray-500 text-sm">No communication mode selected.</p>
      ) : (
        <ul className="space-y-6">
          {pricing.map((priceItem, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              {/* Mode Label with Icon */}
              <div className="flex items-center mb-3">
                <span className="text-gray-800 font-medium flex items-center">
                  {
                    modeDetails[
                      priceItem.typeOfAvailability as keyof CommunicationModes
                    ]?.icon
                  }
                  <span className="ml-2">
                    {
                      modeDetails[
                        priceItem.typeOfAvailability as keyof CommunicationModes
                      ]?.label
                    }
                  </span>
                </span>
              </div>

              {/* Session Type */}
              <label className="block text-sm font-medium text-gray-600">
                Session Title
              </label>
              <input
                type="text"
                value={priceItem.sessionTitle}
                onChange={(e) =>
                  updatePricingItem(index, { sessionTitle: e.target.value })
                }
                className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 mb-3"
                placeholder="Enter session title"
              />

              {/* Pricing Fields */}
              <div className="grid grid-cols-2 gap-3">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                  Price (INR)
                  </label>
                  <input
                  type="text"
                  value={priceItem.price || 0}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    updatePricingItem(index, {
                    price: value === "" ? 0 : parseFloat(value),
                    });
                  }}
                  className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  placeholder="Enter price"
                  />
                </div>

                {/* Currency (Disabled) */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Currency
                  </label>
                  <select
                    value="INR"
                    disabled
                    className="block w-full px-3 py-2 border rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
                  >
                    <option value="INR">INR</option>
                  </select>
                </div>

                {priceItem.typeOfAvailability === "in_person" && (
                  <div className="mt-4 col-span-2">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Preferred Center Address
                    </h3>
                    <BranchesSelectionBar
                      value={preferredCenterAddress}
                      setValue={setpreferredCenterAddress}
                      isDisabled={false}
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {mode === "edit" && id && (
        <button
          onClick={UpdateModesAndPricing}
          className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary  w-full disabled:opacity-50"
        >
          Update
        </button>
      )}
    </div>
  );
}

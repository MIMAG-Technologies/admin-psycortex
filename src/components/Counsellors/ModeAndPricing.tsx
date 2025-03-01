import { CommunicationModes, PricingItem } from "@/types/counsellors";
import { IoChatbubble, IoCall, IoVideocam, IoPerson } from "react-icons/io5";

export default function ModeAndPricing({
  communication_modes,
  pricing,
  updateCommunicationMode,
  updatePricingItem,
}: {
  communication_modes: CommunicationModes;
  pricing: PricingItem[];
  updateCommunicationMode: (
    mode: keyof CommunicationModes,
    value: boolean
  ) => void;
  updatePricingItem: (index: number, updates: Partial<PricingItem>) => void;
}) {
  // Handle mode toggle
  const handleModeToggle = (mode: keyof CommunicationModes) => {
    const newValue = !communication_modes[mode];
    updateCommunicationMode(mode, newValue);
  };

  // Map modes to their respective labels and icons
  const modeDetails = {
    chat: { label: "Chat", icon: <IoChatbubble size={20} /> },
    call: { label: "Call", icon: <IoCall size={20} /> },
    video: { label: "Video", icon: <IoVideocam size={20} /> },
    in_person: { label: "In-Person", icon: <IoPerson size={20} /> },
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
                    type="number"
                    value={priceItem.price}
                    onChange={(e) =>
                      updatePricingItem(index, {
                        price: parseFloat(e.target.value),
                      })
                    }
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

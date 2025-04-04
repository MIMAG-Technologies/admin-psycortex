import { useCounsellor } from "@/context/CounsellorContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getFilters } from "@/utils/filters";

export default function BasicDetails() {
  const {
    counsellorDetails,
    updateCounsellorDetails,
    profileImage,
    setProfileImage,
    primaryAddress,
    updatePrimaryAddress,
    createUser,
    usermode,
    counsellorId,
  } = useCounsellor();

  type Filter = { id: number; name: string; priority: number };
  const [genders, setGenders] = useState<Filter[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setProfileImage(event.target.files[0]);
    }
  };

  const fetchFilters = async () => {
    const filters = await getFilters();
    setGenders(
      filters.genders?.sort(
        (a: Filter, b: Filter) => b.priority - a.priority
      ) || []
    );
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const handleUpdateBasicDetails = async () => {
    if (
      !counsellorDetails.name.trim() ||
      !counsellorDetails.email.trim() ||
      !counsellorDetails.phone.trim() ||
      !counsellorDetails.dateOfBirth.trim() ||
      !counsellorDetails.gender.trim() ||
      !counsellorDetails.biography.trim() ||
      !primaryAddress.street_address.trim() ||
      !primaryAddress.city.trim() ||
      !primaryAddress.state.trim() ||
      !primaryAddress.pincode.trim()
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    await createUser();
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg">
      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={counsellorDetails.name}
            onChange={(e) => updateCounsellorDetails("name", e.target.value)}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Enter name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={counsellorDetails.email}
            onChange={(e) => updateCounsellorDetails("email", e.target.value)}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Enter email"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            value={counsellorDetails.phone}
            onChange={(e) => updateCounsellorDetails("phone", e.target.value)}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Enter phone number"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            value={counsellorDetails.dateOfBirth}
            onChange={(e) =>
              updateCounsellorDetails("dateOfBirth", e.target.value)
            }
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            value={counsellorDetails.gender}
            onChange={(e) => updateCounsellorDetails("gender", e.target.value)}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          >
            <option value="" disabled>
              Select gender
            </option>
            {genders.map((g) => (
              <option key={g.id} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Image
          </label>
          <input
            accept="image/*"
            onChange={handleFileChange}
            type="file"
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
          />
        </div>

        {/* Biography */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Biography
          </label>
          <textarea
            value={counsellorDetails.biography}
            style={{ resize: "none" }}
            onChange={(e) =>
              updateCounsellorDetails("biography", e.target.value)
            }
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Write a short biography"
            rows={3}
          />
        </div>
      </div>

      {/* Primary Address */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700">Primary Address</h3>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Street Address
            </label>
            <input
              type="text"
              value={primaryAddress.street_address}
              onChange={(e) =>
                updatePrimaryAddress("street_address", e.target.value)
              }
              className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              City
            </label>
            <input
              type="text"
              value={primaryAddress.city}
              onChange={(e) => updatePrimaryAddress("city", e.target.value)}
              className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              State
            </label>
            <input
              type="text"
              value={primaryAddress.state}
              onChange={(e) => updatePrimaryAddress("state", e.target.value)}
              className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Pincode
            </label>
            <input
              type="text"
              value={primaryAddress.pincode}
              onChange={(e) => updatePrimaryAddress("pincode", e.target.value)}
              className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            />
          </div>
        </div>
      </div>

      {usermode === "edit" && counsellorId && (
        <button
          onClick={handleUpdateBasicDetails}
          className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary w-full disabled:opacity-50"
        >
          Update
        </button>
      )}
    </div>
  );
}

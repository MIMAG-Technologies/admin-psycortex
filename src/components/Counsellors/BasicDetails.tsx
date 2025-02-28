import { CounsellorDetails } from "@/types/counsellors";

export default function BasicDetails({
  counsellorDetails,
  updateCounsellorDetails,
}: {
  counsellorDetails: CounsellorDetails;
  updateCounsellorDetails: (
    attribute: keyof CounsellorDetails,
    value: any
  ) => void;
}) {
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
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Biography */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Biography
          </label>
          <textarea
            value={counsellorDetails.biography}
            style={{
                resize:"none"
            }}
            onChange={(e) =>
              updateCounsellorDetails("biography", e.target.value)
            }
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Write a short biography"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

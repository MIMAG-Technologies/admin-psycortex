import { useLoading } from "@/context/LoadingContext";
import { CounsellorDetails, Education, License } from "@/types/counsellors";
import { updateProfessionalInfo } from "@/utils/counsellor";
import { IoTrash, IoAddCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";

export default function ProfessionalInfo({
  counsellorDetails,
  education,
  lisences,
  updateCounsellorDetails,
  addEducation,
  deleteEducation,
  updateEducation,
  addLicense,
  deleteLicense,
  updateLicense,
  mode,
  id,
}: {
  counsellorDetails: CounsellorDetails;
  education: Array<Education>;
  lisences: Array<License>;
  updateCounsellorDetails: (
    attribute: keyof CounsellorDetails,
    value: any
  ) => void;
  addEducation: (newEducation: Education) => void;
  deleteEducation: (index: number) => void;
  updateEducation: (
    index: number,
    updatedEducation: Partial<Education>
  ) => void;
  addLicense: (newLicense: License) => void;
  deleteLicense: (index: number) => void;
  updateLicense: (index: number, updatedLicense: Partial<License>) => void;
  mode: string;
  id?: string;
}) {
  const maxEntries = 20;
  const { setLoading } = useLoading();

  const validateProfessionalInfo = () => {
    if (!counsellorDetails.title.trim()) {
      toast.error("Title is required.");
      return false;
    }

    if (counsellorDetails.yearsOfExperience <= 0) {
      toast.error("Years of experience must be greater than 0.");
      return false;
    }

    if (education.length === 0) {
      toast.error("At least one education entry is required.");
      return false;
    }

    for (const edu of education) {
      if (
        !edu.degree.trim() ||
        !edu.field.trim() ||
        !edu.institution.trim() ||
        !edu.year
      ) {
        toast.error("All fields in education must be filled.");
        return false;
      }
    }

    for (const lic of lisences) {
      if (
        !lic.type.trim() ||
        !lic.licenseNumber.trim() ||
        !lic.issuingAuthority.trim() ||
        !lic.validUntil.trim()
      ) {
        toast.error("All fields in licenses must be filled.");
        return false;
      }
    }

    return true;
  };
  const updateProfessionalInformation = async () => {
    if (!id) {
      toast.error("Counsellor ID not provided");
      setLoading(false);
      return;
    }
    if (!validateProfessionalInfo()) {
      setLoading(false);
      return;
    }

    const res = await updateProfessionalInfo(id, {
      title: counsellorDetails.title,
      yearsOfExperience: counsellorDetails.yearsOfExperience,
      education: education,
      licenses: lisences,
    });

    if (res) {
      toast.success("Professional information updated successfully");
    } else {
      toast.error("Failed to update professional information");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={counsellorDetails.title}
            onChange={(e) => updateCounsellorDetails("title", e.target.value)}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. Licensed Therapist"
          />
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Years of Experience
          </label>
          <input
            type="number"
            value={counsellorDetails.yearsOfExperience || ""}
            onChange={(e) =>
              updateCounsellorDetails(
          "yearsOfExperience",
          e.target.value ? parseInt(e.target.value) : 0
              )
            }
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. 5"
          />
        </div>
      </div>

      {/* Education Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 flex justify-between items-center">
          Education
          {education.length < maxEntries && (
            <button
              onClick={() =>
                addEducation({
                  degree: "",
                  field: "",
                  institution: "",
                  year: new Date().getFullYear(),
                })
              }
              className="text-indigo-600 hover:text-indigo-800 transition flex items-center"
            >
              <IoAddCircleOutline className="mr-1" size={20} />
              Add
            </button>
          )}
        </h3>

        {education.length === 0 && (
          <p className="text-gray-500 text-sm mt-2">No education added.</p>
        )}

        {education.map((edu, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg mt-3 flex flex-col sm:flex-row items-center sm:items-start"
          >
            <div className="flex-1">
              <input
                type="text"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(index, { degree: e.target.value })
                }
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Degree (e.g. BSc in Psychology)"
              />
              <input
                type="text"
                value={edu.field}
                onChange={(e) =>
                  updateEducation(index, { field: e.target.value })
                }
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Field of Study"
              />
              <input
                type="text"
                value={edu.institution}
                onChange={(e) =>
                  updateEducation(index, { institution: e.target.value })
                }
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Institution Name"
              />
              <input
                type="number"
                value={edu.year}
                onChange={(e) =>
                  updateEducation(index, { year: parseInt(e.target.value) })
                }
                className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Year"
              />
            </div>
            <button
              onClick={() => deleteEducation(index)}
              className="ml-4 text-red-600 hover:text-red-800 transition"
            >
              <IoTrash size={24} />
            </button>
          </div>
        ))}
      </div>

      {/* License Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 flex justify-between items-center">
          Licenses
          {lisences.length < maxEntries && (
            <button
              onClick={() =>
                addLicense({
                  type: "",
                  licenseNumber: "",
                  issuingAuthority: "",
                  validUntil: "",
                })
              }
              className="text-indigo-600 hover:text-indigo-800 transition flex items-center"
            >
              <IoAddCircleOutline className="mr-1" size={20} />
              Add
            </button>
          )}
        </h3>

        {lisences.length === 0 && (
          <p className="text-gray-500 text-sm mt-2">No licenses added.</p>
        )}

        {lisences.map((lic, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg mt-3 flex flex-col sm:flex-row items-center sm:items-start"
          >
            <div className="flex-1">
              <input
                type="text"
                value={lic.type}
                onChange={(e) => updateLicense(index, { type: e.target.value })}
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="License Type"
              />
              <input
                type="text"
                value={lic.licenseNumber}
                onChange={(e) =>
                  updateLicense(index, { licenseNumber: e.target.value })
                }
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="License Number"
              />
              <input
                type="text"
                value={lic.issuingAuthority}
                onChange={(e) =>
                  updateLicense(index, { issuingAuthority: e.target.value })
                }
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Issuing Authority"
              />
              <input
                type="date"
                value={lic.validUntil}
                onChange={(e) =>
                  updateLicense(index, { validUntil: e.target.value })
                }
                className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => deleteLicense(index)}
              className="ml-4 text-red-600 hover:text-red-800 transition"
            >
              <IoTrash size={24} />
            </button>
          </div>
        ))}
      </div>
      {mode === "edit" && id && (
        <button
          onClick={updateProfessionalInformation}
          className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary  w-full disabled:opacity-50"
        >
          Update
        </button>
      )}
    </div>
  );
}

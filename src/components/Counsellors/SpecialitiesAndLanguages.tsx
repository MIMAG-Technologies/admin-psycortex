import { Language } from "@/types/counsellors";
import { IoAddCircleOutline, IoTrash, IoCreate } from "react-icons/io5";

export default function SpecialitiesAndLanguages({
  languages,
  specialties,
  addLanguage,
  deleteLanguage,
  updateLanguage,
  addSpecialty,
  deleteSpecialty,
  updateSpecialty,
  mode,
  id,
}: {
  languages: Language[];
  specialties: string[];
  addLanguage: (newLanguage: Language) => void;
  deleteLanguage: (index: number) => void;
  updateLanguage: (index: number, updates: Partial<Language>) => void;
  addSpecialty: (specialty: string) => void;
  deleteSpecialty: (index: number) => void;
  updateSpecialty: (index: number, updatedSpecialty: string) => void;
  mode: string;
  id?: string;
}) {
  const maxEntries = 3; // Maximum number of languages & specialties

  return (
    <div className="mx-auto p-6 bg-white rounded-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 flex justify-between items-center">
          Languages
          {languages.length < maxEntries && (
            <button
              onClick={() =>
                addLanguage({ language: "", proficiencyLevel: "Basic" })
              }
              className="text-indigo-600 hover:text-indigo-800 transition flex items-center"
            >
              <IoAddCircleOutline className="mr-1" size={20} />
              Add
            </button>
          )}
        </h3>

        {languages.length === 0 && (
          <p className="text-gray-500 text-sm mt-2">No languages added.</p>
        )}

        {languages.map((lang, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg mt-3 flex flex-col sm:flex-row items-center sm:items-start"
          >
            <div className="flex-1">
              <input
                type="text"
                value={lang.language}
                onChange={(e) =>
                  updateLanguage(index, { language: e.target.value })
                }
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter Language"
              />
              <select
                value={lang.proficiencyLevel}
                onChange={(e) =>
                  updateLanguage(index, {
                    proficiencyLevel: e.target
                      .value as Language["proficiencyLevel"],
                  })
                }
                className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Basic">Basic</option>
                <option value="Conversational">Conversational</option>
                <option value="Professional">Professional</option>
                <option value="Fluent">Fluent</option>
                <option value="Native">Native</option>
              </select>
            </div>
            <button
              onClick={() => deleteLanguage(index)}
              className="ml-4 text-red-600 hover:text-red-800 transition"
            >
              <IoTrash size={24} />
            </button>
          </div>
        ))}
      </div>

      {/* Specialties Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 flex justify-between items-center">
          Specialties
          {specialties.length < maxEntries && (
            <button
              onClick={() => addSpecialty("")}
              className="text-indigo-600 hover:text-indigo-800 transition flex items-center"
            >
              <IoAddCircleOutline className="mr-1" size={20} />
              Add
            </button>
          )}
        </h3>

        {specialties.length === 0 && (
          <p className="text-gray-500 text-sm mt-2">No specialties added.</p>
        )}

        {specialties.map((specialty, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg mt-3 flex flex-col sm:flex-row items-center sm:items-start"
          >
            <div className="flex-1">
              <input
                type="text"
                value={specialty}
                onChange={(e) => updateSpecialty(index, e.target.value)}
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter Specialty"
              />
            </div>
            <button
              onClick={() => deleteSpecialty(index)}
              className="ml-4 text-red-600 hover:text-red-800 transition"
            >
              <IoTrash size={24} />
            </button>
          </div>
        ))}
      </div>
      {mode === "edit" && id && (
        <button
          onClick={() => {}}
          className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary  w-full disabled:opacity-50"
        >
          Update
        </button>
      )}
    </div>
  );
}

import { useLoading } from "@/context/LoadingContext";
import { Language } from "@/types/counsellors";
import { updateLanguages, updateSpecialties } from "@/utils/counsellor";
import { getFilters } from "@/utils/filters";
import { useEffect, useState } from "react";
import { IoAddCircleOutline, IoTrash, IoCreate } from "react-icons/io5";
import { toast } from "react-toastify";

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
  type Filter = { id: number; name: string; priority: number };
  const [languagesList, setLanguages] = useState<Filter[]>([]);
  const [specialtiesList, setSpecialties] = useState<Filter[]>([]);



  const maxEntries = 3; // Maximum number of languages & specialties
  const { setLoading } = useLoading();
  const UpdateSpecialitiesandLanguages = async () => {
    setLoading(true);
    if (!id) {
      toast.error("Counsellor ID not provided");
      setLoading(false);
      return;
    }

    if (languages.length < 2 || specialties.length < 2) {
      toast.error("Please select at least two languages and two specialties.");
      setLoading(false);
      return;
    }

    const res1 = await updateSpecialties(id, specialties);
    const res2 = await updateLanguages(id, languages);
    if (!res1 || !res2) {
      toast.error("Error updating specialties and languages");
      setLoading(false);
      return;
    }
    toast.success("Specialties and languages updated successfully");
    setLoading(false);
  };


    const fetchFilters = async () => {
      const filters = await getFilters();
      setLanguages(
        filters.languages?.sort(
          (a: Filter, b: Filter) => b.priority - a.priority
        ) || []
      );
      setSpecialties(
        filters.specialties?.sort(
          (a: Filter, b: Filter) => b.priority - a.priority
        ) || []
      );
    };

    useEffect(() => {
       setLoading(true);
      fetchFilters();
       setLoading(false);
    }, []);

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
              <select
              value={lang.language}
              onChange={(e) =>
                updateLanguage(index, { language: e.target.value })
              }
              className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
              <option value="" disabled>Select Language</option>
              {languagesList.map((language) => (
                <option key={language.id} value={language.name}>
                {language.name}
                </option>
              ))}
              </select>
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
              <select
              value={specialty}
              onChange={(e) => updateSpecialty(index, e.target.value)}
              className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
              <option value="" disabled>Select Specialty</option>
              {specialtiesList.map((specialty) => (
                <option key={specialty.id} value={specialty.name}>
                {specialty.name}
                </option>
              ))}
              </select>
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
          onClick={UpdateSpecialitiesandLanguages}
          className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary  w-full disabled:opacity-50"
        >
          Update
        </button>
      )}
    </div>
  );
}

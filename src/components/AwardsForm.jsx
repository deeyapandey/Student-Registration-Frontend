import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const AwardsForm = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({ name: "Awards", control });

  return (
    <div className="p-6 border rounded-lg shadow-lg mb-6 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Awards & Achievements</h2>
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-5 border border-gray-200 rounded-xl bg-gray-50 shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-4">
              <div>
                <label htmlFor={`awardTitle-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Title of Award*
                </label>
                <input
                  id={`awardTitle-${index}`}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  {...register(`Awards.${index}.TitleOfAward`)}
                  placeholder="e.g., Best Debater, Science Fair Winner"
                />
                {errors?.Awards?.[index]?.TitleOfAward && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.Awards[index].TitleOfAward.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor={`issuingOrg-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Organization
                </label>
                <input
                  id={`issuingOrg-${index}`}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  {...register(`Awards.${index}.IssuingOrganization`)}
                  placeholder="e.g., Rotary Club, School Name"
                />
              </div>
              <div>
                <label htmlFor={`yearReceived-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Year Received
                </label>
                <input
                  id={`yearReceived-${index}`}
                  type="number"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  {...register(`Awards.${index}.YearReceived`, {
                    valueAsNumber: true,
                  })}
                  placeholder="e.g., 2023"
                />
                 {errors?.Awards?.[index]?.YearReceived && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.Awards[index].YearReceived.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor={`certificateFile-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate File
                </label>
                <input
                  id={`certificateFile-${index}`}
                  type="file"
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100 cursor-pointer"
                  {...register(`Awards.${index}.CertificateFile`)}
                />
              </div>
            </div>
            <div className="text-right mt-6">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                onClick={() => remove(index)}
              >
                Remove Award
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        onClick={() =>
          append({
            TitleOfAward: "",
            IssuingOrganization: "",
            YearReceived: undefined,
            CertificateFile: null,
          })
        }
      >
        Add New Award
      </button>
    </div>
  );
};

export default AwardsForm;

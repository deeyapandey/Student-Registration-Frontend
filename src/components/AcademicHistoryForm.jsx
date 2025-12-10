import React, { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const AcademicHistoryForm = () => {
  const {
    control,
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  // useFieldArray handles multiple dynamic academic records
  const { fields, append, remove } = useFieldArray({
    name: "PreviousAcademics",
    control,
  });

  // Optional: prefill one empty academic record if none exists
  useEffect(() => {
    if (fields.length === 0) {
      append({
        Qualification: "",
        BoardUniversity: "",
        Institution: "",
        PassedYear: "",
        DivisionGPA: "",
      });
    }
  }, [append, fields.length]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-6">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        Previous Academic Records
      </h3>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Qualification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualification*
              </label>
              <input
                {...register(`PreviousAcademics.${index}.Qualification`, {
                  required: "Qualification is required",
                })}
                placeholder="e.g., High School, Bachelor's"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              {errors.PreviousAcademics?.[index]?.Qualification && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.PreviousAcademics[index].Qualification.message}
                </p>
              )}
            </div>

            {/* Board / University */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Board / University*
              </label>
              <input
                {...register(`PreviousAcademics.${index}.BoardUniversity`, {
                  required: "Board / University is required",
                })}
                placeholder="e.g., CBSE, Delhi University"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              {errors.PreviousAcademics?.[index]?.BoardUniversity && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.PreviousAcademics[index].BoardUniversity.message}
                </p>
              )}
            </div>

            {/* Institution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution*
              </label>
              <input
                {...register(`PreviousAcademics.${index}.Institution`, {
                  required: "Institution is required",
                })}
                placeholder="e.g., St. Stephen's College"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              {errors.PreviousAcademics?.[index]?.Institution && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.PreviousAcademics[index].Institution.message}
                </p>
              )}
            </div>

            {/* Passed Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passed Year*
              </label>
              <input
                type="number"
                {...register(`PreviousAcademics.${index}.PassedYear`, {
                  required: "Passed year is required",
                  valueAsNumber: true,
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
                placeholder="e.g., 2023"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              {errors.PreviousAcademics?.[index]?.PassedYear && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.PreviousAcademics[index].PassedYear.message}
                </p>
              )}
            </div>

            {/* Division / GPA */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Division / GPA*
              </label>
              <input
                {...register(`PreviousAcademics.${index}.DivisionGPA`, {
                  required: "Division / GPA is required",
                })}
                placeholder="e.g., First Division, 8.5 CGPA"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              {errors.PreviousAcademics?.[index]?.DivisionGPA && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.PreviousAcademics[index].DivisionGPA.message}
                </p>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <div className="text-right">
            <button
              type="button"
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        className="mt-4 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        onClick={() =>
          append({
            Qualification: "",
            BoardUniversity: "",
            Institution: "",
            PassedYear: "",
            DivisionGPA: "",
          })
        }
      >
        Add Academic Record
      </button>
    </div>
  );
};

export default AcademicHistoryForm;

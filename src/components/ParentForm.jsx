import React, { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const ParentForm = () => {
  const {
    control,
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  // useFieldArray for dynamic parent entries
  const { fields, append, remove } = useFieldArray({
    name: "Parents",
    control,
  });

  // Optional: prefill a default parent if none exists
  useEffect(() => {
    if (fields.length === 0) {
      append({
        ParentType: "Father",
        FullName: "",
        MobileNumber: "",
        Occupation: "",
        Designation: "",
        Organization: "",
        Email: "",
        Relation: "",
      });
    }
  }, [append, fields.length]);

  return (
    <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        Parents / Guardians
      </h3>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 p-6 mb-4 rounded-lg shadow-sm bg-gray-50"
        >
          {/* Parent Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type*
            </label>
            <select
              {...register(`Parents.${index}.ParentType`, {
                required: "Parent type is required",
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="LegalGuardian">Legal Guardian</option>
            </select>
            {errors.Parents?.[index]?.ParentType && (
              <p className="mt-2 text-sm text-red-600">
                {errors.Parents[index].ParentType.message}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name*
            </label>
            <input
              {...register(`Parents.${index}.FullName`, {
                required: "Full name is required",
              })}
              placeholder="Full Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.Parents?.[index]?.FullName && (
              <p className="mt-2 text-sm text-red-600">
                {errors.Parents[index].FullName.message}
              </p>
            )}
          </div>

          {/* Mobile Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number*
            </label>
            <input
              {...register(`Parents.${index}.MobileNumber`, {
                required: "Mobile number is required",
              })}
              placeholder="Mobile Number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.Parents?.[index]?.MobileNumber && (
              <p className="mt-2 text-sm text-red-600">
                {errors.Parents[index].MobileNumber.message}
              </p>
            )}
          </div>

          {/* Optional Fields */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Occupation
              </label>
              <input
                {...register(`Parents.${index}.Occupation`)}
                placeholder="Occupation"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation
              </label>
              <input
                {...register(`Parents.${index}.Designation`)}
                placeholder="Designation"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization
              </label>
              <input
                {...register(`Parents.${index}.Organization`)}
                placeholder="Organization"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register(`Parents.${index}.Email`)}
                placeholder="Email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relation
              </label>
              <input
                {...register(`Parents.${index}.Relation`)}
                placeholder="Relation"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            className="mt-2 w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={() => remove(index)}
          >
            Remove Parent
          </button>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        className="mt-4 w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={() =>
          append({
            ParentType: "Father",
            FullName: "",
            MobileNumber: "",
            Occupation: "",
            Designation: "",
            Organization: "",
            Email: "",
            Relation: "",
          })
        }
      >
        Add Parent / Guardian
      </button>
    </div>
  );
};

export default ParentForm;

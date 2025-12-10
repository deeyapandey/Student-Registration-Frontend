import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const FileUploadForm = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({ name: "Files", control });

  return (
    <div className="p-4 border rounded shadow-sm mb-4 bg-white">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Files Upload</h2>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md transition-shadow duration-200 ease-in-out"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor={`fileType-${index}`} className="block text-sm font-medium text-gray-700 mb-1">File Type*</label>
                <input
                  id={`fileType-${index}`}
                  className="border p-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  placeholder="e.g., Transcript, ID Proof"
                  {...register(`Files.${index}.FileType`)}
                />
                {errors?.Files?.[index]?.FileType && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.Files[index].FileType.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor={`file-${index}`} className="block text-sm font-medium text-gray-700 mb-1">File*</label>
                <input
                  id={`file-${index}`}
                  type="file"
                  className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 cursor-pointer transition duration-150 ease-in-out"
                  {...register(`Files.${index}.File`)}
                />
                {errors?.Files?.[index]?.File && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.Files[index].File.message}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right mt-4">
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                onClick={() => remove(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out font-medium"
        onClick={() => append({})}
      >
        Add File
      </button>
    </div>
  );
};

export default FileUploadForm;

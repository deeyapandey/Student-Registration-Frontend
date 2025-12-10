import React from "react";
import { useFormContext } from "react-hook-form";

const DeclarationStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="rounded-lg bg-white p-8 shadow-sm border border-gray-200 space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Declaration</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Place*
        </label>
        <input
          type="text"
          {...register("Place", { required: "Place is required" })}
          className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.Place && (
          <p className="text-red-600 text-sm mt-1">{errors.Place.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Application*
        </label>
        <input
          type="date"
          {...register("DateOfApplication", { required: "Date is required" })}
          className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.DateOfApplication && (
          <p className="text-red-600 text-sm mt-1">
            {errors.DateOfApplication.message}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("DeclarationAccepted", {
              required: "You must accept the declaration",
            })}
            className="h-5 w-5 mt-1"
          />
          <span className="text-gray-700">
            I hereby declare that the information provided is true, complete,
            and correct to the best of my knowledge.
          </span>
        </label>
        {errors.DeclarationAccepted && (
          <p className="text-red-600 text-sm mt-1">
            {errors.DeclarationAccepted.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default DeclarationStep;

import React from "react";
import { useFormContext } from "react-hook-form";

const ExtracurricularActivities = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="p-4 border rounded shadow-sm mb-4 bg-white">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Extracurricular Interests
      </h2>
      <div className="space-y-2">
        <textarea
          {...register("ExtracurricularInterests")}
          rows={4}
          className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Playing guitar, volunteering, sports clubs, coding competitions."
        />
        {errors.ExtracurricularInterests && (
          <p className="text-red-600 text-sm mt-1">
            {errors.ExtracurricularInterests.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ExtracurricularActivities;

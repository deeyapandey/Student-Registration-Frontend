import React from "react";
import { useFormContext } from "react-hook-form";
import { AcademicStatusType } from "../constants/enums";

const EnrollmentForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="text-lg font-bold mb-4">Enrollment Details</h2>

      <div className="mb-2">
        <label>Faculty*</label>
        <input
          className="border p-1 rounded w-full"
          {...register("Enrollment.Faculty")}
        />
        <p className="text-red-600">{errors?.Enrollment?.Faculty?.message}</p>
      </div>

      <div className="mb-2">
        <label>Program*</label>
        <input
          className="border p-1 rounded w-full"
          {...register("Enrollment.Program")}
        />
        <p className="text-red-600">{errors?.Enrollment?.Program?.message}</p>
      </div>

      <div className="mb-2">
        <label>Course Level*</label>
        <input
          className="border p-1 rounded w-full"
          {...register("Enrollment.CourseLevel")}
        />
        <p className="text-red-600">
          {errors?.Enrollment?.CourseLevel?.message}
        </p>
      </div>

      <div className="mb-2">
        <label>Academic Year*</label>
        <input
          className="border p-1 rounded w-full"
          {...register("Enrollment.AcademicYear")}
        />
        <p className="text-red-600">
          {errors?.Enrollment?.AcademicYear?.message}
        </p>
      </div>

      <div className="mb-2">
        <label>Semester Class*</label>
        <input
          className="border p-1 rounded w-full"
          {...register("Enrollment.SemesterClass")}
        />
        <p className="text-red-600">
          {errors?.Enrollment?.SemesterClass?.message}
        </p>
      </div>

      <div className="mb-2">
        <label>Section</label>
        <input
          className="border p-1 rounded w-full"
          {...register("Enrollment.Section")}
        />
        <p className="text-red-600">{errors?.Enrollment?.Section?.message}</p>
      </div>

      <div className="mb-2">
        <label>Roll Number*</label>
        <input
          className="border p-1 rounded w-full"
          {...register("Enrollment.RollNumber")}
        />
        <p className="text-red-600">
          {errors?.Enrollment?.RollNumber?.message}
        </p>
      </div>

      <div className="mb-2">
        <label>Registration Number*</label>
        <input
          className="border p-1 rounded w-full"
          {...register("Enrollment.RegistrationNumber")}
        />
        <p className="text-red-600">
          {errors?.Enrollment?.RegistrationNumber?.message}
        </p>
      </div>

      <div className="mb-2">
        <label>Enroll Date*</label>
        <input
          type="date"
          className="border p-1 rounded w-full"
          {...register("Enrollment.EnrollDate")}
        />
        <p className="text-red-600">
          {errors?.Enrollment?.EnrollDate?.message}
        </p>
      </div>

      <div className="mb-2">
        <label>Academic Status*</label>
        <select
          className="border p-1 rounded w-full"
          {...register("Enrollment.AcademicStatus")}
        >
          <option value="">Select Status</option>
          {Object.values(AcademicStatusType).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <p className="text-red-600">
          {errors?.Enrollment?.AcademicStatus?.message}
        </p>
      </div>
    </div>
  );
};

export default EnrollmentForm;

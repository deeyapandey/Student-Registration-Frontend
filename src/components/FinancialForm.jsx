import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

const FinancialForm = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  // Watch FeeCategory to optionally show scholarship fields
  const feeCategory = useWatch({ control, name: "Financial.FeeCategory" });

  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="text-lg font-bold mb-4">Financial Details</h2>

      <div className="mb-2">
        <label>Fee Category*</label>
        <select
          className="border p-1 rounded w-full"
          {...register("Financial.FeeCategory")}
        >
          <option value="">Select</option>
          <option value="Regular">Regular</option>
          <option value="SelfFinanced">Self-Financed</option>
          <option value="Scholarship">Scholarship</option>
          <option value="Quota">Quota</option>
        </select>
        <p className="text-red-600">
          {errors?.Financial?.FeeCategory?.message}
        </p>
      </div>

      {feeCategory === "Scholarship" && (
        <>
          <div className="mb-2">
            <label>Scholarship Type</label>
            <input
              className="border p-1 rounded w-full"
              {...register("Financial.ScholarshipType")}
            />
            <p className="text-red-600">
              {errors?.Financial?.ScholarshipType?.message}
            </p>
          </div>

          <div className="mb-2">
            <label>Scholarship Provider</label>
            <input
              className="border p-1 rounded w-full"
              {...register("Financial.ScholarshipProvider")}
            />
            <p className="text-red-600">
              {errors?.Financial?.ScholarshipProvider?.message}
            </p>
          </div>

          <div className="mb-2">
            <label>Scholarship Amount</label>
            <input
              type="number"
              className="border p-1 rounded w-full"
              {...register("Financial.ScholarshipAmount", {
                valueAsNumber: true,
              })}
            />
            <p className="text-red-600">
              {errors?.Financial?.ScholarshipAmount?.message}
            </p>
          </div>
        </>
      )}

      <div className="mb-2">
        <label>Account Holder Name*</label>
        <input
          className="border p-1 rounded w-full"
          {...register("Financial.AccountHolderName")}
        />
        <p className="text-red-600">
          {errors?.Financial?.AccountHolderName?.message}
        </p>
      </div>

      <div className="mb-2">
        <label>Bank Name*</label>
        <input
          className="border p-1 rounded w-full"
          {...register("Financial.BankName")}
        />
        <p className="text-red-600">{errors?.Financial?.BankName?.message}</p>
      </div>

      <div className="mb-2">
        <label>Account Number*</label>
        <input
          className="border p-1 rounded w-full"
          {...register("Financial.AccountNumber")}
        />
        <p className="text-red-600">
          {errors?.Financial?.AccountNumber?.message}
        </p>
      </div>

      <div className="mb-2">
        <label>Branch*</label>
        <input
          className="border p-1 rounded w-full"
          {...register("Financial.Branch")}
        />
        <p className="text-red-600">{errors?.Financial?.Branch?.message}</p>
      </div>
    </div>
  );
};

export default FinancialForm;

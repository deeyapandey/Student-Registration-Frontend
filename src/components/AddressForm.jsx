import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import axios from "axios";

// Reusable Address Section Component (unchanged)
const AddressSection = ({ index, isTemporary = false }) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  const provinceId = useWatch({ name: `Addresses.${index}.ProvinceId` });
  const districtId = useWatch({ name: `Addresses.${index}.DistrictId` });

  useEffect(() => {
    axios
      .get("https://localhost:7074/api/location/provinces")
      .then((res) => setProvinces(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (provinceId === undefined || provinceId === "" || provinceId === null) {
      setDistricts([]);
      setMunicipalities([]);
      setValue(`Addresses.${index}.DistrictId`, "");
      setValue(`Addresses.${index}.MunicipalityId`, "");
      return;
    }

    axios
      .get(
        `https://localhost:7074/api/location/districts/by-province/${provinceId}`
      )
      .then((res) => setDistricts(res.data))
      .catch(console.error);

    // reset dependent selects
    setValue(`Addresses.${index}.DistrictId`, "");
    setValue(`Addresses.${index}.MunicipalityId`, "");
    setMunicipalities([]);
  }, [provinceId, index, setValue]);

  useEffect(() => {
    if (districtId === undefined || districtId === "" || districtId === null) {
      setMunicipalities([]);
      setValue(`Addresses.${index}.MunicipalityId`, "");
      return;
    }

    axios
      .get(
        `https://localhost:7074/api/location/municipalities/by-district/${districtId}`
      )
      .then((res) => setMunicipalities(res.data))
      .catch(console.error);

    setValue(`Addresses.${index}.MunicipalityId`, "");
  }, [districtId, index, setValue]);

  const label = isTemporary ? "Temporary Address" : "Permanent Address";

  return (
    <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
      <h3 className="font-semibold text-gray-700">{label}</h3>

      {/* Address Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Type*
        </label>
        <select
          className="border p-2 rounded w-full"
          {...register(`Addresses.${index}.AddressType`, {
            required: "Required",
          })}
        >
          <option value="">Select Address Type</option>
          <option value="Permanent">Permanent</option>
          <option value="Temporary">Temporary</option>
        </select>
        {errors.Addresses?.[index]?.AddressType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.Addresses[index].AddressType.message}
          </p>
        )}
      </div>

      {/* Province */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Province*
        </label>
        <select
          className="border p-2 rounded w-full"
          {...register(`Addresses.${index}.ProvinceId`, {
            required: "Province is required",
            valueAsNumber: true,
          })}
          defaultValue=""
        >
          <option value="">Select Province</option>
          {provinces.map((p) => (
            <option key={p.provinceId} value={p.provinceId}>
              {p.provinceName}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          District*
        </label>
        <select
          className="border p-2 rounded w-full"
          {...register(`Addresses.${index}.DistrictId`, {
            required: "District is required",
            valueAsNumber: true,
          })}
          disabled={!districts.length}
          defaultValue=""
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.districtId} value={d.districtId}>
              {d.districtName}
            </option>
          ))}
        </select>
      </div>

      {/* Municipality */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Municipality*
        </label>
        <select
          className="border p-2 rounded w-full"
          {...register(`Addresses.${index}.MunicipalityId`, {
            required: "Municipality is required",
            valueAsNumber: true,
          })}
          disabled={!municipalities.length}
          defaultValue=""
        >
          <option value="">Select Municipality</option>
          {municipalities.map((m) => (
            <option key={m.municipalityId} value={m.municipalityId}>
              {m.municipalityName}
            </option>
          ))}
        </select>
      </div>

      {/* Other Fields */}
      {["WardNumber", "Street", "HouseNumber"].map((f) => (
        <div key={f}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {f}*
          </label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            {...register(`Addresses.${index}.${f}`, { required: "Required" })}
          />
        </div>
      ))}
    </div>
  );
};

// Full AddressForm Wrapper (fixed copy logic)
const AddressForm = () => {
  const { register, watch, setValue, trigger, getValues } = useFormContext();

  const isSame = watch("AddressesSame");
  const permanent = watch("Addresses.0");

  // When isSame toggles to true, copy permanent -> temporary.
  useEffect(() => {
    // only copy when checkbox becomes truthy and permanent exists
    if (!isSame || !permanent) return;

    // Use nullish coalescing so 0 is preserved (don't use ||)
    const tempAddress = {
      AddressType: "Temporary",
      ProvinceId: permanent.ProvinceId ?? "",
      DistrictId: permanent.DistrictId ?? "",
      MunicipalityId: permanent.MunicipalityId ?? "",
      WardNumber: permanent.WardNumber ?? "",
      Street: permanent.Street ?? "",
      HouseNumber: permanent.HouseNumber ?? "",
    };

    // set full object (useful) then set nested fields individually so watchers react
    setValue("Addresses.1", tempAddress, {
      shouldDirty: true,
      shouldTouch: true,
    });
    // set nested fields individually (important for useWatch/useEffect in AddressSection)
    setValue("Addresses.1.ProvinceId", tempAddress.ProvinceId, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("Addresses.1.DistrictId", tempAddress.DistrictId, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("Addresses.1.MunicipalityId", tempAddress.MunicipalityId, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("Addresses.1.WardNumber", tempAddress.WardNumber, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("Addresses.1.Street", tempAddress.Street, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("Addresses.1.HouseNumber", tempAddress.HouseNumber, {
      shouldDirty: true,
      shouldTouch: true,
    });

    // Optionally trigger validation/update for the copied fields
    // trigger([
    //   "Addresses.1.ProvinceId",
    //   "Addresses.1.DistrictId",
    //   "Addresses.1.MunicipalityId",
    //   "Addresses.1.WardNumber",
    // ]);
  }, [isSame, permanent, setValue]);

  // Validation helper for step
  const handleNextValidation = async () => {
    const fields = [];
    const addKeys = (objIndex) => {
      const obj = getValues(`Addresses`)[objIndex] || {};
      Object.keys(obj).forEach((k) =>
        fields.push(`Addresses.${objIndex}.${k}`)
      );
    };
    addKeys(0);
    if (!isSame) addKeys(1);
    return await trigger(fields);
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Addresses</h2>

      <AddressSection index={0} />

      <div className="flex items-center space-x-2">
        <input type="checkbox" {...register("AddressesSame")} />
        <label>Temporary address same as Permanent</label>
      </div>

      {!isSame && <AddressSection index={1} isTemporary />}

      <button
        type="button"
        onClick={async () => {
          if (await handleNextValidation()) {
            alert("Addresses validated! Proceed to next step.");
          }
        }}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Next
      </button>
    </div>
  );
};

export default AddressForm;

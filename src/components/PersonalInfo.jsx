import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import axios from "axios";

/* Wrappers */
const FormSection = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
      {children}
    </div>
  </div>
);

const InputWrapper = ({ label, name, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

/* Inputs */
const TextInput = ({ register, name, label, required, type = "text" }) => {
  const {
    formState: { errors },
  } = useFormContext();
  return (
    <InputWrapper
      label={`${label}${required ? "*" : ""}`}
      name={name}
      error={errors[name]}
    >
      <input
        id={name}
        type={type}
        className="border p-2 rounded w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        {...register(name, type === "number" ? { valueAsNumber: true } : {})}
      />
    </InputWrapper>
  );
};

const DateInput = ({ register, name, label, required }) => {
  const {
    formState: { errors },
  } = useFormContext();
  return (
    <InputWrapper
      label={`${label}${required ? "*" : ""}`}
      name={name}
      error={errors[name]}
    >
      <input
        id={name}
        type="date"
        className="border p-2 rounded w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        {...register(name)}
      />
    </InputWrapper>
  );
};

const SelectInputNumber = ({ register, name, label, options, required }) => {
  const {
    formState: { errors },
  } = useFormContext();
  return (
    <InputWrapper
      label={`${label}${required ? "*" : ""}`}
      name={name}
      error={errors[name]}
    >
      <select
        {...register(name, {
          valueAsNumber: true,
          required: required && `${label} is required`,
        })}
        className="border p-2 rounded w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select...</option>
        {Object.entries(options || {}).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </InputWrapper>
  );
};

const RadioInput = ({ register, name, label, options, required }) => {
  const {
    formState: { errors },
  } = useFormContext();
  return (
    <div>
      <p className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && "*"}
      </p>
      <div className="flex gap-4">
        {Object.entries(options).map(([key, value]) => (
          <label key={key} className="flex items-center gap-1">
            <input
              type="radio"
              value={key}
              {...register(name, {
                required: required && `${label} is required`,
              })}
              className="form-radio text-blue-600"
            />
            {value}
          </label>
        ))}
      </div>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};

/* API Dropdowns (numbers) */
const useApiDropdown = (url, defaultKey, defaultValue) => {
  const [options, setOptions] = useState({});
  const { setValue } = useFormContext();

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        const opts = res.data.reduce((acc, item) => {
          acc[item[defaultKey]] = item[defaultValue];
          return acc;
        }, {});
        setOptions(opts);

        // Set default if exists
        const defaultItem = res.data.find(
          (item) => item[defaultValue] === "Nepali"
        );
        if (defaultItem) setValue(defaultKey, defaultItem[defaultKey]);
      })
      .catch(console.error);
  }, [url, defaultKey, defaultValue, setValue]);

  return options;
};

const NationalityDropdown = ({ register }) => {
  const options = useApiDropdown(
    "https://localhost:7074/api/nationality",
    "nationalityId",
    "name"
  );
  return (
    <SelectInputNumber
      register={register}
      name="NationalityId"
      label="Nationality"
      options={options}
      required
    />
  );
};

const BloodGroupDropdown = ({ register }) => {
  const options = useApiDropdown(
    "https://localhost:7074/api/bloodGroup",
    "bloodGroupId",
    "name"
  );
  return (
    <SelectInputNumber
      register={register}
      name="BloodGroupId"
      label="Blood Group"
      options={options}
    />
  );
};

const DisabilityDropdown = ({ register }) => {
  const options = useApiDropdown(
    "https://localhost:7074/api/DisabilityStatus",
    "disabilityStatusId",
    "status"
  );
  return (
    <SelectInputNumber
      register={register}
      name="DisabilityStatusId"
      label="Disability Status"
      options={options}
    />
  );
};

const MaritalStatusDropdown = ({ register }) => {
  const options = useApiDropdown(
    "https://localhost:7074/api/MaritalStatus",
    "maritalStatusId",
    "status"
  );
  return (
    <SelectInputNumber
      register={register}
      name="MaritalStatusId"
      label="Marital Status"
      options={options}
    />
  );
};

/* PersonalInfo Component */
const PersonalInfo = () => {
  const { register } = useFormContext();

  // Enum strings
  const GenderOptions = { Male: "Male", Female: "Female", Other: "Other" };
  const ResidenceOptions = {
    Hosteller: "Hosteller",
    DayScholar: "Day Scholar",
  };
  const TransportationOptions = {
    Walk: "Walk",
    Bicycle: "Bicycle",
    Bus: "Bus",
    PrivateVehicle: "Private Vehicle",
  };

  return (
    <div className="p-6 border rounded-lg mb-4 bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        Personal Information
      </h2>

      <FormSection title="Full Name & Birth Details">
        <TextInput
          register={register}
          name="FirstName"
          label="First Name"
          required
        />
        <TextInput register={register} name="MiddleName" label="Middle Name" />
        <TextInput
          register={register}
          name="LastName"
          label="Last Name"
          required
        />
        <DateInput
          register={register}
          name="DateOfBirth"
          label="Date of Birth"
          required
        />
        <TextInput
          register={register}
          name="PlaceOfBirth"
          label="Place of Birth"
        />
      </FormSection>

      <FormSection title="Citizenship & Nationality">
        <NationalityDropdown register={register} />
        <TextInput
          register={register}
          name="CitizenshipNumber"
          label="Citizenship Number"
          required
        />
        <DateInput
          register={register}
          name="CitizenshipIssueDate"
          label="Citizenship Issue Date"
          required
        />
        <TextInput
          register={register}
          name="CitizenshipIssueDistrict"
          label="Citizenship Issue District"
          required
        />
      </FormSection>

      <FormSection title="Contact Information">
        <TextInput
          register={register}
          name="Email"
          label="Email"
          required
          type="email"
        />
        <TextInput
          register={register}
          name="AlternateEmail"
          label="Alternate Email"
          type="email"
        />
        <TextInput
          register={register}
          name="PrimaryMobile"
          label="Primary Mobile"
          required
        />
        <TextInput
          register={register}
          name="SecondaryMobile"
          label="Secondary Mobile"
        />
        <TextInput
          register={register}
          name="EmergencyContactName"
          label="Emergency Contact Name"
        />
        <TextInput
          register={register}
          name="EmergencyContactRelation"
          label="Emergency Contact Relation"
        />
        <TextInput
          register={register}
          name="EmergencyContactNumber"
          label="Emergency Contact Number"
        />
      </FormSection>

      <FormSection title="Personal Details">
        <RadioInput
          register={register}
          name="Gender"
          label="Gender"
          required
          options={GenderOptions}
        />
        <BloodGroupDropdown register={register} />
        <MaritalStatusDropdown register={register} />
        <TextInput register={register} name="Religion" label="Religion" />
        <TextInput
          register={register}
          name="EthnicityCaste"
          label="Ethnicity / Caste"
          required
        />
      </FormSection>

      <FormSection title="Disability Information">
        <DisabilityDropdown register={register} />
        <TextInput
          register={register}
          name="DisabilityTypeSpecify"
          label="Specify Disability"
        />
        <TextInput
          register={register}
          name="DisabilityPercentage"
          label="Disability Percentage"
          type="number"
        />
      </FormSection>

      <FormSection title="Other Information">
        <TextInput
          register={register}
          name="AnnualFamilyIncome"
          label="Annual Family Income"
        />
        <select
          {...register("ResidenceType")}
          className="border p-2 rounded w-full mt-2"
        >
          <option value="">Select Residence Type</option>
          {Object.entries(ResidenceOptions).map(([key, val]) => (
            <option key={key} value={key}>
              {val}
            </option>
          ))}
        </select>
        <select
          {...register("TransportationMethod")}
          className="border p-2 rounded w-full mt-2"
        >
          <option value="">Select Transportation</option>
          {Object.entries(TransportationOptions).map(([key, val]) => (
            <option key={key} value={key}>
              {val}
            </option>
          ))}
        </select>
      </FormSection>
    </div>
  );
};

export default PersonalInfo;

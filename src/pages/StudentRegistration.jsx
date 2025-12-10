import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "../schemas/studentSchema";
import { registerStudent } from "../api/studentApi";

// Components
import PersonalInfo from "../components/PersonalInfo";
import AddressForm from "../components/AddressForm";
import ParentForm from "../components/ParentForm";
import EnrollmentForm from "../components/EnrollmentForm";
import FinancialForm from "../components/FinancialForm";
import AcademicHistoryForm from "../components/AcademicHistoryForm";
import FileUploadForm from "../components/FileUploadForm";
import AwardsForm from "../components/AwardsForm";
import ExtracurricularActivities from "../components/ExtraCurricularActivities";
import DeclarationStep from "../components/DeclarationStep";

const steps = [
  {
    id: 1,
    name: "Personal Info",
    component: PersonalInfo,
    fields: [
      "FirstName",
      "MiddleName",
      "LastName",
      "DateOfBirth",
      "PlaceOfBirth",
      "NationalityId",
      "CitizenshipNumber",
      "CitizenshipIssueDate",
      "CitizenshipIssueDistrict",
      "Email",
      "PrimaryMobile",
      "Gender",
      "BloodGroupId",
      "MaritalStatusId",
      "Religion",
      "EthnicityCaste",
      "DisabilityStatusId",
      "DisabilityTypeSpecify",
      "DisabilityPercentage",
      "AnnualFamilyIncome",
      "ResidenceType",
      "TransportationMethod",
    ],
  },
  { id: 2, name: "Address", component: AddressForm, fields: ["Addresses"] },
  { id: 3, name: "Parents", component: ParentForm, fields: ["Parents"] },
  {
    id: 4,
    name: "Enrollment",
    component: EnrollmentForm,
    fields: ["Enrollment"],
  },
  {
    id: 5,
    name: "Financials",
    component: FinancialForm,
    fields: ["Financial"],
  },
  {
    id: 6,
    name: "Academics",
    component: AcademicHistoryForm,
    fields: ["PreviousAcademics"],
  },
  { id: 7, name: "Documents", component: FileUploadForm, fields: ["Files"] },
  { id: 8, name: "Awards", component: AwardsForm, fields: ["Awards"] },
  {
    id: 9,
    name: "Activities",
    component: ExtracurricularActivities,
    fields: ["ExtracurricularInterests"],
  },
  {
    id: 10,
    name: "Declaration",
    component: null,
    fields: ["DeclarationAccepted", "Place", "DateOfApplication"],
  },
];

const StudentRegistration = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm({
    resolver: zodResolver(studentSchema),
    mode: "onSubmit",
    defaultValues: {
      Addresses: [
        {
          AddressType: 0,
          ProvinceId: 0,
          DistrictId: 0,
          MunicipalityId: 0,
          WardNumber: "",
          Street: "",
          HouseNumber: "",
        },
        {
          AddressType: 1,
          ProvinceId: 0,
          DistrictId: 0,
          MunicipalityId: 0,
          WardNumber: "",
          Street: "",
          HouseNumber: "",
        },
      ],
      Parents: [{}],
      PreviousAcademics: [{}],
      Files: [],
      Awards: [],
      Enrollment: {},
      Financial: {},
      ExtracurricularInterests: "",
      DeclarationAccepted: false,
      Place: "",
      DateOfApplication: "",
    },
  });

  const {
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
    reset,
    clearErrors,
  } = methods;

  // ---------------- Fixed handleNext with validation ----------------
  const handleNext = async () => {
    const currentFields = steps[currentStep].fields;
    const fieldsToValidate = [];

    currentFields.forEach((f) => {
      const val = getValues(f);
      if (Array.isArray(val)) {
        val.forEach((item, i) => {
          if (item && Object.keys(item).length > 0) {
            Object.keys(item).forEach((k) =>
              fieldsToValidate.push(`${f}.${i}.${k}`)
            );
          }
        });
      } else if (val !== undefined && val !== null) {
        fieldsToValidate.push(f);
      }
    });

    const valid = await trigger(fieldsToValidate);
    if (valid) {
      clearErrors();
      setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
    } else {
      alert("Please fix errors before proceeding.");
    }
  };

  const handlePrev = () => setCurrentStep(Math.max(currentStep - 1, 0));

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      const appendValue = (key, value) => {
        if (value === null || value === undefined || value === "") return;
        if (typeof value === "number") formData.append(key, String(value));
        else if (typeof value === "boolean")
          formData.append(key, value ? "true" : "false");
        else formData.append(key, String(value));
      };

      // Top-level fields
      Object.keys(data).forEach((k) => {
        if (
          [
            "Enrollment",
            "Financial",
            "Addresses",
            "Parents",
            "PreviousAcademics",
            "Files",
            "Awards",
          ].includes(k)
        )
          return;
        appendValue(k, data[k]);
      });

      // Nested objects
      ["Enrollment", "Financial"].forEach((objKey) => {
        if (data[objKey])
          Object.keys(data[objKey]).forEach((k) =>
            appendValue(`${objKey}.${k}`, data[objKey][k])
          );
      });

      // Arrays
      ["Addresses", "Parents", "PreviousAcademics", "Awards", "Files"].forEach(
        (arrKey) => {
          const arr = data[arrKey];
          if (!arr || !Array.isArray(arr)) return;
          arr.forEach((item, i) => {
            Object.keys(item).forEach((k) => {
              const val = item[k];
              if (val === null || val === undefined || val === "") return;
              if ((k === "CertificateFile" || k === "File") && val.length > 0) {
                formData.append(`${arrKey}[${i}].${k}`, val[0], val[0].name);
              } else appendValue(`${arrKey}[${i}].${k}`, val);
            });
          });
        }
      );

      await registerStudent(formData);
      alert("Registration Successful!");
      reset();
      setCurrentStep(0);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data ?? err?.message ?? "Registration failed");
    }
  };

  const CurrentComponent = steps[currentStep].component;

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex justify-end mb-4">
          <Link
            to="/students"
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            View Registered Students
          </Link>
        </div>
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
              Student Registration Form
            </h1>
            <p className="text-center text-gray-500 mb-8">
              Step {currentStep + 1} of {steps.length}:{" "}
              {steps[currentStep].name}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="min-h-[350px] py-4">
                {CurrentComponent ? <CurrentComponent /> : <DeclarationStep />}
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-white text-gray-700 px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  >
                    Previous
                  </button>
                )}
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                  >
                    Submit Registration
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default StudentRegistration;

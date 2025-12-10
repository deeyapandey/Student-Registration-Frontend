// src/pages/StudentEdit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";

const StudentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      citizenshipIssueDate: "",
      placeOfBirth: "",
      nationalityId: "",
      citizenshipNumber: "",
      email: "",
      alternateEmail: "",
      primaryMobile: "",
      secondaryMobile: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactNumber: "",
      gender: "",
      bloodGroupId: "",
      maritalStatusId: "",
      religion: "",
      ethnicityCaste: "",
      disabilityStatusId: "",
      disabilityTypeSpecify: "",
      disabilityPercentage: "",
      residenceType: "",
      transportationMethod: "",
      extracurricularInterests: "",
      place: "",
      dateOfApplication: "",
      declarationAccepted: false,
      addresses: [],
      parents: [],
      previousAcademics: [],
      enrollment: {},
      financial: {},
      files: [],
      awards: [],
    },
  });

  // Field Arrays
  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({ control, name: "addresses" });
  const {
    fields: parentFields,
    append: appendParent,
    remove: removeParent,
  } = useFieldArray({ control, name: "parents" });
  const {
    fields: academicFields,
    append: appendAcademic,
    remove: removeAcademic,
  } = useFieldArray({ control, name: "previousAcademics" });
  const {
    fields: awardFields,
    append: appendAward,
    remove: removeAward,
  } = useFieldArray({ control, name: "awards" });
  const {
    fields: fileFields,
    append: appendFile,
    remove: removeFile,
  } = useFieldArray({ control, name: "files" });

  // Dropdown states
  const [nationalities, setNationalities] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [maritalStatus, setMaritalStatus] = useState([]);
  const [disabilityStatus, setDisabilityStatus] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districtsPerAddress, setDistrictsPerAddress] = useState({});
  const [municipalitiesPerAddress, setMunicipalitiesPerAddress] = useState({});

  // Fetch student & dropdown data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `https://localhost:7074/api/registration/${id}`
        );
        const student = res.data;

        reset({
          ...student,

          addresses:
            student.addresses?.map((a) => ({
              addressId: a.addressId || null,
              addressType: a.addressType,
              provinceId: a.provinceId || null,
              districtId: a.districtId || null,
              municipalityId: a.municipalityId || null,
              wardNumber: a.wardNumber,
              street: a.street,
              houseNumber: a.houseNumber,
            })) || [],

          parents:
            student.parents?.map((p) => ({
              parentId: p.parentId,
              fullName: p.fullName,
              parentType: p.parentType,
              mobileNumber: p.mobileNumber,
              email: p.email,
              occupation: p.occupation,
              designation: p.designation,
              organization: p.organization,
            })) || [],

          previousAcademics:
            student.previousAcademics?.map((ac) => ({
              academicHistoryId: ac.academicHistoryId,
              qualification: ac.qualification,
              boardUniversity: ac.boardUniversity,
              institution: ac.institution,
              passedYear: ac.passedYear,
              divisionGPA: ac.divisionGPA,
            })) || [],

          awards:
            student.awards?.map((aw) => ({
              awardId: aw.awardId,
              titleOfAward: aw.titleOfAward,
              issuingOrganization: aw.issuingOrganization,
              yearReceived: aw.yearReceived,
              certificateFile: null,
            })) || [],

          files:
            student.files?.map((f) => ({
              fileType: f.fileType,
              file: null,
              existingFilePath: f.filePath,
            })) || [],
          enrollment: student.enrollment || {},
          financial: student.financial || {},

          dateOfBirth: student.dateOfBirth?.split("T")[0] || "",
          citizenshipIssueDate:
            student.citizenshipIssueDate?.split("T")[0] || "",
          dateOfApplication: student.dateOfApplication?.split("T")[0] || "",
        });

        student.addresses?.forEach(async (addr, idx) => {
          if (addr.provinceId) {
            await loadDistricts(addr.provinceId, idx);
            setValue(`addresses.${idx}.provinceId`, addr.provinceId);
            if (addr.districtId) {
              await loadMunicipalities(addr.districtId, idx);
              setValue(`addresses.${idx}.districtId`, addr.districtId);
            }
            if (addr.municipalityId) {
              setTimeout(() => {
                setValue(
                  `addresses.${idx}.municipalityId`,
                  addr.municipalityId
                );
              }, 0);
            }
          }
        });
      } catch (err) {
        console.error(err);
      }
    };

    const fetchDropdowns = async () => {
      try {
        const [natRes, bgRes, msRes, dsRes, provRes] = await Promise.all([
          axios.get("https://localhost:7074/api/nationality"),
          axios.get("https://localhost:7074/api/bloodgroup"),
          axios.get("https://localhost:7074/api/maritalStatus"),
          axios.get("https://localhost:7074/api/disabilityStatus"),
          axios.get("https://localhost:7074/api/location/provinces"),
        ]);
        setNationalities(natRes.data);
        setBloodGroups(bgRes.data);
        setMaritalStatus(msRes.data);
        setDisabilityStatus(dsRes.data);
        setProvinces(provRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudent();
    fetchDropdowns();
  }, [id, reset]);

  // Dynamic load functions
  const loadDistricts = async (provinceId, index) => {
    try {
      const res = await axios.get(
        `https://localhost:7074/api/location/districts/by-province/${provinceId}`
      );
      setDistrictsPerAddress((prev) => ({ ...prev, [index]: res.data }));
      setMunicipalitiesPerAddress((prev) => ({ ...prev, [index]: [] }));

      return res.data;
    } catch (err) {
      console.error(err);
    }
  };
  const loadMunicipalities = async (districtId, index) => {
    try {
      const res = await axios.get(
        `https://localhost:7074/api/location/municipalities/by-district/${districtId}`
      );
      setMunicipalitiesPerAddress((prev) => ({ ...prev, [index]: res.data }));

      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append simple fields
    const simpleFields = [
      "firstName",
      "middleName",
      "lastName",
      "dateOfBirth",
      "placeOfBirth",
      "nationalityId",
      "citizenshipNumber",
      "citizenshipIssueDate",
      "citizenshipIssueDistrict",
      "email",
      "alternateEmail",
      "primaryMobile",
      "secondaryMobile",
      "emergencyContactName",
      "emergencyContactRelation",
      "emergencyContactNumber",
      "gender",
      "bloodGroupId",
      "maritalStatusId",
      "religion",
      "ethnicityCaste",
      "disabilityStatusId",
      "disabilityTypeSpecify",
      "disabilityPercentage",
      "residenceType",
      "transportationMethod",
      "extracurricularInterests",
      "place",
      "dateOfApplication",
      "declarationAccepted",
    ];
    simpleFields.forEach((key) => {
      if (data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    // Addresses - send as separate entities
    data.addresses?.forEach((addr, idx) => {
      formData.append(`Addresses[${idx}].AddressId`, addr.addressId || "");
      formData.append(`Addresses[${idx}].AddressType`, addr.addressType || "");
      formData.append(`Addresses[${idx}].ProvinceId`, addr.provinceId || "");
      formData.append(`Addresses[${idx}].DistrictId`, addr.districtId || "");
      formData.append(
        `Addresses[${idx}].MunicipalityId`,
        addr.municipalityId || ""
      );
      formData.append(`Addresses[${idx}].WardNumber`, addr.wardNumber || "");
      formData.append(`Addresses[${idx}].Street`, addr.street || "");
      formData.append(`Addresses[${idx}].HouseNumber`, addr.houseNumber || "");
    });

    // Parents - send as separate entities
    data.parents?.forEach((parent, idx) => {
      formData.append(`Parents[${idx}].ParentId`, parent.parentId || "");
      formData.append(`Parents[${idx}].FullName`, parent.fullName || "");
      formData.append(`Parents[${idx}].ParentType`, parent.parentType || "");
      formData.append(`Parents[${idx}].Occupation`, parent.occupation || "");
      formData.append(`Parents[${idx}].Designation`, parent.designation || "");
      formData.append(
        `Parents[${idx}].Organization`,
        parent.organization || ""
      );
      formData.append(
        `Parents[${idx}].MobileNumber`,
        parent.mobileNumber || ""
      );
      formData.append(`Parents[${idx}].Email`, parent.email || "");
    });

    // Previous Academics - send as separate entities
    data.previousAcademics?.forEach((academic, idx) => {
      formData.append(
        `PreviousAcademics[${idx}].AcademicHistoryId`,
        academic.academicHistoryId || ""
      );
      formData.append(
        `PreviousAcademics[${idx}].Qualification`,
        academic.qualification || ""
      );
      formData.append(
        `PreviousAcademics[${idx}].BoardUniversity`,
        academic.boardUniversity || ""
      );
      formData.append(
        `PreviousAcademics[${idx}].Institution`,
        academic.institution || ""
      );
      formData.append(
        `PreviousAcademics[${idx}].PassedYear`,
        academic.passedYear || ""
      );
      formData.append(
        `PreviousAcademics[${idx}].DivisionGPA`,
        academic.divisionGPA || ""
      );
    });

    // Enrollment
    formData.append("Enrollment.Faculty", data.enrollment?.faculty || "");
    formData.append("Enrollment.Program", data.enrollment?.program || "");
    formData.append(
      "Enrollment.CourseLevel",
      data.enrollment?.courseLevel || ""
    );
    formData.append(
      "Enrollment.AcademicYear",
      data.enrollment?.academicYear || ""
    );
    formData.append(
      "Enrollment.SemesterClass",
      data.enrollment?.semesterClass || ""
    );
    formData.append("Enrollment.Section", data.enrollment?.section || "");
    formData.append("Enrollment.RollNumber", data.enrollment?.rollNumber || "");
    formData.append(
      "Enrollment.RegistrationNumber",
      data.enrollment?.registrationNumber || ""
    );
    formData.append("Enrollment.EnrollDate", data.enrollment?.enrollDate || "");
    formData.append(
      "Enrollment.AcademicStatus",
      data.enrollment?.academicStatus || ""
    );

    // Financial
    formData.append("Financial.FeeCategory", data.financial?.feeCategory || "");
    if (data.financial?.feeCategory == "Scholarship") {
      formData.append(
        "Financial.ScholarshipType",
        data.financial?.scholarshipType || ""
      );
      formData.append(
        "Financial.ScholarshipProvider",
        data.financial?.scholarshipProvider || ""
      );
      formData.append(
        "Financial.ScholarshipAmount",
        data.financial?.scholarshipAmount || ""
      );
    }
    formData.append("Financial.BankName", data.financial?.bankName || "");
    formData.append(
      "Financial.AccountHolderName",
      data.financial?.accountHolderName || ""
    );
    formData.append(
      "Financial.AccountNumber",
      data.financial?.accountNumber || ""
    );
    formData.append("Financial.Branch", data.financial?.branch || "");

    // Files
    data.files?.forEach((f, idx) => {
      if (f.existingFilePath) {
        formData.append(`Files[${idx}].ExistingFilePath`, f.existingFilePath);
      }
      if (f.file?.[0]) {
        formData.append(`Files[${idx}].File`, f.file[0]);
      }
      formData.append(`Files[${idx}].FileType`, f.fileType || "");
    });

    // Awards
    data.awards?.forEach((a, idx) => {
      if (a.certificateFile?.[0]) {
        formData.append(`Awards[${idx}].CertificateFile`, a.certificateFile[0]);
      }
      formData.append(`Awards[${idx}].TitleOfAward`, a.titleOfAward || "");
      formData.append(
        `Awards[${idx}].IssuingOrganization`,
        a.issuingOrganization || ""
      );
      formData.append(`Awards[${idx}].YearReceived`, a.yearReceived || "");
    });

    try {
      await axios.put(
        `https://localhost:7074/api/registration/update/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Student updated successfully");
      navigate(`/students/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update student");
    }
  };
  const feeCategory = watch("financial.feeCategory");
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Link to={`/students/${id}`} className="text-blue-600 underline">
        ← Back to Details
      </Link>
      <h1 className="text-2xl font-bold mb-4">Edit Student</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Info */}
        <section className="border p-4 rounded bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Personal Information</h2>
          <div className="mb-2">
            <label className="block mb-1 font-medium">First Name</label>
            <input {...register("firstName")} className="border p-2 w-full" />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Middle Name</label>
            <input {...register("middleName")} className="border p-2 w-full" />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Last Name</label>
            <input {...register("lastName")} className="border p-2 w-full" />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Date of Birth</label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Place of Birth</label>
            <input
              {...register("placeOfBirth")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Nationality</label>
            <select
              {...register("nationalityId")}
              className="border p-2 w-full"
            >
              <option value="">Select Nationality</option>
              {nationalities.map((n) => (
                <option key={n.nationalityId} value={n.nationalityId}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Citizenship Number</label>
            <input
              {...register("citizenshipNumber")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">
              Citizenship Issue Date
            </label>
            <input
              type="date"
              {...register("citizenshipIssueDate")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">
              Citizenship Issue District
            </label>
            <input
              {...register("citizenshipIssueDistrict")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Email</label>
            <input {...register("email")} className="border p-2 w-full" />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Alternate Email</label>
            <input
              {...register("alternateEmail")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Primary Mobile</label>
            <input
              {...register("primaryMobile")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Secondary Mobile</label>
            <input
              {...register("secondaryMobile")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">
              Emergency Contact Name
            </label>
            <input
              {...register("emergencyContactName")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">
              Emergency Contact Relation
            </label>
            <input
              {...register("emergencyContactRelation")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">
              Emergency Contact Number
            </label>
            <input
              {...register("emergencyContactNumber")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Gender</label>
            <select {...register("gender")} className="border p-2 w-full">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Blood Group</label>
            <select {...register("bloodGroupId")} className="border p-2 w-full">
              <option value="">Select Blood Group</option>
              {bloodGroups.map((n) => (
                <option key={n.bloodGroupId} value={n.bloodGroupId}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Marital Status</label>
            <select
              {...register("maritalStatusId")}
              className="border p-2 w-full"
            >
              <option value="">Select Marital Status</option>
              {maritalStatus.map((n) => (
                <option key={n.maritalStatusId} value={n.maritalStatusId}>
                  {n.status}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Religion</label>
            <input {...register("religion")} className="border p-2 w-full" />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Ethnicity Caste</label>
            <input
              {...register("ethnicityCaste")}
              className="border p-2 w-full"
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Disability Status</label>
            <select
              {...register("disabilityStatusId")}
              className="border p-2 w-full"
            >
              <option value="">Select Disability Status</option>
              {disabilityStatus.map((n) => (
                <option key={n.disabilityStatusId} value={n.disabilityStatusId}>
                  {n.status}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Disability Type</label>
            <input
              {...register("disabilityTypeSpecify")}
              className="border p-2 w-full"
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">
              Disability Percentage
            </label>
            <input
              type="number"
              {...register("disabilityPercentage")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Residence Type</label>
            <select
              {...register("residenceType")}
              className="border p-2 w-full"
            >
              <option value="">Select Residence Type</option>
              <option value="Hosteller">Hosteller</option>
              <option value="DayScholar">DayScholar</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">
              Transportation Method
            </label>
            <select
              {...register("transportationMethod")}
              className="border p-2 w-full"
            >
              <option value="">Select Transportation Method</option>
              <option value="Walk">Walk</option>
              <option value="Bicycle">Bicycle</option>
              <option value="Bus">Bus</option>
              <option value="PrivateVehicle">PrivateVehicle</option>
            </select>
          </div>
        </section>

        {/* Addresses */}
        <section className="border p-4 rounded bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Addresses</h2>
          {addressFields.map((field, idx) => (
            <div key={field.id} className="mb-2 border p-2">
              <div className="mb-1">
                <label className="block mb-1 font-medium">Address Type</label>
                <input
                  {...register(`addresses.${idx}.addressType`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1 font-medium">Province</label>
                <select
                  {...register(`addresses.${idx}.provinceId`)}
                  className="border p-2 w-full"
                  onChange={(e) => loadDistricts(e.target.value, idx)}
                >
                  <option value="">Select Province</option>
                  {provinces.map((p) => (
                    <option key={p.provinceId} value={p.provinceId}>
                      {p.provinceName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block mb-1 font-medium">District</label>
                <select
                  {...register(`addresses.${idx}.districtId`)}
                  className="border p-2 w-full"
                  onChange={(e) => loadMunicipalities(e.target.value, idx)}
                >
                  <option value="">Select District</option>
                  {(districtsPerAddress[idx] || []).map((d) => (
                    <option key={d.districtId} value={d.districtId}>
                      {d.districtName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block mb-1 font-medium">Municipality</label>
                <select
                  {...register(`addresses.${idx}.municipalityId`)}
                  className="border p-2 w-full"
                >
                  <option value="">Select Municipality</option>
                  {(municipalitiesPerAddress[idx] || []).map((m) => (
                    <option key={m.municipalityId} value={m.municipalityId}>
                      {m.municipalityName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">Ward Number</label>
                <input
                  {...register(`addresses.${idx}.wardNumber`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">Street</label>
                <input
                  {...register(`addresses.${idx}.street`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">House Number</label>
                <input
                  {...register(`addresses.${idx}.houseNumber`)}
                  className="border p-1 w-full"
                />
              </div>
              <button
                type="button"
                onClick={() => removeAddress(idx)}
                className="text-red-600 underline mb-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendAddress({
                addressId: null,
                addressType: "",
                provinceId: null,
                districtId: null,
                municipalityId: null,
                wardNumber: "",
                street: "",
                houseNumber: "",
              })
            }
            className="text-blue-600 underline"
          >
            Add Address
          </button>
        </section>

        {/* Parents */}
        <section className="border p-4 rounded bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Parents / Guardian</h2>
          {parentFields.map((field, idx) => (
            <div key={field.id} className="mb-2 border p-2">
              <div className="mb-1">
                <label className="block mb-1 font-medium">Full Name</label>
                <input
                  {...register(`parents.${idx}.fullName`)}
                  className="border p-1 w-full"
                />
              </div>

              <div className="mb-1">
                <label className="block mb-1 font-medium">Relation</label>
                <input
                  {...register(`parents.${idx}.parentType`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">Occupation</label>
                <input
                  {...register(`parents.${idx}.occupation`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">Designation</label>
                <input
                  {...register(`parents.${idx}.designation`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">Organization</label>
                <input
                  {...register(`parents.${idx}.organization`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">Mobile</label>
                <input
                  {...register(`parents.${idx}.mobileNumber`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">Email</label>
                <input
                  {...register(`parents.${idx}.email`)}
                  className="border p-1 w-full"
                />
              </div>
              <button
                type="button"
                onClick={() => removeParent(idx)}
                className="text-red-600 underline mb-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendParent({})}
            className="text-blue-600 underline"
          >
            Add Parent
          </button>
        </section>

        {/* Enrollment */}
        <section className="border p-4 rounded bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Enrollment</h2>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Faculty</label>
            <input
              {...register("enrollment.faculty")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Program</label>
            <input
              {...register("enrollment.program")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Course Level</label>
            <input
              {...register("enrollment.courseLevel")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Academic Year</label>
            <input
              {...register("enrollment.academicYear")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Semester Class</label>
            <input
              {...register("enrollment.semesterClass")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Section</label>
            <input
              {...register("enrollment.section")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Roll Number</label>
            <input
              {...register("enrollment.rollNumber")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">
              Registraation Number
            </label>
            <input
              {...register("enrollment.registrationNumber")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Enroll Date</label>
            <input
              {...register("enrollment.enrollDate")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Academic Status</label>
            <input
              {...register("enrollment.academicStatus")}
              className="border p-2 w-full"
            />
          </div>
        </section>

        {/* Financial */}
        <section className="border p-4 rounded bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Financial Details</h2>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Fee Category</label>
            <input
              {...register("financial.feeCategory")}
              className="border p-2 w-full"
            />
          </div>
          {feeCategory === "Scholarship" && (
            <div>
              <div className="mb-2">
                <label className="block mb-1 font-medium">
                  Scholarship Type
                </label>
                <input
                  {...register("financial.scholarshipType")}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1 font-medium">
                  Scholarship Provider
                </label>
                <input
                  {...register("financial.scholarshipProvider")}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1 font-medium">
                  Scholarship Amount
                </label>
                <input
                  {...register("financial.scholarshipAmount")}
                  className="border p-2 w-full"
                />
              </div>
            </div>
          )}

          <div className="mb-2">
            <label className="block mb-1 font-medium">Bank Name</label>
            <input
              {...register("financial.bankName")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Account Holder</label>
            <input
              {...register("financial.accountHolderName")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Account Number</label>
            <input
              {...register("financial.accountNumber")}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Branch</label>
            <input
              {...register("financial.branch")}
              className="border p-2 w-full"
            />
          </div>
        </section>

        {/* Academic History */}
        <section className="border p-4 rounded bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Academic History</h2>
          {academicFields.map((field, idx) => (
            <div key={field.id} className="mb-2 border p-2">
              <div className="mb-1">
                <label className="block mb-1 font-medium">Qualification</label>
                <input
                  {...register(`previousAcademics.${idx}.qualification`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">
                  Board / University
                </label>
                <input
                  {...register(`previousAcademics.${idx}.boardUniversity`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">Institution</label>
                <input
                  {...register(`previousAcademics.${idx}.institution`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">Passed Year</label>
                <input
                  {...register(`previousAcademics.${idx}.passedYear`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">GPA / Division</label>
                <input
                  {...register(`previousAcademics.${idx}.divisionGPA`)}
                  className="border p-1 w-full"
                />
              </div>
              <button
                type="button"
                onClick={() => removeAcademic(idx)}
                className="text-red-600 underline mb-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendAcademic({
                academicHistoryId: null,
                qualification: "",
                boardUniversity: "",
                institution: "",
                passedYear: "",
                divisionGPA: "",
              })
            }
            className="text-blue-600 underline"
          >
            Add Academic
          </button>
        </section>

        {/* Awards */}
        <section className="border p-4 rounded bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Awards</h2>
          {awardFields.map((field, idx) => (
            <div key={field.id} className="mb-2 border p-2">
              <div className="mb-1">
                <label className="block mb-1 font-medium">Title</label>
                <input
                  {...register(`awards.${idx}.titleOfAward`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">Organization</label>
                <input
                  {...register(`awards.${idx}.issuingOrganization`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">Year</label>
                <input
                  {...register(`awards.${idx}.yearReceived`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">
                  Certificate File
                </label>
                <input
                  type="file"
                  {...register(`awards.${idx}.certificateFile`)}
                  className="border p-1 w-full"
                />
              </div>
              <button
                type="button"
                onClick={() => removeAward(idx)}
                className="text-red-600 underline mb-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendAward({})}
            className="text-blue-600 underline"
          >
            Add Award
          </button>
        </section>

        {/* Files */}
        <section className="border p-4 rounded bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Files</h2>
          {fileFields.map((field, idx) => (
            <div key={field.id} className="mb-2 border p-2">
              {field.existingFilePath && (
                <p>
                  Existing File:{" "}
                  <a
                    href={field.existingFilePath}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {field.existingFilePath}
                  </a>
                </p>
              )}
              <input
                type="hidden"
                {...register(`files.${idx}.existingFilePath`)}
                defaultValue={field.existingFilePath || ""}
              />

              <div className="mb-1">
                <label className="block mb-1 font-medium">
                  Upload New File
                </label>
                <input
                  type="file"
                  {...register(`files.${idx}.file`)}
                  className="border p-1 w-full"
                />
              </div>
              <div className="mb-1">
                <label className="block mb-1 font-medium">File Type</label>
                <input
                  {...register(`files.${idx}.fileType`)}
                  className="border p-1 w-full"
                />
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-red-600 underline mb-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendFile({})}
            className="text-blue-600 underline"
          >
            Add File
          </button>
        </section>

        {/* Extracurricular & Declaration */}
        <section className="border p-4 rounded bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">
            Extracurricular Activities
          </h2>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Activities</label>
            <textarea
              {...register("extracurricularInterests")}
              className="border p-2 w-full"
            />
          </div>

          <h2 className="text-xl font-semibold mb-3">Declaration</h2>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Place</label>
            <input {...register("place")} className="border p-2 w-full" />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">
              Date of Application
            </label>
            <input
              {...register("dateOfApplication")}
              className="border p-2 w-full"
              type="date"
            />
          </div>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("declarationAccepted")} />
            <span>Accepted</span>
          </label>
        </section>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Student
        </button>
      </form>
    </div>
  );
};

export default StudentEdit;

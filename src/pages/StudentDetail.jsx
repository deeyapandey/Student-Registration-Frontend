import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const StudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `https://localhost:7074/api/registration/${id}`
        );
        setStudent(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudent();
  }, [id]);

  if (!student) return <p className="p-6">Loading...</p>;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Link to="/students" className="text-blue-600 underline">
        ← Back to List
      </Link>

      <h1 className="text-2xl font-bold">
        Student Details (ID: {student.studentId})
      </h1>

      {/* Personal Info */}
      <section className="border p-4 rounded bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Personal Information</h2>

        <p>
          <strong>Name:</strong> {student.firstName} {student.middleName || ""}{" "}
          {student.lastName}
        </p>

        <p>
          <strong>Date of Birth:</strong> {formatDate(student.dateOfBirth)}
        </p>

        <p>
          <strong>Place of Birth:</strong> {student.placeOfBirth}
        </p>

        <p>
          <strong>Nationality:</strong> {student.nationality?.name}
        </p>

        <p>
          <strong>Citizenship Number:</strong> {student.citizenshipNumber}
        </p>
        <p>
          <strong>Citizenship Issue Date:</strong>{" "}
          {formatDate(student.citizenshipIssueDate)}
        </p>
        <p>
          <strong>Citizenship Issue District:</strong>{" "}
          {student.citizenshipIssueDistrict}
        </p>

        <p>
          <strong>Email:</strong> {student.email}
        </p>
        <p>
          <strong>Alternate Email:</strong> {student.alternateEmail}
        </p>

        <p>
          <strong>Primary Mobile:</strong> {student.primaryMobile}
        </p>
        <p>
          <strong>Secondary Mobile:</strong> {student.secondaryMobile}
        </p>
        <p>
          <strong>Emergency Contact Name:</strong>{" "}
          {student.emergencyContactName}
        </p>
        <p>
          <strong>Emergency Contact Relation:</strong>{" "}
          {student.emergencyContactRelation}
        </p>
        <p>
          <strong>Emergency Contact Number:</strong>{" "}
          {student.emergencyContactNumber}
        </p>

        <p>
          <strong>Gender:</strong> {student.gender}
        </p>
        <p>
          <strong>Blood Group:</strong> {student.bloodGroup?.name}
        </p>
        <p>
          <strong>MaritalStatus:</strong> {student.maritalStatus?.status}
        </p>
        <p>
          <strong>Religion:</strong> {student.religion}
        </p>
        <p>
          <strong>Ethnicity/Caste:</strong> {student.ethnicityCaste}
        </p>
        <p>
          <strong>Disablity Status:</strong> {student.disabilityStatus?.Status}
        </p>
        <p>
          <strong>Disability Type:</strong> {student.disabilityTypeSpecify}
        </p>
        <p>
          <strong>Disability Percentage:</strong> {student.disabilityPercentage}
        </p>
        <p>
          <strong>Annual Family Income:</strong> {student.annualFamilyIncome}
        </p>

        <p>
          <strong>Residence Type:</strong> {student.residenceType}
        </p>

        <p>
          <strong>Transportation:</strong> {student.transportationMethod}
        </p>
      </section>

      {/* Address */}
      <section className="border p-4 rounded bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Addresses</h2>

        {student.addresses?.map((addr, i) => (
          <div key={i} className="mb-4 border-b pb-3">
            <p>
              <strong>Type:</strong> {addr.addressType}
            </p>
            <p>
              <strong>Province:</strong> {addr.province?.provinceName}
            </p>
            <p>
              <strong>District:</strong> {addr.district?.districtName}
            </p>
            <p>
              <strong>Municipality:</strong>
              {addr.municipality?.municipalityName}
            </p>
            <p>
              <strong>Ward:</strong> {addr.wardNumber}
            </p>
            <p>
              <strong>Street:</strong> {addr.street}
            </p>
            <p>
              <strong>House Number:</strong> {addr.houseNumber}
            </p>
          </div>
        ))}
      </section>

      {/* Parents */}
      <section className="border p-4 rounded bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Parents / Guardian</h2>

        {student.parents?.map((p, i) => (
          <div key={i} className="mb-4 border-b pb-3">
            <p>
              <strong>Full Name:</strong> {p.fullName}
            </p>
            <p>
              <strong>Occupation:</strong> {p.occupation}
            </p>
            <p>
              <strong>Designation:</strong> {p.designation}
            </p>
            <p>
              <strong>Organization:</strong> {p.organization}
            </p>
            <p>
              <strong>Mobile Number:</strong> {p.mobileNumber}
            </p>
            <p>
              <strong>Email:</strong> {p.email}
            </p>
            <p>
              <strong>Relation:</strong> {p.parentType}
            </p>
          </div>
        ))}
      </section>

      {/* Enrollment */}
      <section className="border p-4 rounded bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Enrollment</h2>

        <p>
          <strong>Faculty:</strong> {student.enrollment?.faculty}
        </p>
        <p>
          <strong>Program:</strong> {student.enrollment?.program}
        </p>
        <p>
          <strong>Course Level:</strong> {student.enrollment?.courseLevel}
        </p>
        <p>
          <strong>Academic Year:</strong> {student.enrollment?.academicYear}
        </p>
        <p>
          <strong>Semester Class:</strong> {student.enrollment?.semesterClass}
        </p>
        <p>
          <strong>Section:</strong> {student.enrollment?.section}
        </p>
        <p>
          <strong>Roll Number:</strong> {student.enrollment?.rollNumber}
        </p>
        <p>
          <strong>Registration Number:</strong>{" "}
          {student.enrollment?.registrationNumber}
        </p>
        <p>
          <strong>Enroll Date:</strong> {student.enrollment?.enrollDate}
        </p>
        <p>
          <strong>Academic Status:</strong> {student.enrollment?.academicStatus}
        </p>
      </section>

      {/* Financial */}
      {student.financial.feeCategory === "Scholarship" && (
        <section className="border p-4 rounded bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Financial Details</h2>

          <p>
            <strong>Fee Category:</strong> {student.financial.feeCategory}
          </p>
          <p>
            <strong>Schorship Type:</strong> {student.financial.scholarshipType}
          </p>
          <p>
            <strong>Schorship Provider:</strong>{" "}
            {student.financial.scholarshipProvider}
          </p>
          <p>
            <strong>Schorship Amount:</strong>{" "}
            {student.financial.scholarshipAmount}
          </p>
          <p>
            <strong>Bank Name:</strong> {student.financial.bankName}
          </p>
          <p>
            <strong>Account Holder:</strong>{" "}
            {student.financial.accountHolderName}
          </p>
          <p>
            <strong>Account Number:</strong> {student.financial.accountNumber}
          </p>
          <p>
            <strong>Branch:</strong> {student.financial.branch}
          </p>
        </section>
      )}
      {student.financial.feeCategory !== "Scholarship" && (
        <section className="border p-4 rounded bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Financial Details</h2>

          <p>
            <strong>Fee Category:</strong> {student.financial.feeCategory}
          </p>

          <p>
            <strong>Bank Name:</strong> {student.financial.bankName}
          </p>

          <p>
            <strong>Account Holder:</strong>{" "}
            {student.financial.accountHolderName}
          </p>

          <p>
            <strong>Account Number:</strong> {student.financial.accountNumber}
          </p>
          <p>
            <strong>Branch:</strong> {student.financial.branch}
          </p>
        </section>
      )}

      {/* Academic History */}
      <section className="border p-4 rounded bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Academic History</h2>

        {student.previousAcademics?.map((a, i) => (
          <div key={i} className="mb-4 border-b pb-3">
            <p>
              <strong>Qualification:</strong> {a.qualification}
            </p>
            <p>
              <strong>Board/University:</strong> {a.boardUniversity}
            </p>
            <p>
              <strong>Institution:</strong> {a.institution}
            </p>
            <p>
              <strong>Passed Year:</strong> {a.passedYear}
            </p>
            <p>
              <strong>GPA / Division:</strong> {a.divisionGPA}
            </p>
          </div>
        ))}
      </section>

      {/* Files */}
      <section className="border p-4 rounded bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Uploaded Files</h2>

        {student.files?.map((f, i) => (
          <p key={i}>
            <a
              href={`https://localhost:7074${f.filePath}`}
              target="_blank"
              className="text-blue-600 underline"
            >
              {f.fileType}
            </a>
          </p>
        ))}
      </section>

      {/* Awards */}
      <section className="border p-4 rounded bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Awards</h2>

        {student.awards?.map((a, i) => (
          <div key={i} className="mb-4 border-b pb-3">
            <p>
              <strong>Title:</strong> {a.titleOfAward}
            </p>
            <p>
              <strong>Organization:</strong> {a.issuingOrganization}
            </p>
            <p>
              <strong>Year:</strong> {a.yearReceived}
            </p>
            {a.certificatePath && (
              <a
                href={`https://localhost:7074${a.certificatePath}`}
                target="_blank"
                className="text-blue-600 underline"
              >
                View Certificate
              </a>
            )}
          </div>
        ))}
      </section>

      {/* Extracurricular */}
      <section className="border p-4 rounded bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">
          Extracurricular Activities
        </h2>

        <p>{student.extracurricularInterests}</p>
      </section>

      {/* Declaration */}
      <section className="border p-4 rounded bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Declaration</h2>

        <p>
          <strong>Place:</strong> {student.place}
        </p>

        <p>
          <strong>Accepted:</strong>{" "}
          {student.declarationAccepted ? "Yes" : "No"}
        </p>
      </section>

      <div>
        <Link
          to={`/students/edit/${student.studentId}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Edit Student
        </Link>
      </div>
    </div>
  );
};

export default StudentDetail;

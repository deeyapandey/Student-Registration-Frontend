import { z } from "zod";
import {
  GenderType,
  ResidenceType,
  TransportationType,
  FeeCategoryType,
  AddressTypeEnum,
  ParentTypeEnum,
  AcademicStatusType,
} from "../constants/enums";

// -------- ADDRESS --------
export const addressSchema = z.object({
  AddressType: z.nativeEnum(AddressTypeEnum),
  ProvinceId: z.number().min(1, "Province is required"),
  DistrictId: z.number().min(1, "District is required"),
  MunicipalityId: z.number().min(1, "Municipality is required"),
  WardNumber: z.string().min(1, "Ward number is required"),
  Street: z.string().optional(),
  HouseNumber: z.string().optional(),
});

// -------- PARENTS --------
export const parentSchema = z.object({
  ParentType: z.nativeEnum(ParentTypeEnum),
  FullName: z.string().min(1),
  MobileNumber: z.string().min(1),
  Occupation: z.string().optional(),
  Designation: z.string().optional(),
  Organization: z.string().optional(),
  Email: z.string().email().optional(),
  Relation: z.string().optional(),
});

// -------- ACADEMIC HISTORY --------
export const academicHistorySchema = z.object({
  Qualification: z.string().min(1),
  BoardUniversity: z.string().min(1),
  Institution: z.string().min(1),
  PassedYear: z.number().min(1900),
  DivisionGPA: z.string().min(1),
});

// -------- ENROLLMENT --------
export const enrollmentSchema = z.object({
  Faculty: z.string().min(1),
  Program: z.string().min(1),
  CourseLevel: z.string().min(1),
  AcademicYear: z.string().min(1),
  SemesterClass: z.string().min(1),
  Section: z.string().optional(),
  RollNumber: z.string().min(1),
  RegistrationNumber: z.string().min(1),
  EnrollDate: z.string(), // react sends string
  AcademicStatus: z.nativeEnum(AcademicStatusType),
});

// -------- FINANCIAL --------
export const financialSchema = z.object({
  FeeCategory: z.nativeEnum(FeeCategoryType),
  ScholarshipType: z.string().optional(),
  ScholarshipProvider: z.string().optional(),
  ScholarshipAmount: z.number().optional(),
  AccountHolderName: z.string().min(1),
  BankName: z.string().min(1),
  AccountNumber: z.string().min(1),
  Branch: z.string().min(1),
});

// -------- AWARDS --------
export const awardSchema = z.object({
  TitleOfAward: z.string().min(1),
  IssuingOrganization: z.string().optional(),
  YearReceived: z.number().optional(),
  CertificateFile: z.any().optional(),
});

// -------- FILE UPLOAD --------
export const fileSchema = z.object({
  FileType: z.string().min(1),
  File: z.any(), // must be FormData file
});

// -------- MAIN STUDENT SCHEMA --------
export const studentSchema = z.object({
  FirstName: z.string().min(1),
  MiddleName: z.string().optional(),
  LastName: z.string().min(1),

  DateOfBirth: z.string(), // string from form

  PlaceOfBirth: z.string().optional(),
  NationalityId: z.number().min(1),
  CitizenshipNumber: z.string().min(1),
  CitizenshipIssueDate: z.string(),
  CitizenshipIssueDistrict: z.string().min(1),

  Email: z.string().email(),
  AlternateEmail: z.string().email().optional(),
  PrimaryMobile: z.string().min(1),
  SecondaryMobile: z.string().optional(),

  EmergencyContactName: z.string().min(1),
  EmergencyContactRelation: z.string().min(1),
  EmergencyContactNumber: z.string().min(1),

  Gender: z.enum(GenderType),

  BloodGroupId: z.number().optional(),
  MaritalStatusId: z.number().optional(),

  Religion: z.string().optional(),
  EthnicityCaste: z.string().min(1),

  DisabilityStatusId: z.number().min(1),
  DisabilityTypeSpecify: z.string().optional(),
  DisabilityPercentage: z.number().optional(),

  AnnualFamilyIncome: z.string().optional(),

  ResidenceType: z.enum(ResidenceType),
  TransportationMethod: z.enum(TransportationType).optional(),

  ExtracurricularInterests: z.string().optional(),

  DeclarationAccepted: z
    .boolean()
    .refine((v) => v === true, "You must accept the declaration"),

  Place: z.string().min(1),

  Addresses: z.array(addressSchema),
  Parents: z.array(parentSchema),
  PreviousAcademics: z.array(academicHistorySchema),

  Enrollment: enrollmentSchema.optional(),
  Financial: financialSchema.optional(),
  Awards: z.array(awardSchema).optional(),
  Files: z.array(fileSchema).optional(),
});

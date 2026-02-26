import * as Yup from "yup";

export const employeeValidationSchema = Yup.object({
  // Basic Information
  employee_id: Yup.string()
    .nullable()
    .matches(
      /^[A-Z0-9-]+$/,
      "Employee ID must contain only uppercase letters, numbers, and hyphens",
    ),

  first_name: Yup.string()
    .required("First name is required")
    .max(191, "First name must be at most 191 characters"),

  last_name: Yup.string()
    .nullable()
    .max(191, "Last name must be at most 191 characters"),

  date_of_birth: Yup.date()
    .required("Date of birth is required")
    .max(new Date(Date.now() - 24 * 60 * 60 * 1000), "Date of birth must be in the past"),

  gender: Yup.string()
    .nullable()
    .oneOf(["male", "female", "other"], "Invalid gender selection"),

  // Contact Details
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format")
    .max(191, "Email must be at most 191 characters"),

  mobile_number: Yup.string()
    .required("Mobile number is required")
    .max(20, "Mobile number must be at most 20 characters"),

  address: Yup.string()
    .nullable()
    .max(500, "Address must be at most 500 characters"),

  // Official Details
  designation: Yup.string()
    .required("Designation is required")
    .max(191, "Designation must be at most 191 characters"),

  department: Yup.string()
    .required("Department is required")
    .max(191, "Department must be at most 191 characters"),

  reporting_manager_id: Yup.number()
    .nullable()
    .positive("Invalid reporting manager"),

  role: Yup.string()
    .nullable()
    .oneOf(
      ["admin", "manager", "supervisor", "employee"],
      "Invalid role selection",
    ),

  is_active: Yup.boolean(),

  // Profile Photo
  profile_photo_temp_id: Yup.string()
    .nullable()
    .matches(/^tmp_[a-zA-Z0-9]+_[0-9]+$/, "Invalid photo upload ID"),

  remove_profile_photo: Yup.boolean(),
});

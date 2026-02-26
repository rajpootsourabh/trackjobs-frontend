// Value-Label mappings for dropdowns
export const DESIGNATION_OPTIONS = [
  { value: "software_engineer", label: "Software Engineer" },
  { value: "senior_engineer", label: "Senior Engineer" },
  { value: "tech_lead", label: "Tech Lead" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
];

// Create a reverse mapping from label to value
export const DESIGNATION_LABEL_TO_VALUE = {
  "Software Engineer": "software_engineer",
  "Senior Engineer": "senior_engineer",
  "Tech Lead": "tech_lead",
  "Manager": "manager",
  "Director": "director",
};

// Create a mapping from value to label
export const DESIGNATION_VALUE_TO_LABEL = {
  "software_engineer": "Software Engineer",
  "senior_engineer": "Senior Engineer",
  "tech_lead": "Tech Lead",
  "manager": "Manager",
  "director": "Director",
};

export const DEPARTMENT_OPTIONS = [
  { value: "engineering", label: "Engineering" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
];

export const DEPARTMENT_LABEL_TO_VALUE = {
  "Engineering": "engineering",
  "Human Resources": "hr",
  "Finance": "finance",
  "Marketing": "marketing",
  "Sales": "sales",
};

export const DEPARTMENT_VALUE_TO_LABEL = {
  "engineering": "Engineering",
  "hr": "Human Resources",
  "finance": "Finance",
  "marketing": "Marketing",
  "sales": "Sales",
};

export const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "supervisor", label: "Supervisor" },
  { value: "employee", label: "Employee" },
];

export const ROLE_LABEL_TO_VALUE = {
  "Admin": "admin",
  "Manager": "manager",
  "Supervisor": "supervisor",
  "Employee": "employee",
};

export const ROLE_VALUE_TO_LABEL = {
  "admin": "Admin",
  "manager": "Manager",
  "supervisor": "Supervisor",
  "employee": "Employee",
};

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const INITIAL_EMPLOYEE_VALUES = {
  // Basic Information
  employee_id: "",
  first_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "female",

  // Contact Details
  email: "",
  mobile_number: "",
  address: "",

  // Official Details
  designation: "",
  department: "",
  reporting_manager_id: "",
  
  // Status
  is_active: true,
};
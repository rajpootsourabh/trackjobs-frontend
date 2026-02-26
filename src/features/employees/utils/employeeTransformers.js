/**
 * Transform API response to form format
 */
export const transformEmployeeFromApi = (apiData) => {
  if (!apiData) return null;

  return {
    id: apiData.id,
    vendor_id: apiData.vendor_id,
    employee_id: apiData.employee_id,
    first_name: apiData.first_name,
    last_name: apiData.last_name,
    date_of_birth: apiData.date_of_birth,
    gender: apiData.gender,
    email: apiData.email,
    mobile_number: apiData.mobile_number,
    address: apiData.address,
    designation: apiData.designation,
    department: apiData.department,
    reporting_manager_id: apiData.reporting_manager?.id || null,
    role: apiData.role,
    is_active: apiData.is_active,
    profile_photo: apiData.profile_photo,
    created_at: apiData.created_at,
    updated_at: apiData.updated_at,
    
    // For backward compatibility with form
    full_name: apiData.full_name,
    reporting_manager: apiData.reporting_manager,
    subordinates_count: apiData.subordinates_count,
  };
};

/**
 * Transform form data to API format
 */
export const transformEmployeeForApi = (formData) => {
  // Create a copy to avoid mutating original
  const apiData = { ...formData };

  // Remove fields that shouldn't be sent to API
  delete apiData.id;
  delete apiData.full_name;
  delete apiData.reporting_manager;
  delete apiData.subordinates_count;
  delete apiData.created_at;
  delete apiData.updated_at;
  delete apiData.profile_photo;

  // Handle null values for reporting_manager_id
  if (apiData.reporting_manager_id === "") {
    apiData.reporting_manager_id = null;
  }

  // Remove empty strings
  Object.keys(apiData).forEach(key => {
    if (apiData[key] === "") {
      apiData[key] = null;
    }
  });

  return apiData;
};
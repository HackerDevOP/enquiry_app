export const API_URL = {
  BASE: 'https://api.freeprojectapi.com/api/Enquiry',
};

export const API_ENDPOINTS = {
  Filter_Enquiry: '/filter-enquiries',
  Get_Enquiry: '/get-enquiries/',
  Create_Enquiry: '/create-enquiry/',
  Update_Enquiry: '/update-enquiry/',
  Delete_Enquiry: '/delete-enquiry/',
  Get_Category: '/get-categories/',
  Create_Category: '/create-category/',
  Update_Category: '/update-category/',
  Delete_Category: '/delete-category/',
  Get_Status: '/get-statuses/',
  Create_Status: '/create-status/',
  Update_Status: '/update-status/',
  Delete_Status: '/delete-status/',
};

export const ToastMessages = {
  // Create / Insert
  CREATE_SUCCESS: 'created successfully!',
  // Update / Edit
  UPDATE_SUCCESS: 'updated successfully!',
  // Delete
  DELETE_SUCCESS: 'deleted successfully!',
  // Validation / Form Submission
  INVALID_FORM: 'Please fix the highlighted errors before submitting.',
  REQUIRED_FIELDS: 'Please fill in all required fields.',

  // General API & Network Errors
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  NETWORK_ERROR: 'Network connection failed. Check your internet connection.',
  UNAUTHORIZED: 'Session expired or unauthorized. Please log in again.',
};

export const MESSAGES = {
  Success: 'Success! Your enquiry has been submitted. Reference ID:',
  Form_Validation: 'Please enter a brief description of your enquiry before submitting.',
  Invalid: 'Invalid form submit.',
};

export const BRAND = {
  Name: 'Nqiry',
};

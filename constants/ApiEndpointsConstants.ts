export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/v1.0"
    : "https://rental-portal-managment-backend.vercel.app/api/v1.0";

// export const API_BASE_URL = "http://localhost:5000/api/v1.0";
// export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKENT_API_BASE_URL;

// export const API_BASE_URL =
//   "https://rental-portal-managment-backend.vercel.app/api/v1.0";

export const API_ENDPOINTS = {
  USER: {
    register: `${API_BASE_URL}/users/register`,
    login: `${API_BASE_URL}/users/login`,
    service_requests: `${API_BASE_URL}/service-requests`,
  },
  ADMIN: {
    properties: `${API_BASE_URL}/admin/properties`,
    setTenantPassword: `${API_BASE_URL}/users/set-password`,
  },
};

// ADMIN: {
//     property: `${API_BASE_URL}/admin/property`,
//     singleProperty: (id: string) => `${API_BASE_URL}/admin/property/${id}`,
//   },

import { loadConfig } from "../core/utils/configLoader";

const config = await loadConfig();
const BASE_URL = config.APIBaseUrl;
const AUTH_BASE_URL = config.firebase.authDomain;

export const api = {
  BASE_URL: BASE_URL,
  AUTH_BASE_URL: AUTH_BASE_URL,
  CATEGORY_ENDPOINT: "/api/categories",
  PROPERTIES_ENDPOINT: "/api/properties",
  PROPERTIES_IMG_ENDPOINT: "/api/property-images",
  PROPERTYSPEC_ENDPOINT: "/api/property-specs",
  SPECIFICATION_ENDPOINT: "/api/specifications",
  BOOKING_ENDPOINT: "/api/bookings",
  CALENDAR_ENDPOINT: "/api/calendar",

  CLIENT_ENDPOINT: "http://127.0.0.1:8000/api/payments",
};

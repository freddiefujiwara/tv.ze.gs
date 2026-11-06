export const DATA_API_DELAY_MS = 200;
import { CONFIG } from "./config.js";

// The home server base URL and the device LAN addresses are build-time
// configuration (see config.js); they are not written in this repository.
export const API_BASE_URL = CONFIG.API_BASE_URL;
export const DEVICE_HOSTS = CONFIG.DEVICE_HOSTS;

export const ERROR_MESSAGES = {
  EXEC_COMMANDS: "Failed to execute data-api commands",
  PARSE_DATA_API: "Failed to parse data-api payload",
  INVALID_DATA_API: "Invalid data-api payload",
};

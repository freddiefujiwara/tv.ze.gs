// tv frontend configuration.
//
// API_BASE_URL, DEVICE_HOSTS and SWITCHBOT_DEVICES are NOT written in
// this repository. They name the home server, the LAN addresses of
// the home devices and the SwitchBot device IDs, so they are provided
// at build time from GitHub Secrets through Vite environment
// variables:
//   VITE_API_BASE_URL      the home server base URL
//   VITE_DEVICE_HOSTS      the device host map as a JSON string,
//                          e.g. {"nest":"...","tatami":"...","tv":"..."}
//   VITE_SWITCHBOT_DEVICES the SwitchBot device id map as a JSON
//                          string, keyed by the names used in the
//                          `device:<name>` tokens in App.vue
// For local development, put the same variables in .env.local
// (git-ignored). Tests use dummy values from .env.test.

export function parseDeviceHosts(raw) {
  try {
    const parsed = JSON.parse(raw || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

export function buildConfig(env = import.meta.env) {
  return {
    API_BASE_URL: env.VITE_API_BASE_URL || "",
    DEVICE_HOSTS: parseDeviceHosts(env.VITE_DEVICE_HOSTS),
    SWITCHBOT_DEVICES: parseDeviceHosts(env.VITE_SWITCHBOT_DEVICES),
  };
}

export const CONFIG = buildConfig();

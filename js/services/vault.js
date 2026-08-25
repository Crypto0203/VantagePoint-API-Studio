/* VantagePoint API Studio — Local API Key Vault (Safe & Secure LocalStorage) */

export const VAULT_KEYS_CONFIG = [
  { id: "GEMINI_API_KEY", name: "Google Gemini AI", placeholder: "AIzaSy...", desc: "Free tier available at aistudio.google.com" },
  { id: "NASA_API_KEY", name: "NASA Open API (Demo Included)", placeholder: "DEMO_KEY (Preloaded)", desc: "Preloaded with DEMO_KEY" },
  { id: "OPENWEATHER_API_KEY", name: "OpenWeatherMap", placeholder: "32-char hex key", desc: "Free key at openweathermap.org" },
  { id: "TMDB_API_KEY", name: "The Movie DB (TMDB)", placeholder: "v3 API Key", desc: "Free key at themoviedb.org" },
  { id: "ALPHAVANTAGE_API_KEY", name: "Alpha Vantage (Stocks)", placeholder: "Free token", desc: "Free key at alphavantage.co" },
  { id: "GROQ_API_KEY", name: "Groq Cloud AI (LPU)", placeholder: "gsk_...", desc: "Free fast AI key at console.groq.com" },
  { id: "HUGGINGFACE_API_KEY", name: "Hugging Face", placeholder: "hf_...", desc: "User access token at huggingface.co" }
];

export class ApiVault {
  constructor() {
    this.storageKey = "vantagepoint_api_vault_keys";
    this.memoryStore = { "NASA_API_KEY": "DEMO_KEY" };
    if (!this.getKey("NASA_API_KEY")) {
      this.saveKey("NASA_API_KEY", "DEMO_KEY");
    }
  }

  getAllKeys() {
    try {
      if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function') {
        return this.memoryStore || {};
      }
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : (this.memoryStore || {});
    } catch (e) {
      return this.memoryStore || {};
    }
  }

  getKey(id) {
    const keys = this.getAllKeys();
    return keys[id] || (this.memoryStore ? this.memoryStore[id] : "") || "";
  }

  saveKey(id, value) {
    const keys = this.getAllKeys();
    keys[id] = (value || "").trim();
    if (this.memoryStore) this.memoryStore[id] = (value || "").trim();
    try {
      if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
        localStorage.setItem(this.storageKey, JSON.stringify(keys));
      }
    } catch (e) {}
  }

  removeKey(id) {
    const keys = this.getAllKeys();
    delete keys[id];
    if (this.memoryStore) delete this.memoryStore[id];
    try {
      if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
        localStorage.setItem(this.storageKey, JSON.stringify(keys));
      }
    } catch (e) {}
  }

  clearVault() {
    this.memoryStore = {};
    try {
      if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
        localStorage.removeItem(this.storageKey);
      }
    } catch (e) {}
  }
}

export const vault = new ApiVault();

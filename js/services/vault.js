/* OmniAPI Studio - Local API Key Vault (Safe & Secure LocalStorage) */

export const VAULT_KEYS_CONFIG = [
  { id: "GEMINI_API_KEY", name: "Google Gemini AI", placeholder: "AIzaSy...", desc: "Free tier available at aistudio.google.com" },
  { id: "OPENWEATHER_API_KEY", name: "OpenWeatherMap", placeholder: "32-char hex key", desc: "Free key at openweathermap.org" },
  { id: "TMDB_API_KEY", name: "The Movie DB (TMDB)", placeholder: "v3 API Key", desc: "Free key at themoviedb.org" },
  { id: "ALPHAVANTAGE_API_KEY", name: "Alpha Vantage (Stocks)", placeholder: "Free token", desc: "Free key at alphavantage.co" },
  { id: "GROQ_API_KEY", name: "Groq Cloud AI (LPU)", placeholder: "gsk_...", desc: "Free fast AI key at console.groq.com" },
  { id: "HUGGINGFACE_API_KEY", name: "Hugging Face", placeholder: "hf_...", desc: "User access token at huggingface.co" }
];

export class ApiVault {
  constructor() {
    this.storageKey = "omni_api_vault_keys";
  }

  getAllKeys() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error("Failed to load vault keys", e);
      return {};
    }
  }

  getKey(id) {
    const keys = this.getAllKeys();
    return keys[id] || "";
  }

  saveKey(id, value) {
    const keys = this.getAllKeys();
    keys[id] = value.trim();
    localStorage.setItem(this.storageKey, JSON.stringify(keys));
  }

  removeKey(id) {
    const keys = this.getAllKeys();
    delete keys[id];
    localStorage.setItem(this.storageKey, JSON.stringify(keys));
  }

  clearVault() {
    localStorage.removeItem(this.storageKey);
  }
}

export const vault = new ApiVault();

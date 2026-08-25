/* OmniAPI Studio - Main Application Orchestrator & State Engine */

import { POPULAR_CATEGORIES, CURATED_INTERACTIVE_APIS, GITHUB_MEGA_DIRECTORY } from './data/public_apis.js';
import { ApiRunner } from './services/api_runner.js';
import { SmartVisualizer } from './services/visualizer.js';
import { CodeGenerator } from './services/codegen.js';
import { vault, VAULT_KEYS_CONFIG } from './services/vault.js';

class OmniApp {
  constructor() {
    this.currentView = "studio"; // "studio" | "directory" | "custom"
    this.selectedApi = CURATED_INTERACTIVE_APIS[0];
    this.activeCategory = "All";
    this.outputMode = "visual"; // "visual" | "json"
    this.activeCodeLang = "pythonRequests";
    this.lastResponse = null;
    this.searchQuery = "";
    this.githubApis = [...GITHUB_MEGA_DIRECTORY];

    this.init();
  }

  init() {
    this.renderCategorySidebar();
    this.renderStudioApiDropdown();
    this.loadStudioForm(this.selectedApi);
    this.renderDirectoryGrid();
    this.setupEventListeners();
    this.updateVaultButtonBadge();

    // Auto-run first API on launch for instant preview
    setTimeout(() => {
      this.executeActiveStudioApi();
    }, 400);
  }

  setupEventListeners() {
    // Top Search Bar
    const searchInput = document.getElementById("main-search-input");
    searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      if (this.currentView !== "directory") {
        this.switchView("directory");
      }
      this.renderDirectoryGrid();
    });

    // View Switcher Tabs
    document.querySelectorAll(".view-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        this.switchView(view);
      });
    });

    // Output Mode Toggle (Visual vs Raw JSON)
    document.querySelectorAll(".toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".toggle-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.outputMode = btn.dataset.mode;
        this.renderOutputDisplay();
      });
    });

    // Code Language Selector Tabs
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeCodeLang = btn.dataset.lang;
        this.updateCodeDisplay();
      });
    });

    // Execute Button in Studio
    document.getElementById("btn-run-api").addEventListener("click", () => {
      this.executeActiveStudioApi();
    });

    // API Selector Dropdown change
    document.getElementById("studio-api-select").addEventListener("change", (e) => {
      const apiId = e.target.value;
      const found = CURATED_INTERACTIVE_APIS.find(a => a.id === apiId);
      if (found) {
        this.selectedApi = found;
        this.loadStudioForm(found);
        this.executeActiveStudioApi();
      }
    });

    // Copy Code Button
    document.getElementById("btn-copy-code-main").addEventListener("click", () => {
      const code = document.getElementById("code-display").innerText;
      navigator.clipboard.writeText(code);
      const btn = document.getElementById("btn-copy-code-main");
      btn.innerText = "✓ Copied!";
      setTimeout(() => btn.innerText = "Copy Code", 1500);
    });

    // API Vault Modal Open / Close
    document.getElementById("open-vault-btn").addEventListener("click", () => {
      this.openVaultModal();
    });
    document.getElementById("close-vault-btn").addEventListener("click", () => {
      this.closeVaultModal();
    });

    // Close modal on backdrop click
    document.getElementById("vault-modal").addEventListener("click", (e) => {
      if (e.target.id === "vault-modal") this.closeVaultModal();
    });
  }

  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll(".view-tab-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.view === viewName);
    });

    const studioSection = document.getElementById("section-studio");
    const directorySection = document.getElementById("section-directory");

    if (viewName === "studio") {
      studioSection.style.display = "grid";
      directorySection.style.display = "none";
    } else {
      studioSection.style.display = "none";
      directorySection.style.display = "block";
      this.renderDirectoryGrid();
    }
  }

  renderCategorySidebar() {
    const list = document.getElementById("sidebar-cat-list");
    list.innerHTML = "";

    POPULAR_CATEGORIES.forEach(cat => {
      let count = 0;
      if (cat === "All") {
        count = GITHUB_MEGA_DIRECTORY.length;
      } else {
        count = GITHUB_MEGA_DIRECTORY.filter(a => a.cat.toLowerCase().includes(cat.toLowerCase())).length;
      }

      const btn = document.createElement("button");
      btn.className = `sidebar-btn ${this.activeCategory === cat ? 'active' : ''}`;
      btn.innerHTML = `
        <div class="sidebar-btn-left">
          <span>${this.getCategoryIcon(cat)}</span>
          <span>${cat}</span>
        </div>
        <span class="cat-count">${count}</span>
      `;

      btn.addEventListener("click", () => {
        this.activeCategory = cat;
        document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        if (this.currentView !== "directory") {
          this.switchView("directory");
        }
        this.renderDirectoryGrid();
      });

      list.appendChild(btn);
    });
  }

  getCategoryIcon(cat) {
    switch (cat) {
      case "All": return "🌐";
      case "Cryptocurrency": return "💰";
      case "Weather": return "🌦️";
      case "Artificial Intelligence": return "🤖";
      case "Finance & Currency": return "📈";
      case "Entertainment & Movies": return "🎬";
      case "Books & Education": return "📚";
      case "Development & Tools": return "🛠️";
      case "Science & Math": return "🧬";
      case "Transportation & Flights": return "✈️";
      case "News & Media": return "📰";
      case "Food & Drink": return "🍔";
      case "Gaming & Anime": return "🎮";
      case "Social & Quotes": return "💡";
      case "Security & Geolocation": return "🛡️";
      default: return "⚡";
    }
  }

  renderStudioApiDropdown() {
    const select = document.getElementById("studio-api-select");
    select.innerHTML = "";
    CURATED_INTERACTIVE_APIS.forEach(api => {
      const opt = document.createElement("option");
      opt.value = api.id;
      opt.innerText = `${api.name} (${api.category})`;
      select.appendChild(opt);
    });
  }

  loadStudioForm(api) {
    document.getElementById("studio-api-title").innerText = api.name;
    document.getElementById("studio-api-desc").innerText = api.description;
    document.getElementById("studio-api-select").value = api.id;

    const container = document.getElementById("studio-params-container");
    container.innerHTML = "";

    // Render Form Parameters
    if (api.params.length === 0) {
      container.innerHTML = `<div style="font-size:12.5px; color:var(--text-dim);">No parameters required for this endpoint. Click "Run Live API" below!</div>`;
    } else {
      api.params.forEach(p => {
        if (p.type === "hidden") return;
        const group = document.createElement("div");
        group.className = "param-group";
        
        let inputHtml = "";
        if (p.type === "select") {
          const opts = p.options.map(o => `<option value="${o}" ${o === p.default ? 'selected' : ''}>${o}</option>`).join("");
          inputHtml = `<select class="param-select" data-param="${p.name}">${opts}</select>`;
        } else if (p.type === "textarea") {
          inputHtml = `<textarea class="param-textarea" data-param="${p.name}">${p.default || ''}</textarea>`;
        } else {
          inputHtml = `<input type="${p.type || 'text'}" class="param-input" data-param="${p.name}" value="${p.default || ''}">`;
        }

        group.innerHTML = `
          <label class="param-label">${p.label || p.name}</label>
          ${inputHtml}
        `;
        container.appendChild(group);
      });
    }

    // Render Quick Presets if available
    if (api.presets && api.presets.length > 0) {
      const presetGroup = document.createElement("div");
      presetGroup.className = "param-group";
      presetGroup.innerHTML = `<label class="param-label">Quick City Presets:</label><div class="presets-container"></div>`;
      const chipsContainer = presetGroup.querySelector(".presets-container");

      api.presets.forEach(pr => {
        const chip = document.createElement("button");
        chip.className = "preset-chip";
        chip.innerText = pr.name;
        chip.addEventListener("click", () => {
          const latInput = container.querySelector('[data-param="latitude"]');
          const lonInput = container.querySelector('[data-param="longitude"]');
          if (latInput && lonInput) {
            latInput.value = pr.lat;
            lonInput.value = pr.lon;
            this.executeActiveStudioApi();
          }
        });
        chipsContainer.appendChild(chip);
      });
      container.appendChild(presetGroup);
    }
  }

  async executeActiveStudioApi() {
    const api = this.selectedApi;
    const executeBtn = document.getElementById("btn-run-api");
    executeBtn.innerHTML = `<span>⏳ Running API...</span>`;
    executeBtn.disabled = true;

    // Collect Parameters
    let queryParams = new URLSearchParams();
    let body = null;
    let headers = {};

    document.querySelectorAll("#studio-params-container [data-param]").forEach(el => {
      const name = el.dataset.param;
      const val = el.value;
      if (api.method === "GET") {
        queryParams.append(name, val);
      } else if (api.method === "POST") {
        if (name === "prompt" && api.id === "gemini-ai-studio") {
          body = {
            contents: [{ parts: [{ text: val }] }]
          };
        }
      }
    });

    // Handle Vault Key Injections
    let finalUrl = api.endpoint;
    if (api.requiresVaultKey) {
      const key = vault.getKey(api.requiresVaultKey);
      if (key) {
        if (api.id === "gemini-ai-studio") {
          finalUrl += `?key=${key}`;
        }
      } else if (api.id === "gemini-ai-studio") {
        // Safe demo fallback
        alert("Tip: Add your free Google Gemini API Key in the API Key Vault for custom live AI queries!");
      }
    }

    if (api.method === "GET" && queryParams.toString()) {
      finalUrl += (finalUrl.includes("?") ? "&" : "?") + queryParams.toString();
    }

    // Execute Request
    const result = await ApiRunner.execute({
      method: api.method,
      url: finalUrl,
      headers: headers,
      body: body
    });

    this.lastResponse = result;
    executeBtn.innerHTML = `<span>⚡ Run Live API</span>`;
    executeBtn.disabled = false;

    // Update Status Bar
    document.getElementById("status-method").innerText = result.method;
    const statusBadge = document.getElementById("status-code");
    statusBadge.innerText = `${result.status} ${result.statusText}`;
    statusBadge.className = `http-status-badge ${result.success ? 'success' : 'error'}`;
    document.getElementById("status-latency").innerText = `⏱️ ${result.latency} ms`;

    // Render Visuals & Code
    this.renderOutputDisplay();
    this.updateCodeDisplay();
  }

  renderOutputDisplay() {
    const visualCanvas = document.getElementById("visual-canvas");
    if (!this.lastResponse) return;

    if (this.outputMode === "visual") {
      visualCanvas.innerHTML = SmartVisualizer.render(this.selectedApi.visualType, this.lastResponse.data);
    } else {
      visualCanvas.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <span style="font-size:12px; color:var(--accent-cyan); font-family:var(--font-mono);">RAW JSON RESPONSE</span>
          <button class="btn-copy-code" onclick="navigator.clipboard.writeText(document.getElementById('raw-json-pre').innerText); alert('Copied JSON!');">Copy JSON</button>
        </div>
        <pre id="raw-json-pre" style="font-family:var(--font-mono); font-size:12.5px; color:#a5f3fc; overflow-x:auto; max-height:400px; line-height:1.5;">${JSON.stringify(this.lastResponse.data, null, 2)}</pre>
      `;
    }
  }

  updateCodeDisplay() {
    if (!this.lastResponse) return;
    const codes = CodeGenerator.generate(
      this.selectedApi.method,
      this.lastResponse.url,
      this.lastResponse.headers,
      null
    );
    const codeArea = document.getElementById("code-display");
    codeArea.innerText = codes[this.activeCodeLang] || codes.pythonRequests;
  }

  renderDirectoryGrid() {
    const grid = document.getElementById("mega-directory-grid");
    grid.innerHTML = "";

    let list = GITHUB_MEGA_DIRECTORY;

    // Filter by Category
    if (this.activeCategory !== "All") {
      list = list.filter(a => a.cat.toLowerCase().includes(this.activeCategory.toLowerCase()));
    }

    // Filter by Search Query
    if (this.searchQuery) {
      list = list.filter(a => 
        a.name.toLowerCase().includes(this.searchQuery) ||
        a.desc.toLowerCase().includes(this.searchQuery) ||
        a.cat.toLowerCase().includes(this.searchQuery)
      );
    }

    document.getElementById("dir-count-tag").innerText = `${list.length} Public APIs Found`;

    if (list.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;">No public APIs matched "${this.searchQuery}". Try another keyword!</div>`;
      return;
    }

    list.forEach(api => {
      const isFree = api.auth === "null" || api.auth === "No Auth";
      const card = document.createElement("div");
      card.className = "api-card";
      card.innerHTML = `
        <div>
          <div class="api-card-top">
            <div class="api-name">${api.name}</div>
            <div class="api-cat-tag">${api.cat}</div>
          </div>
          <p class="api-desc">${api.desc}</p>
        </div>

        <div>
          <div class="api-meta-badges">
            <span class="meta-badge ${isFree ? 'free' : 'key'}">${isFree ? '✓ 100% Free' : '🔑 ' + api.auth}</span>
            <span class="meta-badge">CORS: ${api.cors}</span>
            <span class="meta-badge">${api.https ? '🔒 HTTPS' : 'HTTP'}</span>
          </div>

          <div class="api-card-actions">
            <a href="${api.url}" target="_blank" class="btn-card-action">Docs ↗</a>
            <button class="btn-card-action btn-try-dir" data-name="${api.name}">⚡ Try in Studio</button>
          </div>
        </div>
      `;

      card.querySelector(".btn-try-dir").addEventListener("click", () => {
        // If matched with a curated interactive api, load it
        const matched = CURATED_INTERACTIVE_APIS.find(c => c.name.toLowerCase().includes(api.name.toLowerCase()) || api.name.toLowerCase().includes(c.name.toLowerCase()));
        if (matched) {
          this.selectedApi = matched;
          this.loadStudioForm(matched);
        } else {
          // Load generic test
          this.selectedApi = {
            id: "custom-" + api.name.toLowerCase().replace(/\s+/g, '-'),
            name: api.name,
            category: api.cat,
            description: api.desc,
            method: "GET",
            endpoint: api.url,
            params: [],
            visualType: "generic"
          };
          this.loadStudioForm(this.selectedApi);
        }
        this.switchView("studio");
        this.executeActiveStudioApi();
      });

      grid.appendChild(card);
    });
  }

  openVaultModal() {
    const modal = document.getElementById("vault-modal");
    const container = document.getElementById("vault-items-list");
    container.innerHTML = "";

    const savedKeys = vault.getAllKeys();

    VAULT_KEYS_CONFIG.forEach(cfg => {
      const currentVal = savedKeys[cfg.id] || "";
      const item = document.createElement("div");
      item.className = "vault-item-card";
      item.innerHTML = `
        <div class="vault-item-header">
          <div>
            <div class="vault-key-name">${cfg.name}</div>
            <div class="vault-key-desc">${cfg.desc}</div>
          </div>
          <span style="font-size:11px; color:${currentVal ? 'var(--accent-green)' : 'var(--text-dim)'}">
            ${currentVal ? '● Key Saved' : '○ Not Set'}
          </span>
        </div>
        <div class="vault-key-input-row">
          <input type="password" class="vault-input" id="input-vault-${cfg.id}" placeholder="${cfg.placeholder}" value="${currentVal}">
          <button class="vault-save-btn" data-keyid="${cfg.id}">Save</button>
        </div>
      `;

      item.querySelector(".vault-save-btn").addEventListener("click", (e) => {
        const keyId = e.target.dataset.keyid;
        const val = document.getElementById(`input-vault-${keyId}`).value;
        vault.saveKey(keyId, val);
        e.target.innerText = "✓ Saved";
        setTimeout(() => e.target.innerText = "Save", 1500);
        this.updateVaultButtonBadge();
      });

      container.appendChild(item);
    });

    modal.classList.add("open");
  }

  closeVaultModal() {
    document.getElementById("vault-modal").classList.remove("open");
  }

  updateVaultButtonBadge() {
    const keys = vault.getAllKeys();
    const count = Object.keys(keys).filter(k => keys[k]).length;
    document.getElementById("vault-btn-badge").innerText = `${count} Keys Active`;
  }
}

// Boot application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new OmniApp();
});

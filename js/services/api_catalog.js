/* VantagePoint API Studio — Unified API Catalog Service (Phase 2B) */

export const API_STATUS = {
  VERIFIED: "VERIFIED",
  INTERACTIVE: "INTERACTIVE",
  NEEDS_CONFIGURATION: "NEEDS_CONFIGURATION",
  API_KEY_REQUIRED: "API_KEY_REQUIRED",
  BROWSER_RESTRICTED: "BROWSER_RESTRICTED",
  DOCUMENTATION_ONLY: "DOCUMENTATION_ONLY",
  UNVERIFIED: "UNVERIFIED",
  UNAVAILABLE: "UNAVAILABLE"
};

export class ApiCatalog {
  constructor(catalogData = [], registryData = []) {
    this.catalog = [];
    this.registryMap = new Map();
    this.categoryCounts = {};
    this.metrics = {
      totalCataloged: 0,
      totalInteractive: 0,
      totalVerified: 0,
      totalApiKeyRequired: 0,
      totalDocumentationOnly: 0,
      totalBrowserRestricted: 0
    };

    this.init(catalogData, registryData);
  }

  init(catalogData = [], registryData = []) {
    // Index Registry APIs by normalized name and ID
    this.registryMap.clear();
    registryData.forEach(reg => {
      if (reg.id) this.registryMap.set(reg.id.toLowerCase(), reg);
      if (reg.name) this.registryMap.set(this.normalize(reg.name), reg);
    });

    const seenIds = new Set();
    const merged = [];

    // 1. Process Executable Registry Entries first (Highest Priority)
    registryData.forEach(reg => {
      const id = reg.id.toLowerCase();
      seenIds.add(id);
      seenIds.add(this.normalize(reg.name));

      merged.push({
        id: reg.id,
        name: reg.name,
        category: reg.category || "General",
        description: reg.description || "Interactive Public API Sandbox",
        link: reg.documentation || reg.baseUrl,
        auth: reg.execution && reg.execution.authentication && reg.execution.authentication.type !== 'none' ? 'API Key' : 'No Auth',
        cors: reg.execution ? reg.execution.cors : 'yes',
        https: reg.baseUrl ? reg.baseUrl.startsWith('https') : true,
        isExecutable: true,
        status: reg.status && reg.status.verification === 'verified' ? API_STATUS.VERIFIED : API_STATUS.INTERACTIVE,
        executionConfig: reg.execution,
        responseConfig: reg.response,
        baseUrl: reg.baseUrl,
        documentation: reg.documentation
      });
    });

    // 2. Process Catalog Discovery Entries
    catalogData.forEach((cat, idx) => {
      const normName = this.normalize(cat.API || `api-${idx}`);
      if (this.registryMap.has(normName)) {
        // Already merged with registry definition
        return;
      }

      const generatedId = "cat-" + normName.replace(/[^a-z0-9]/g, '-').slice(0, 30);
      if (seenIds.has(generatedId)) return;
      seenIds.add(generatedId);

      const hasAuth = cat.Auth && cat.Auth !== 'No Auth' && cat.Auth !== 'No' && cat.Auth !== 'null' && cat.Auth !== '';
      const isCorsNo = cat.Cors && cat.Cors.toLowerCase() === 'no';

      let status = API_STATUS.DOCUMENTATION_ONLY;
      if (hasAuth) {
        status = API_STATUS.API_KEY_REQUIRED;
      } else if (isCorsNo) {
        status = API_STATUS.BROWSER_RESTRICTED;
      }

      merged.push({
        id: generatedId,
        name: cat.API || "Unnamed API",
        category: cat.Category || "Other",
        description: cat.Description || "Public REST API documentation entry.",
        link: cat.Link || "#",
        auth: hasAuth ? cat.Auth : "No Auth",
        cors: cat.Cors || "unknown",
        https: cat.HTTPS !== false,
        isExecutable: false,
        status: status,
        executionConfig: null,
        responseConfig: null,
        baseUrl: cat.Link || "",
        documentation: cat.Link || ""
      });
    });

    this.catalog = merged;
    this.computeMetricsAndCategories();
  }

  normalize(str) {
    return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  computeMetricsAndCategories() {
    this.categoryCounts = { "All": this.catalog.length };
    this.metrics = {
      totalCataloged: this.catalog.length,
      totalInteractive: 0,
      totalVerified: 0,
      totalApiKeyRequired: 0,
      totalDocumentationOnly: 0,
      totalBrowserRestricted: 0
    };

    this.catalog.forEach(item => {
      // Category count
      const cat = item.category || "Other";
      this.categoryCounts[cat] = (this.categoryCounts[cat] || 0) + 1;

      // Status metrics
      if (item.isExecutable) {
        this.metrics.totalInteractive++;
        if (item.status === API_STATUS.VERIFIED) this.metrics.totalVerified++;
      } else {
        if (item.status === API_STATUS.API_KEY_REQUIRED) {
          this.metrics.totalApiKeyRequired++;
        } else if (item.status === API_STATUS.BROWSER_RESTRICTED) {
          this.metrics.totalBrowserRestricted++;
        } else {
          this.metrics.totalDocumentationOnly++;
        }
      }
    });
  }

  getAll() {
    return this.catalog;
  }

  getById(id) {
    if (!id) return null;
    const lower = id.toLowerCase();
    return this.catalog.find(a => a.id.toLowerCase() === lower) || null;
  }

  getMetrics() {
    return this.metrics;
  }

  getCategories() {
    const cats = Object.keys(this.categoryCounts).filter(c => c !== "All").sort();
    return ["All", ...cats];
  }

  getCategoryCount(cat) {
    return this.categoryCounts[cat] || 0;
  }

  search(options = {}) {
    const {
      query = "",
      category = "All",
      statusFilter = "all", // all, interactive, free, key, docs
      limit = 0
    } = options;

    const lowerQuery = query.toLowerCase().trim();

    let results = this.catalog;

    // Filter by Category
    if (category && category !== "All") {
      const lowerCat = category.toLowerCase();
      results = results.filter(a => a.category.toLowerCase() === lowerCat);
    }

    // Filter by Status / Auth Filter
    if (statusFilter === "interactive") {
      results = results.filter(a => a.isExecutable);
    } else if (statusFilter === "free") {
      results = results.filter(a => a.auth === "No Auth" || a.auth === "No" || a.auth === "null");
    } else if (statusFilter === "key") {
      results = results.filter(a => a.auth && a.auth !== "No Auth" && a.auth !== "No" && a.auth !== "null");
    } else if (statusFilter === "docs") {
      results = results.filter(a => !a.isExecutable);
    }

    // Filter by Query
    if (lowerQuery) {
      results = results.filter(a =>
        a.name.toLowerCase().includes(lowerQuery) ||
        a.description.toLowerCase().includes(lowerQuery) ||
        a.category.toLowerCase().includes(lowerQuery) ||
        a.auth.toLowerCase().includes(lowerQuery) ||
        a.link.toLowerCase().includes(lowerQuery)
      );
    }

    if (limit > 0) {
      return results.slice(0, limit);
    }

    return results;
  }
}

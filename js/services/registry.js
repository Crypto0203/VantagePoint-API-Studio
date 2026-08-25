/* VantagePoint API Studio — API Registry Service & Validator (Phase 2) */

export class ApiRegistry {
  constructor(registryData = []) {
    this.registry = registryData;
    this.idIndex = new Map();
    this.nameIndex = new Map();
    this.categoryIndex = new Map();
    this.index();
  }

  index() {
    this.idIndex.clear();
    this.nameIndex.clear();
    this.categoryIndex.clear();

    this.registry.forEach(api => {
      if (api.id) this.idIndex.set(api.id.toLowerCase(), api);
      if (api.name) this.nameIndex.set(api.name.toLowerCase(), api);
      if (api.category) {
        const cat = api.category.toLowerCase();
        if (!this.categoryIndex.has(cat)) {
          this.categoryIndex.set(cat, []);
        }
        this.categoryIndex.get(cat).push(api);
      }
    });
  }

  load(registryData) {
    this.registry = registryData || [];
    this.index();
  }

  getAll() {
    return this.registry;
  }

  getById(id) {
    if (!id) return null;
    return this.idIndex.get(id.toLowerCase()) || null;
  }

  findByName(name) {
    if (!name) return null;
    const lower = name.toLowerCase();
    if (this.nameIndex.has(lower)) return this.nameIndex.get(lower);
    for (const api of this.registry) {
      if (api.name.toLowerCase().includes(lower) || lower.includes(api.name.toLowerCase())) {
        return api;
      }
    }
    return null;
  }

  getByCategory(category) {
    if (!category || category === "All") return this.registry;
    return this.categoryIndex.get(category.toLowerCase()) || [];
  }

  isExecutable(id) {
    const api = this.getById(id);
    return !!(api && api.execution && api.execution.enabled);
  }

  /**
   * Validates a single API definition against the Phase 2 schema.
   */
  static validateApiDefinition(api) {
    const errors = [];
    if (!api.id || typeof api.id !== 'string') errors.push("Missing or invalid 'id'");
    if (!api.name || typeof api.name !== 'string') errors.push("Missing or invalid 'name'");
    if (!api.baseUrl || !api.baseUrl.startsWith('http')) errors.push("Missing or invalid 'baseUrl'");
    
    if (!api.execution || typeof api.execution !== 'object') {
      errors.push("Missing 'execution' configuration object");
    } else {
      const exec = api.execution;
      const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
      if (!exec.method || !validMethods.includes(exec.method.toUpperCase())) {
        errors.push(`Invalid HTTP method: ${exec.method}`);
      }
      if (exec.endpoint === undefined || exec.endpoint === null) {
        errors.push("Missing execution 'endpoint'");
      }
      if (exec.parameters && Array.isArray(exec.parameters)) {
        const paramNames = new Set();
        exec.parameters.forEach((p, idx) => {
          if (!p.name) errors.push(`Parameter at index ${idx} missing name`);
          if (paramNames.has(p.name)) errors.push(`Duplicate parameter name '${p.name}'`);
          paramNames.add(p.name);
          const validLocations = ['query', 'path', 'header', 'body'];
          if (p.location && !validLocations.includes(p.location)) {
            errors.push(`Invalid location '${p.location}' for param '${p.name}'`);
          }
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates the entire registry dataset.
   */
  validateAll() {
    const results = [];
    this.registry.forEach(api => {
      const res = ApiRegistry.validateApiDefinition(api);
      if (!res.valid) {
        results.push({ id: api.id, name: api.name, errors: res.errors });
      }
    });
    return {
      valid: results.length === 0,
      total: this.registry.length,
      invalidCount: results.length,
      invalidEntries: results
    };
  }

  /**
   * Generates a normalized ApiRunner execution object by applying user inputs.
   */
  getExecutionConfig(id, userValues = {}) {
    const api = this.getById(id);
    if (!api || !api.execution) {
      throw new Error(`API definition '${id}' not found in registry.`);
    }

    const exec = api.execution;
    let endpoint = exec.endpoint || '';
    const query = {};
    const headers = { ...(exec.headers || {}) };
    let body = exec.body ? JSON.parse(JSON.stringify(exec.body)) : null;

    // Apply parameters based on location
    if (exec.parameters && Array.isArray(exec.parameters)) {
      exec.parameters.forEach(p => {
        const val = userValues[p.name] !== undefined ? userValues[p.name] : p.default;
        if (val !== undefined && val !== null && val !== '') {
          if (p.location === 'path') {
            endpoint = endpoint.replace(`{${p.name}}`, encodeURIComponent(String(val)));
          } else if (p.location === 'header') {
            headers[p.name] = String(val);
          } else if (p.location === 'body') {
            if (typeof body === 'object' && body !== null) {
              const bodyStr = JSON.stringify(body).replace(`{{${p.name}}}`, String(val));
              try { body = JSON.parse(bodyStr); } catch (e) { body = bodyStr; }
            }
          } else {
            // Default is query
            query[p.name] = String(val);
          }
        }
      });
    }

    // Build full URL
    let fullUrl = api.baseUrl;
    if (endpoint) {
      if (fullUrl.endsWith('/') && endpoint.startsWith('/')) {
        fullUrl += endpoint.slice(1);
      } else if (!fullUrl.endsWith('/') && !endpoint.startsWith('/')) {
        fullUrl += '/' + endpoint;
      } else {
        fullUrl += endpoint;
      }
    }

    return {
      id: api.id,
      name: api.name,
      method: (exec.method || 'GET').toUpperCase(),
      url: fullUrl,
      query,
      headers,
      body,
      auth: exec.authentication || { type: 'none' },
      timeoutMs: exec.timeoutMs || 12000,
      visualType: api.response ? (api.response.visualizer || 'generic') : 'generic'
    };
  }
}

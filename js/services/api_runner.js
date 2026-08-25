/* VantagePoint API Studio — Universal API Request Engine (Phase 1) */

import { vault } from './vault.js';

export class ApiRunner {
  /**
   * Safely builds URL by combining base URL and query parameters.
   * Preserves existing query params in the URL and safely encodes values.
   */
  static buildUrl(rawUrl, query = {}, auth = {}) {
    if (!rawUrl) throw new Error("URL is required");
    let urlObj;
    try {
      urlObj = new URL(rawUrl);
    } catch (e) {
      // If relative or incomplete, handle gracefully
      if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
        urlObj = new URL('https://' + rawUrl);
      } else {
        throw new Error(`Invalid URL: ${rawUrl}`);
      }
    }

    // Append query parameters from query object
    if (query && typeof query === 'object') {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== '') {
          urlObj.searchParams.set(key, String(value));
        }
      }
    }

    // Append apiKeyQuery auth parameter if applicable
    if (auth && auth.type === 'apiKeyQuery' && auth.keyName && auth.value) {
      urlObj.searchParams.set(auth.keyName, auth.value);
    }

    return urlObj.toString();
  }

  /**
   * Builds headers object with automatic Content-Type and Authentication headers.
   */
  static buildHeaders(customHeaders = {}, body = null, method = 'GET', auth = {}) {
    const headers = { ...customHeaders };
    const upperMethod = (method || 'GET').toUpperCase();

    // Automatically set Content-Type for JSON body on POST/PUT/PATCH if not supplied
    if (body && (upperMethod === 'POST' || upperMethod === 'PUT' || upperMethod === 'PATCH')) {
      const hasContentType = Object.keys(headers).some(
        k => k.toLowerCase() === 'content-type'
      );
      if (!hasContentType && typeof body === 'object') {
        headers['Content-Type'] = 'application/json';
      }
    }

    // Apply Authentication headers
    if (auth && auth.type) {
      switch (auth.type) {
        case 'apiKeyHeader':
          if (auth.keyName && auth.value) {
            headers[auth.keyName] = auth.value;
          }
          break;
        case 'bearer':
          if (auth.token) {
            headers['Authorization'] = `Bearer ${auth.token}`;
          }
          break;
        case 'basic':
          if (auth.username || auth.password) {
            const user = auth.username || '';
            const pass = auth.password || '';
            try {
              const b64 = typeof btoa === 'function' 
                ? btoa(`${user}:${pass}`) 
                : Buffer.from(`${user}:${pass}`).toString('base64');
              headers['Authorization'] = `Basic ${b64}`;
            } catch (e) {
              console.warn('Failed to encode basic auth', e);
            }
          }
          break;
        default:
          break;
      }
    }

    return headers;
  }

  /**
   * Resolves authentication credentials against the API Vault if vaultKey is provided.
   */
  static resolveAuthentication(auth = {}) {
    if (!auth || auth.type === 'none') {
      return { type: 'none' };
    }

    const resolved = { ...auth };

    // Resolve from Vault if vaultKey is specified and value is missing
    if (resolved.vaultKey && (!resolved.value && !resolved.token)) {
      const storedKey = vault.getKey(resolved.vaultKey);
      if (!storedKey) {
        return {
          ...resolved,
          missingCredential: true,
          error: `Missing API Key for ${resolved.vaultKey}. Please configure it in the Key Vault.`
        };
      }
      if (resolved.type === 'bearer') {
        resolved.token = storedKey;
      } else {
        resolved.value = storedKey;
      }
    }

    return resolved;
  }

  /**
   * Prepares body payload for HTTP requests.
   */
  static buildBody(body, method = 'GET') {
    const upperMethod = (method || 'GET').toUpperCase();
    if (!body || upperMethod === 'GET' || upperMethod === 'DELETE') {
      return null;
    }
    if (typeof body === 'object') {
      return JSON.stringify(body);
    }
    return String(body);
  }

  /**
   * Safely parses response body into JSON or raw text.
   */
  static parseResponse(rawText, contentType = '') {
    if (!rawText) return null;
    const isJson = contentType.toLowerCase().includes('application/json');
    try {
      return JSON.parse(rawText);
    } catch (e) {
      if (isJson) {
        console.warn('Response claimed to be JSON but failed to parse', e);
      }
      return rawText;
    }
  }

  /**
   * Accurately classifies HTTP and network errors.
   */
  static classifyError(err, status, responseData = null) {
    if (status === 401 || status === 403) {
      return {
        errorType: 'AUTH_REQUIRED',
        errorMessage: status === 401 ? 'HTTP 401 Unauthorized: API authentication required or invalid token.' : 'HTTP 403 Forbidden: Access denied for this resource.'
      };
    }
    if (status === 404) {
      return {
        errorType: 'HTTP_ERROR',
        errorMessage: 'HTTP 404 Not Found: The requested endpoint URL does not exist.'
      };
    }
    if (status === 429) {
      return {
        errorType: 'RATE_LIMITED',
        errorMessage: 'HTTP 429 Rate Limited: You have exceeded the request quota for this API.'
      };
    }
    if (status >= 500) {
      return {
        errorType: 'SERVER_ERROR',
        errorMessage: `HTTP ${status} Server Error: The remote API server encountered an internal error.`
      };
    }
    if (status >= 400) {
      return {
        errorType: 'HTTP_ERROR',
        errorMessage: `HTTP ${status} Error: Client error response received.`
      };
    }
    if (err && err.name === 'AbortError') {
      return {
        errorType: 'TIMEOUT',
        errorMessage: 'Request timed out after waiting for response.'
      };
    }
    return {
      errorType: 'NETWORK_OR_CORS',
      errorMessage: err && err.message ? err.message : 'Direct browser request failed. This may be caused by CORS headers, network connectivity, or an unavailable endpoint.',
      possibleCors: true
    };
  }

  /**
   * Primary Execution Method
   * Normalizes request options, executes fetch with AbortController,
   * captures latency, response headers, size, and returns a standard response object.
   */
  static async execute(options = {}) {
    const {
      method = 'GET',
      url,
      query = {},
      headers: rawHeaders = {},
      body: rawBody = null,
      auth: rawAuth = { type: 'none' },
      timeoutMs = 12000
    } = options;

    const startTime = performance.now();
    const upperMethod = (method || 'GET').toUpperCase();

    // Step 1: Resolve Authentication
    const resolvedAuth = this.resolveAuthentication(rawAuth);
    if (resolvedAuth.missingCredential) {
      const endTime = performance.now();
      return {
        success: false,
        status: 401,
        statusText: 'Authentication Required',
        latency: Math.round(endTime - startTime),
        url: url || '',
        method: upperMethod,
        headers: {},
        contentType: 'application/json',
        data: {
          error: 'AUTH_REQUIRED',
          message: resolvedAuth.error,
          requiresCredential: true,
          vaultKey: resolvedAuth.vaultKey
        },
        rawText: resolvedAuth.error,
        sizeBytes: 0,
        sizeFormatted: '0 B',
        errorType: 'AUTH_REQUIRED',
        errorMessage: resolvedAuth.error,
        requiresCredential: true
      };
    }

    // Step 2: Build Safe URL with Query Parameters & Auth Query
    let finalUrl;
    try {
      finalUrl = this.buildUrl(url, query, resolvedAuth);
    } catch (urlErr) {
      const endTime = performance.now();
      return {
        success: false,
        status: 0,
        statusText: 'Invalid URL',
        latency: Math.round(endTime - startTime),
        url: url || '',
        method: upperMethod,
        headers: {},
        contentType: 'text/plain',
        data: { error: 'INVALID_URL', message: urlErr.message },
        rawText: urlErr.message,
        sizeBytes: 0,
        sizeFormatted: '0 B',
        errorType: 'INVALID_URL',
        errorMessage: urlErr.message
      };
    }

    // Step 3: Build Headers with Content-Type & Auth Headers
    const finalHeaders = this.buildHeaders(rawHeaders, rawBody, upperMethod, resolvedAuth);

    // Step 4: Build Request Body
    const finalBody = this.buildBody(rawBody, upperMethod);

    // Step 5: Configure AbortController
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const fetchConfig = {
      method: upperMethod,
      headers: finalHeaders,
      signal: controller.signal
    };

    if (finalBody) {
      fetchConfig.body = finalBody;
    }

    // Step 6: Execute Request
    try {
      const response = await fetch(finalUrl, fetchConfig);
      clearTimeout(timer);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      const status = response.status;
      const statusText = response.statusText || (status >= 200 && status < 300 ? 'OK' : `Status ${status}`);

      const responseHeaders = {};
      response.headers.forEach((val, key) => {
        responseHeaders[key] = val;
      });

      const contentType = response.headers.get('content-type') || '';
      const rawText = await response.text();
      const sizeBytes = new Blob([rawText]).size;
      const sizeFormatted = sizeBytes > 1024 
        ? `${(sizeBytes / 1024).toFixed(1)} KB` 
        : `${sizeBytes} B`;

      const responseData = this.parseResponse(rawText, contentType);

      if (!response.ok) {
        const errorInfo = this.classifyError(null, status, responseData);
        return {
          success: false,
          status,
          statusText,
          latency,
          url: finalUrl,
          method: upperMethod,
          headers: responseHeaders,
          contentType,
          data: responseData,
          rawText,
          sizeBytes,
          sizeFormatted,
          errorType: errorInfo.errorType,
          errorMessage: errorInfo.errorMessage
        };
      }

      return {
        success: true,
        status,
        statusText,
        latency,
        url: finalUrl,
        method: upperMethod,
        headers: responseHeaders,
        contentType,
        data: responseData,
        rawText,
        sizeBytes,
        sizeFormatted,
        errorType: null,
        errorMessage: null
      };

    } catch (err) {
      clearTimeout(timer);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      const errorInfo = this.classifyError(err, 0);

      return {
        success: false,
        status: 0,
        statusText: errorInfo.errorType === 'TIMEOUT' ? 'Timeout' : 'Network / CORS Error',
        latency,
        url: finalUrl,
        method: upperMethod,
        headers: {},
        contentType: 'application/json',
        data: {
          error: errorInfo.errorType,
          message: errorInfo.errorMessage,
          possibleCors: errorInfo.possibleCors || false
        },
        rawText: errorInfo.errorMessage,
        sizeBytes: 0,
        sizeFormatted: '0 B',
        errorType: errorInfo.errorType,
        errorMessage: errorInfo.errorMessage,
        possibleCors: errorInfo.possibleCors || false
      };
    }
  }
}

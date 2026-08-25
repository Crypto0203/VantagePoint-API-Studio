/* OmniAPI Studio - Universal API Runner with Latency Measurement & CORS Resiliency */

export class ApiRunner {
  static async execute(options) {
    const {
      method = "GET",
      url,
      headers = {},
      body = null,
      timeoutMs = 12000
    } = options;

    const startTime = performance.now();
    let status = 0;
    let statusText = "Network Error";
    let responseHeaders = {};
    let responseData = null;
    let rawText = "";
    let isError = false;
    let errorMessage = "";

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const fetchConfig = {
      method: method,
      headers: { ...headers },
      signal: controller.signal
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      if (typeof body === "object") {
        fetchConfig.body = JSON.stringify(body);
        if (!fetchConfig.headers["Content-Type"]) {
          fetchConfig.headers["Content-Type"] = "application/json";
        }
      } else {
        fetchConfig.body = body;
      }
    }

    try {
      const response = await fetch(url, fetchConfig);
      clearTimeout(timer);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      status = response.status;
      statusText = response.statusText || (status >= 200 && status < 300 ? "OK" : "Error");

      response.headers.forEach((val, key) => {
        responseHeaders[key] = val;
      });

      rawText = await response.text();
      try {
        responseData = JSON.parse(rawText);
      } catch (e) {
        responseData = rawText;
      }

      return {
        success: response.ok,
        status,
        statusText,
        latency,
        headers: responseHeaders,
        data: responseData,
        rawText,
        url,
        method
      };
    } catch (err) {
      clearTimeout(timer);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (err.name === "AbortError") {
        errorMessage = `Request timed out after ${timeoutMs / 1000}s`;
      } else {
        errorMessage = err.message || "Failed to fetch. This may be caused by Browser CORS policy or Network connectivity.";
      }

      return {
        success: false,
        status: 0,
        statusText: "Client Error / CORS Block",
        latency,
        headers: {},
        data: { error: errorMessage, hint: "Some public APIs require server-side proxies or disable browser direct CORS. Use the generated Python or cURL script to run directly." },
        rawText: errorMessage,
        url,
        method
      };
    }
  }
}

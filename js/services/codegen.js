/* VantagePoint API Studio — Polyglot Code Generator (Phase 1) */

export class CodeGenerator {
  /**
   * Generates code snippets for 6 programming languages from normalized request parameters.
   */
  static generate(method = 'GET', url = '', headers = {}, body = null, auth = {}) {
    return {
      pythonRequests: this.pythonRequests(method, url, headers, body, auth),
      javascriptFetch: this.javascriptFetch(method, url, headers, body, auth),
      curl: this.curl(method, url, headers, body, auth),
      nodejsAxios: this.nodejsAxios(method, url, headers, body, auth),
      golang: this.golang(method, url, headers, body, auth),
      dartFlutter: this.dartFlutter(method, url, headers, body, auth)
    };
  }

  static pythonRequests(method, url, headers = {}, body = null, auth = {}) {
    let code = `import requests\nimport json\n\nurl = "${url}"\n`;
    
    if (Object.keys(headers).length > 0) {
      code += `headers = ${JSON.stringify(headers, null, 4)}\n`;
    } else {
      code += `headers = {}\n`;
    }

    const upperMethod = (method || 'GET').toUpperCase();
    if (body && (upperMethod === 'POST' || upperMethod === 'PUT' || upperMethod === 'PATCH')) {
      const payloadStr = typeof body === 'string' ? body : JSON.stringify(body, null, 4);
      code += `payload = ${payloadStr}\n\n`;
      code += `response = requests.${upperMethod.toLowerCase()}(url, headers=headers, json=payload)\n`;
    } else {
      code += `\nresponse = requests.${upperMethod.toLowerCase()}(url, headers=headers)\n`;
    }

    code += `\nif response.status_code == 200:\n    try:\n        data = response.json()\n        print("Success:", json.dumps(data, indent=2))\n    except:\n        print("Response:", response.text[:300])\nelse:\n    print(f"Error {response.status_code}: {response.text[:200]}")`;
    return code;
  }

  static javascriptFetch(method, url, headers = {}, body = null) {
    const upperMethod = (method || 'GET').toUpperCase();
    let code = `async function runApi() {\n  try {\n    const response = await fetch("${url}", {\n      method: "${upperMethod}",\n`;
    
    if (Object.keys(headers).length > 0) {
      code += `      headers: ${JSON.stringify(headers, null, 8).trim()},\n`;
    }

    if (body && (upperMethod === 'POST' || upperMethod === 'PUT' || upperMethod === 'PATCH')) {
      const bodyFormatted = typeof body === 'string' ? JSON.stringify(body) : JSON.stringify(body, null, 6).trim();
      code += `      body: JSON.stringify(${bodyFormatted})\n`;
    }

    code += `    });\n\n    const contentType = response.headers.get("content-type") || "";\n    const data = contentType.includes("application/json") \n      ? await response.json() \n      : await response.text();\n\n    console.log("Status:", response.status, response.statusText);\n    console.log("Data:", data);\n    return data;\n  } catch (error) {\n    console.error("API Call Failed:", error);\n  }\n}\n\nrunApi();`;
    return code;
  }

  static curl(method, url, headers = {}, body = null) {
    const upperMethod = (method || 'GET').toUpperCase();
    let cmd = `curl -X ${upperMethod} "${url}"`;
    for (const [k, v] of Object.entries(headers)) {
      cmd += ` \\\n  -H "${k}: ${v}"`;
    }
    if (body && (upperMethod === 'POST' || upperMethod === 'PUT' || upperMethod === 'PATCH')) {
      const formattedBody = typeof body === 'string' ? body.replace(/"/g, '\\"') : JSON.stringify(body).replace(/"/g, '\\"');
      cmd += ` \\\n  -d '${formattedBody}'`;
    }
    return cmd;
  }

  static nodejsAxios(method, url, headers = {}, body = null) {
    const upperMethod = (method || 'GET').toUpperCase();
    let code = `const axios = require('axios');\n\nasync function makeRequest() {\n  try {\n    const config = {\n      method: '${upperMethod.toLowerCase()}',\n      url: '${url}',\n`;
    
    if (Object.keys(headers).length > 0) {
      code += `      headers: ${JSON.stringify(headers, null, 8).trim()},\n`;
    }

    if (body && (upperMethod === 'POST' || upperMethod === 'PUT' || upperMethod === 'PATCH')) {
      code += `      data: ${typeof body === 'string' ? JSON.stringify(body) : JSON.stringify(body, null, 6).trim()},\n`;
    }

    code += `    };\n\n    const response = await axios(config);\n    console.log("Status:", response.status);\n    console.log("Data:", response.data);\n  } catch (error) {\n    console.error("Error:", error.message);\n  }\n}\n\nmakeRequest();`;
    return code;
  }

  static golang(method, url, headers = {}, body = null) {
    const upperMethod = (method || 'GET').toUpperCase();
    let code = `package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\nfunc main() {\n\turl := "${url}"\n\treq, err := http.NewRequest("${upperMethod}", url, nil)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\n`;
    for (const [k, v] of Object.entries(headers)) {
      code += `\treq.Header.Add("${k}", "${v}")\n`;
    }
    code += `\n\tres, err := http.DefaultClient.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer res.Body.Close()\n\n\tbody, _ := io.ReadAll(res.Body)\n\tfmt.Println("Status:", res.Status)\n\tfmt.Println(string(body))\n}`;
    return code;
  }

  static dartFlutter(method, url, headers = {}, body = null) {
    const upperMethod = (method || 'GET').toUpperCase();
    let code = `import 'dart:convert';\nimport 'package:http/http.dart' as http;\n\nFuture<void> fetchApi() async {\n  final url = Uri.parse('${url}');\n  final response = await http.${upperMethod.toLowerCase()}(\n    url,\n`;
    if (Object.keys(headers).length > 0) {
      code += `    headers: ${JSON.stringify(headers, null, 4)},\n`;
    }
    if (body && (upperMethod === 'POST' || upperMethod === 'PUT' || upperMethod === 'PATCH')) {
      code += `    body: jsonEncode(${typeof body === 'string' ? JSON.stringify(body) : JSON.stringify(body)}),\n`;
    }
    code += `  );\n\n  if (response.statusCode >= 200 && response.statusCode < 300) {\n    final data = jsonDecode(response.body);\n    print("Success: $data");\n  } else {\n    print("Failed with status: \${response.statusCode}");\n  }\n}`;
    return code;
  }
}

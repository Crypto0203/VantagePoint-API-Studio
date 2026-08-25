/* OmniAPI Studio - Polyglot Code Generator (6+ Languages) */

export class CodeGenerator {
  static generate(method, url, headers = {}, body = null) {
    return {
      pythonRequests: this.pythonRequests(method, url, headers, body),
      javascriptFetch: this.javascriptFetch(method, url, headers, body),
      curl: this.curl(method, url, headers, body),
      nodejsAxios: this.nodejsAxios(method, url, headers, body),
      golang: this.golang(method, url, headers, body),
      dartFlutter: this.dartFlutter(method, url, headers, body)
    };
  }

  static pythonRequests(method, url, headers, body) {
    let code = `import requests\nimport json\n\nurl = "${url}"\n`;
    
    if (Object.keys(headers).length > 0) {
      code += `headers = ${JSON.stringify(headers, null, 4)}\n`;
    } else {
      code += `headers = {}\n`;
    }

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      code += `payload = ${typeof body === 'string' ? body : JSON.stringify(body, null, 4)}\n\n`;
      code += `response = requests.${method.toLowerCase()}(url, headers=headers, json=payload)\n`;
    } else {
      code += `\nresponse = requests.${method.toLowerCase()}(url, headers=headers)\n`;
    }

    code += `\nif response.status_code == 200:\n    data = response.json()\n    print("Success:", json.dumps(data, indent=2))\nelse:\n    print(f"Error {response.status_code}: {response.text}")`;
    return code;
  }

  static javascriptFetch(method, url, headers, body) {
    let options = {
      method: method,
      headers: headers
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    let code = `async function runApi() {\n  try {\n    const response = await fetch("${url}", {\n      method: "${method}",\n`;
    if (Object.keys(headers).length > 0) {
      code += `      headers: ${JSON.stringify(headers, null, 8).trim()},\n`;
    }
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      code += `      body: JSON.stringify(${typeof body === 'string' ? body : JSON.stringify(body, null, 6).trim()})\n`;
    }
    code += `    });\n\n    if (!response.ok) {\n      throw new Error(\`HTTP error! status: \${response.status}\`);\n    }\n\n    const data = await response.json();\n    console.log("API Response:", data);\n    return data;\n  } catch (error) {\n    console.error("API Call Failed:", error);\n  }\n}\n\nrunApi();`;
    return code;
  }

  static curl(method, url, headers, body) {
    let cmd = `curl -X ${method} "${url}"`;
    for (const [k, v] of Object.entries(headers)) {
      cmd += ` \\\n  -H "${k}: ${v}"`;
    }
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      const formattedBody = typeof body === 'string' ? body.replace(/"/g, '\\"') : JSON.stringify(body).replace(/"/g, '\\"');
      cmd += ` \\\n  -d "${formattedBody}"`;
    }
    return cmd;
  }

  static nodejsAxios(method, url, headers, body) {
    let code = `const axios = require('axios');\n\nasync function makeRequest() {\n  try {\n    const response = await axios({\n      method: '${method.toLowerCase()}',\n      url: '${url}',\n`;
    if (Object.keys(headers).length > 0) {
      code += `      headers: ${JSON.stringify(headers, null, 8).trim()},\n`;
    }
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      code += `      data: ${typeof body === 'string' ? body : JSON.stringify(body, null, 6).trim()}\n`;
    }
    code += `    });\n\n    console.log("Status:", response.status);\n    console.log("Data:", response.data);\n  } catch (error) {\n    console.error("Error:", error.message);\n  }\n}\n\nmakeRequest();`;
    return code;
  }

  static golang(method, url, headers, body) {
    let code = `package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\nfunc main() {\n\turl := "${url}"\n\treq, err := http.NewRequest("${method}", url, nil)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\n`;
    for (const [k, v] of Object.entries(headers)) {
      code += `\treq.Header.Add("${k}", "${v}")\n`;
    }
    code += `\n\tres, err := http.DefaultClient.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer res.Body.Close()\n\n\tbody, _ := io.ReadAll(res.Body)\n\tfmt.Println(res.Status)\n\tfmt.Println(string(body))\n}`;
    return code;
  }

  static dartFlutter(method, url, headers, body) {
    let code = `import 'dart:convert';\nimport 'package:http/http.dart' as http;\n\nFuture<void> fetchApi() async {\n  final url = Uri.parse('${url}');\n  final response = await http.${method.toLowerCase()}(\n    url,\n`;
    if (Object.keys(headers).length > 0) {
      code += `    headers: ${JSON.stringify(headers, null, 4)},\n`;
    }
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      code += `    body: jsonEncode(${typeof body === 'string' ? body : JSON.stringify(body)}),\n`;
    }
    code += `  );\n\n  if (response.statusCode == 200) {\n    final data = jsonDecode(response.body);\n    print(data);\n  } else {\n    print('Request failed with status: \${response.statusCode}');\n  }\n}`;
    return code;
  }
}

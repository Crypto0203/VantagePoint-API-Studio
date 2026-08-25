# VantagePoint API Studio ⚡
### The Ultimate Public API Command Center & Interactive Polyglot Playground

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![APIs Count](https://img.shields.io/badge/APIs%20Cataloged-1%2C689%2B-blue.svg)](#)
[![Interactive](https://img.shields.io/badge/Interactive%20Sandboxes-20%2B-green.svg)](#)
[![Polyglot](https://img.shields.io/badge/Code%20Gen-6%20Languages-purple.svg)](#)

> **VantagePoint API Studio** is a high-performance developer command center that catalogs, tests, and generates multi-language integration code for **1,689+ public REST APIs** across **58 distinct technical categories**.

---

## 🌟 Key Highlights & Architecture

* **📚 1,689+ Public APIs Cataloged:** Comprehensive searchable directory spanning AI, Cryptocurrency, Cybersecurity, Cloud Infrastructure, Geolocation, Finance, Weather, and Developer Tools.
* **🟢 Interactive Sandboxes:** Ready-to-run interactive execution for APIs with verified executable definitions (Dog CEO, CoinGecko, Open-Meteo, PokéAPI, Cat Facts, JokeAPI, NASA APOD, Gemini AI, etc.).
* **📘 Clear Documentation & Status Tracking:** Categorizes every API as `Verified`, `Interactive`, `API Key Required`, or `Documentation Only` with direct links to official documentation.
* **⚙️ Custom API Definition Builder & OpenAPI Importer:** Configure executable request definitions for any catalog API with support for OpenAPI / Swagger JSON extraction.
* **💻 Polyglot 6-Language Code Generator:** Instant ready-to-run code snippets in:
  * 🐍 **Python** (`requests`)
  * 🌐 **JavaScript** (`fetch`)
  * 💻 **cURL**
  * 📦 **Node.js** (`axios`)
  * 🔵 **Go** (`net/http`)
  * 🎯 **Dart / Flutter** (`http`)
* **🎨 Dual Output Visualizer:** Toggle between rich UI cards (weather radars, crypto price tickers, Pokémon stats, book covers, animal photography) and syntax-highlighted raw JSON trees.
* **🔑 Encrypted Client-Side Key Vault:** Store private tokens (Google Gemini AI, NASA, TMDB, OpenWeatherMap) locally in browser `localStorage` with zero external tracking.

---

## 🚀 Live Demo & Deployment

* **Live Website:** [https://vantage-point-api-studio.vercel.app](https://vantage-point-api-studio.vercel.app)
* **GitHub Repository:** [https://github.com/Crypto0203/VantagePoint-API-Studio](https://github.com/Crypto0203/VantagePoint-API-Studio)

---

## 🛠️ Architecture & Tech Stack

```
VantagePoint API Studio
├── index.html              # Clean semantic UI shell & responsive layout
├── css/
│   └── style.css           # Glassmorphic cyberpunk design system & Combobox
└── js/
    ├── bundle.js           # Master unified production bundle
    ├── data/
    │   ├── resources.json  # Full discovery catalog of 1,689 public APIs
    │   └── api_registry.json # Machine-readable executable API registry
    └── services/
        ├── api_catalog.js  # Unified catalog indexer, search, and metrics
        ├── registry.js     # Registry executor and validator
        ├── api_runner.js   # Universal HTTP request engine
        ├── visualizer.js   # SmartVisualizer canvas
        ├── codegen.js      # Polyglot code generator
        └── vault.js        # Secure client-side credential store
```

---

## 📄 License & Attribution

This project is licensed under the [MIT License](LICENSE).  
Public API dataset compiled with open community resources from GitHub `public-apis`.

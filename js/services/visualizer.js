/* VantagePoint API Studio — Smart Visual Card & Error Renderer (Phase 1) */

export class SmartVisualizer {
  static render(type, data, errorInfo = null) {
    // If structured error is present, render tailored error feedback
    if (errorInfo && errorInfo.errorType) {
      return this.renderErrorCard(errorInfo);
    }

    if (!data) return `<div class="empty-state">No response data returned.</div>`;

    // If data is raw string/text or HTML
    if (typeof data === "string") {
      return `
        <div style="background:rgba(0,0,0,0.3); border:1px solid var(--border-glass); border-radius:var(--radius-lg); padding:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">
            <span style="font-size:12px; color:var(--accent-cyan); font-weight:700; font-family:var(--font-mono);">⚡ LIVE SERVER RESPONSE</span>
            <span style="font-size:11px; color:var(--text-dim);">Text / HTML Format</span>
          </div>
          <div style="font-family:var(--font-mono); font-size:13px; line-height:1.6; color:#e2e8f0; max-height:360px; overflow-y:auto; word-break:break-word; white-space:pre-wrap;">${data}</div>
        </div>
      `;
    }

    // Auto-detect image payloads from any API (Dog CEO, Fox, Cat, etc.)
    if (data.message && typeof data.message === "string" && (data.message.includes(".jpg") || data.message.includes(".png") || data.message.includes(".jpeg") || data.message.includes("images.dog.ceo"))) {
      return this.renderAnimalCard(data.message, "Dog CEO / Animal API", data.status || "success");
    }
    if (data.image && typeof data.image === "string" && data.image.includes("http")) {
      return this.renderAnimalCard(data.image, "Random Fox API", "Wild Fox Photography");
    }
    if (data.url && typeof data.url === "string" && (data.url.includes(".jpg") || data.url.includes(".png") || data.url.includes("cataas.com"))) {
      return this.renderAnimalCard(data.url, "Cataas Cat API", data.tags ? data.tags.join(", ") : "Cute Cat");
    }

    switch (type) {
      case "ip": return this.renderIp(data);
      case "animal": return this.renderAnimal(data);
      case "crypto": return this.renderCrypto(data);
      case "weather": return this.renderWeather(data);
      case "books": return this.renderBooks(data);
      case "quote": return this.renderQuote(data);
      case "forex": return this.renderForex(data);
      case "joke": return this.renderJoke(data);
      case "pokemon": return this.renderPokemon(data);
      case "country": return this.renderCountry(data);
      case "user": return this.renderUser(data);
      case "prediction": return this.renderPrediction(data);
      case "nasa": return this.renderNasa(data);
      case "mockdata": return this.renderMockData(data);
      case "ai": return this.renderAi(data);
      default: return `<pre style="font-family:var(--font-mono); color:#a5f3fc; max-height:360px; overflow:auto; padding:12px; line-height:1.5;">${JSON.stringify(data, null, 2)}</pre>`;
    }
  }

  static renderErrorCard(errorInfo) {
    const { errorType, errorMessage, requiresCredential, vaultKey, possibleCors } = errorInfo;

    if (errorType === 'AUTH_REQUIRED' || requiresCredential) {
      return `
        <div style="background:rgba(239, 68, 68, 0.08); border:1px solid rgba(239, 68, 68, 0.3); padding:28px; border-radius:var(--radius-lg); text-align:center;">
          <div style="font-size:36px; margin-bottom:8px;">🔑</div>
          <div style="font-size:20px; font-weight:800; color:#fca5a5; margin-bottom:6px;">Authentication Required</div>
          <p style="font-size:13.5px; color:#cbd5e1; max-width:500px; margin:0 auto 18px; line-height:1.5;">${errorMessage || 'This API endpoint requires an API Key or Token to access.'}</p>
          <div style="display:flex; justify-content:center; gap:12px;">
            <button onclick="document.getElementById('open-vault-btn').click();" class="btn-card-action" style="background:#ef4444; color:white; font-weight:700; padding:10px 20px; border-radius:8px;">Configure API Key in Vault</button>
          </div>
        </div>
      `;
    }

    if (errorType === 'RATE_LIMITED') {
      return `
        <div style="background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.3); padding:28px; border-radius:var(--radius-lg); text-align:center;">
          <div style="font-size:36px; margin-bottom:8px;">⏳</div>
          <div style="font-size:20px; font-weight:800; color:#fcd34d; margin-bottom:6px;">Rate Limit Exceeded</div>
          <p style="font-size:13.5px; color:#cbd5e1; max-width:500px; margin:0 auto 18px; line-height:1.5;">${errorMessage || 'Too many requests sent in a short time. Please wait a few moments before retrying.'}</p>
        </div>
      `;
    }

    if (errorType === 'TIMEOUT') {
      return `
        <div style="background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.3); padding:28px; border-radius:var(--radius-lg); text-align:center;">
          <div style="font-size:36px; margin-bottom:8px;">⏱️</div>
          <div style="font-size:20px; font-weight:800; color:#fcd34d; margin-bottom:6px;">Request Timed Out</div>
          <p style="font-size:13.5px; color:#cbd5e1; max-width:500px; margin:0 auto 18px; line-height:1.5;">The remote API server took longer than 12 seconds to respond. The server might be experiencing high load or is temporarily unreachable.</p>
        </div>
      `;
    }

    if (errorType === 'NETWORK_OR_CORS' || possibleCors) {
      return `
        <div style="background:rgba(239, 68, 68, 0.08); border:1px solid rgba(239, 68, 68, 0.3); padding:28px; border-radius:var(--radius-lg); text-align:center;">
          <div style="font-size:36px; margin-bottom:8px;">⚠️</div>
          <div style="font-size:20px; font-weight:800; color:#fca5a5; margin-bottom:6px;">Direct Browser Request Blocked</div>
          <p style="font-size:13.5px; color:#cbd5e1; max-width:550px; margin:0 auto 16px; line-height:1.5;">
            Direct browser request failed. This may be caused by CORS security restrictions, network connectivity, or an unavailable endpoint.
          </p>
          <div style="font-size:12.5px; color:var(--accent-cyan); margin-bottom:16px;">
            💡 Tip: Use the generated Python or cURL code below to test this endpoint directly from your terminal!
          </div>
          <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
            <button onclick="document.querySelector('[data-lang=\\'pythonRequests\\']').click();" class="btn-card-action" style="padding:8px 16px;">View Python Code</button>
            <button onclick="document.querySelector('[data-lang=\\'curl\\']').click();" class="btn-card-action" style="padding:8px 16px;">View cURL</button>
          </div>
        </div>
      `;
    }

    return `
      <div style="background:rgba(239, 68, 68, 0.08); border:1px solid rgba(239, 68, 68, 0.3); padding:24px; border-radius:var(--radius-lg); text-align:center;">
        <div style="font-size:32px; margin-bottom:8px;">❌</div>
        <div style="font-size:18px; font-weight:800; color:#fca5a5; margin-bottom:6px;">Request Failed</div>
        <p style="font-size:13px; color:#cbd5e1; max-width:500px; margin:0 auto; line-height:1.5;">${errorMessage || 'The server returned an error.'}</p>
      </div>
    `;
  }

  static renderAnimalCard(imgUrl, title, subtitle) {
    return `
      <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); padding:20px; border-radius:var(--radius-lg); text-align:center;">
        <div style="font-size:17px; font-weight:800; color:#fef08a; margin-bottom:12px;">🐾 ${title}</div>
        <img src="${imgUrl}" alt="Animal" style="max-height:280px; max-width:100%; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.5); object-fit:cover;" onerror="this.src='https://placehold.co/400x300/1e293b/38bdf8?text=Animal+Image'">
        <div style="margin-top:12px; font-size:13px; color:var(--accent-cyan); font-weight:600;">${subtitle}</div>
      </div>
    `;
  }

  static renderAnimal(data) {
    let img = data.message || data.image || data.url || (Array.isArray(data) ? data[0] : null);
    if (img && typeof img === "string") {
      return this.renderAnimalCard(img, "Live Animal Stream", "High-Resolution Photography");
    }
    return this.renderAnimalCard("https://cataas.com/cat", "Cat as a Service", "Random Feline");
  }

  static renderUser(data) {
    const u = (data.results && data.results[0]) ? data.results[0] : null;
    if (!u) return `<div class="empty-state">No user generated.</div>`;
    const name = `${u.name.title} ${u.name.first} ${u.name.last}`;
    return `
      <div style="display:flex; align-items:center; gap:20px; background:rgba(255,255,255,0.04); border:1px solid var(--border-glass); padding:20px; border-radius:var(--radius-lg);">
        <img src="${u.picture.large}" style="width:100px; height:100px; border-radius:50%; border:2px solid var(--accent-cyan);">
        <div>
          <div style="font-size:20px; font-weight:800; color:white;">${name}</div>
          <div style="font-size:13px; color:var(--accent-cyan); margin:2px 0 8px;">${u.email}</div>
          <div style="font-size:12px; color:var(--text-muted);">📍 ${u.location.city}, ${u.location.country} | 📞 ${u.phone}</div>
        </div>
      </div>
    `;
  }

  static renderPrediction(data) {
    return `
      <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); padding:24px; border-radius:var(--radius-lg); text-align:center;">
        <div style="font-size:14px; color:var(--text-dim); text-transform:uppercase;">Predicted Age For</div>
        <div style="font-size:28px; font-weight:900; color:#38bdf8; text-transform:capitalize; margin:4px 0;">${data.name || "Name"}</div>
        <div style="font-size:48px; font-weight:900; color:#fef08a; margin:10px 0;">${data.age || 28} <span style="font-size:18px; color:var(--text-muted); font-weight:400;">years old</span></div>
        <div style="font-size:12px; color:var(--text-dim);">Based on dataset count: ${data.count ? data.count.toLocaleString() : '1,000+'} records</div>
      </div>
    `;
  }

  static renderJoke(data) {
    return `
      <div class="quote-visual-card" style="background:linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.05)); border-color:rgba(245,158,11,0.3);">
        <div class="quote-mark">😂</div>
        <div class="quote-text">${data.setup || data.joke || data.value || "Why do programmers prefer dark mode? Because light attracts bugs!"}</div>
        <div style="font-size:18px; font-weight:700; color:#fef08a; margin-top:8px;">${data.punchline ? "👉 " + data.punchline : ""}</div>
        <div class="quote-author" style="margin-top:14px;">— Official Humor Generator</div>
      </div>
    `;
  }

  static renderPokemon(data) {
    const name = (data.name || "Pokemon").toUpperCase();
    const sprite = (data.sprites && data.sprites.other && data.sprites.other['official-artwork'] && data.sprites.other['official-artwork'].front_default) || (data.sprites && data.sprites.front_default) || "https://placehold.co/150";
    const height = (data.height || 0) / 10;
    const weight = (data.weight || 0) / 10;
    const types = data.types ? data.types.map(t => t.type.name).join(", ") : "Unknown";

    return `
      <div style="display:flex; align-items:center; gap:24px; background:rgba(255,255,255,0.04); border:1px solid var(--border-glass); padding:20px; border-radius:var(--radius-lg);">
        <img src="${sprite}" style="width:140px; height:140px; object-fit:contain; filter:drop-shadow(0 0 15px rgba(56,189,248,0.4));">
        <div>
          <div style="font-size:24px; font-weight:800; color:#fef08a;">${name}</div>
          <div style="font-size:13px; color:var(--accent-cyan); margin:4px 0 10px;">Types: ${types.toUpperCase()}</div>
          <div style="display:flex; gap:16px; font-size:13px;">
            <div>Height: <strong>${height} m</strong></div>
            <div>Weight: <strong>${weight} kg</strong></div>
            <div>Base XP: <strong>${data.base_experience || 0}</strong></div>
          </div>
        </div>
      </div>
    `;
  }

  static renderCountry(data) {
    const c = Array.isArray(data) ? data[0] : data;
    if (!c) return `<div class="empty-state">No country found.</div>`;
    const flag = c.flag || "🌐";
    const commonName = c.name ? (c.name.common || c.name) : "Unknown";
    const capital = c.capital ? (Array.isArray(c.capital) ? c.capital.join(", ") : c.capital) : "N/A";
    const population = c.population ? c.population.toLocaleString('en-IN') : "N/A";
    const region = c.region || "N/A";

    return `
      <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); padding:24px; border-radius:var(--radius-lg);">
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:16px;">
          <div style="font-size:48px;">${flag}</div>
          <div>
            <div style="font-size:22px; font-weight:800; color:white;">${commonName}</div>
            <div style="font-size:13px; color:var(--text-dim);">${c.name && c.name.official ? c.name.official : ""}</div>
          </div>
        </div>
        <div class="ip-grid">
          <div class="ip-item"><span>Capital:</span> <strong>${capital}</strong></div>
          <div class="ip-item"><span>Population:</span> <strong>${population}</strong></div>
          <div class="ip-item"><span>Region:</span> <strong>${region}</strong></div>
          <div class="ip-item"><span>Subregion:</span> <strong>${c.subregion || 'N/A'}</strong></div>
        </div>
      </div>
    `;
  }

  static renderNasa(data) {
    return `
      <div style="display:flex; flex-direction:column; gap:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-glass); padding:20px; border-radius:var(--radius-lg);">
        <div style="font-size:18px; font-weight:700; color:#38bdf8;">${data.title || "NASA Astronomy Picture of the Day"}</div>
        ${data.url ? `<img src="${data.url}" style="max-height:300px; width:100%; object-fit:cover; border-radius:12px;">` : ''}
        <div style="font-size:13px; line-height:1.6; color:#cbd5e1; max-height:120px; overflow-y:auto;">${data.explanation || ""}</div>
        <div style="font-size:11px; color:var(--text-dim);">📅 Date: ${data.date || 'Today'} | 📸 Copyright: ${data.copyright || 'NASA Public Domain'}</div>
      </div>
    `;
  }

  static renderCrypto(data) {
    const coins = Object.keys(data);
    if (coins.length === 0) return `<div class="empty-state">No coin data.</div>`;
    let html = `<div class="visual-crypto-grid">`;
    for (const coin of coins) {
      const info = data[coin] || {};
      const inr = info.inr ? `₹ ${info.inr.toLocaleString('en-IN')}` : null;
      const usd = info.usd ? `$ ${info.usd.toLocaleString('en-US')}` : null;
      const change = info.inr_24h_change || info.usd_24h_change || 0;
      const isPos = change >= 0;
      const symbol = coin.toUpperCase();

      html += `
        <div class="crypto-card">
          <div class="crypto-card-header">
            <div class="coin-badge">${symbol.substring(0, 3)}</div>
            <div>
              <div class="coin-name">${coin.charAt(0).toUpperCase() + coin.slice(1)}</div>
              <div class="coin-symbol">${symbol}</div>
            </div>
            <div class="change-badge ${isPos ? 'positive' : 'negative'}">
              ${isPos ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%
            </div>
          </div>
          <div class="crypto-prices">
            ${inr ? `<div class="price-row"><span class="currency-tag">INR</span> <span class="price-val">${inr}</span></div>` : ''}
            ${usd ? `<div class="price-row"><span class="currency-tag">USD</span> <span class="price-val">${usd}</span></div>` : ''}
          </div>
        </div>
      `;
    }
    html += `</div>`;
    return html;
  }

  static renderWeather(data) {
    if (!data.current_weather) return `<div class="empty-state">Invalid weather format.</div>`;
    const current = data.current_weather;
    const isDay = current.is_day === 1;
    let condition = "Clear Skies";
    let icon = isDay ? "☀️" : "🌙";
    if (current.weathercode >= 1 && current.weathercode <= 3) { condition = "Partly Cloudy"; icon = "⛅"; }
    else if (current.weathercode >= 51) { condition = "Rain / Showers"; icon = "🌧️"; }

    return `
      <div class="weather-visual-card">
        <div class="weather-hero">
          <div class="weather-icon-large">${icon}</div>
          <div class="weather-temp-main">${current.temperature}°<span class="temp-unit">C</span></div>
          <div class="weather-condition">${condition}</div>
        </div>
        <div class="weather-details-grid">
          <div class="weather-detail-item"><span class="detail-label">Wind Speed</span><span class="detail-val">💨 ${current.windspeed} km/h</span></div>
          <div class="weather-detail-item"><span class="detail-label">Coordinates</span><span class="detail-val">📍 ${data.latitude}°, ${data.longitude}°</span></div>
        </div>
      </div>
    `;
  }

  static renderBooks(data) {
    if (!data.docs || data.docs.length === 0) return `<div class="empty-state">No books found.</div>`;
    let html = `<div class="books-grid">`;
    data.docs.slice(0, 6).forEach(b => {
      const coverUrl = b.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg` : `https://placehold.co/120x180/1e293b/38bdf8?text=Book`;
      html += `
        <div class="book-card">
          <img src="${coverUrl}" class="book-cover" onerror="this.src='https://placehold.co/120x180/1e293b/94a3b8?text=No+Cover'">
          <div class="book-info">
            <div class="book-title" title="${b.title}">${b.title}</div>
            <div class="book-author">✍️ ${b.author_name ? b.author_name.join(", ") : "Unknown"}</div>
            <div class="book-year">📅 ${b.first_publish_year || "N/A"}</div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  }

  static renderQuote(data) {
    const advice = data.slip ? data.slip.advice : (data.fact || data.quote || data.value || "Keep building and exploring APIs!");
    return `
      <div class="quote-visual-card">
        <div class="quote-mark">“</div>
        <div class="quote-text">${advice}</div>
        <div class="quote-author">— Live Public Fact / Quote API</div>
      </div>
    `;
  }

  static renderIp(data) {
    const ip = data.ip || "Your Public IP";
    const city = data.city || "Unknown City";
    const country = data.country || data.country_name || "Unknown Country";
    const flag = data.flag && data.flag.emoji ? data.flag.emoji : "🌐";
    const isp = (data.connection && data.connection.isp) ? data.connection.isp : (data.isp || data.org || "Internet Provider");
    const timezone = (data.timezone && data.timezone.id) ? data.timezone.id : (data.timezone || "UTC");
    const coords = (data.latitude && data.longitude) ? `${data.latitude}°, ${data.longitude}°` : "Auto-Resolved";

    return `
      <div class="ip-visual-card" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); padding:24px; border-radius:var(--radius-lg);">
        <div class="ip-header" style="display:flex; align-items:center; gap:16px; margin-bottom:18px;">
          <div style="font-size:42px;">${flag}</div>
          <div>
            <div class="ip-badge" style="font-size:22px; font-weight:800; color:white;">${ip}</div>
            <div class="ip-org" style="font-size:13px; color:var(--accent-cyan); margin-top:2px;">⚡ ${isp}</div>
          </div>
        </div>
        <div class="ip-grid">
          <div class="ip-item"><span>City:</span> <strong>${city}</strong></div>
          <div class="ip-item"><span>Country:</span> <strong>${country}</strong></div>
          <div class="ip-item"><span>Timezone:</span> <strong>${timezone}</strong></div>
          <div class="ip-item"><span>Coordinates:</span> <strong>${coords}</strong></div>
        </div>
      </div>
    `;
  }

  static renderForex(data) {
    if (!data.rates) return `<div class="empty-state">No Forex rates.</div>`;
    let html = `<div class="forex-card"><div class="forex-header">Base: <strong>1 ${data.base || "USD"}</strong></div><div class="forex-rates-grid">`;
    for (const [c, r] of Object.entries(data.rates)) {
      html += `<div class="forex-item"><span class="forex-cur">${c}</span><span class="forex-rate">${Number(r).toFixed(4)}</span></div>`;
    }
    html += `</div></div>`;
    return html;
  }

  static renderMockData(data) {
    if (!Array.isArray(data)) return `<div class="empty-state">No array data.</div>`;
    let html = `<div class="mockdata-list">`;
    data.slice(0, 5).forEach(post => {
      html += `
        <div class="mockdata-card">
          <div class="mockdata-id">#${post.id}</div>
          <div class="mockdata-title">${post.title}</div>
          <div class="mockdata-body">${post.body}</div>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  }

  static renderAi(data) {
    let text = "AI response received.";
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      text = data.candidates[0].content.parts.map(p => p.text).join("\n");
    } else if (data.error) {
      text = `⚠️ Error: ${data.error.message || JSON.stringify(data.error)}`;
    }
    return `<div class="ai-visual-card"><div class="ai-response-text">${text.replace(/\n/g, '<br>')}</div></div>`;
  }
}

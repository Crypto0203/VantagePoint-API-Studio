/* OmniAPI Studio - Smart Visual Card Renderer for Non-Coders & Visual Learners */

export class SmartVisualizer {
  static render(type, data) {
    if (!data) return `<div class="empty-state">No data available to visualize.</div>`;

    switch (type) {
      case "crypto":
        return this.renderCrypto(data);
      case "weather":
        return this.renderWeather(data);
      case "books":
        return this.renderBooks(data);
      case "quote":
        return this.renderQuote(data);
      case "ip":
        return this.renderIp(data);
      case "forex":
        return this.renderForex(data);
      case "mockdata":
        return this.renderMockData(data);
      case "fact":
        return this.renderFact(data);
      case "images":
        return this.renderImages(data);
      case "ai":
        return this.renderAi(data);
      default:
        return this.renderGeneric(data);
    }
  }

  static renderCrypto(data) {
    let html = `<div class="visual-crypto-grid">`;
    const coins = Object.keys(data);
    
    if (coins.length === 0) {
      return `<div class="empty-state">No crypto data returned.</div>`;
    }

    for (const coin of coins) {
      const info = data[coin];
      const inr = info.inr ? `₹ ${info.inr.toLocaleString('en-IN')}` : null;
      const usd = info.usd ? `$ ${info.usd.toLocaleString('en-US')}` : null;
      const change24h = info.inr_24h_change || info.usd_24h_change || 0;
      const isPositive = change24h >= 0;
      const coinSymbol = coin.toUpperCase();

      html += `
        <div class="crypto-card">
          <div class="crypto-card-header">
            <div class="coin-badge">${coinSymbol.substring(0, 3)}</div>
            <div>
              <div class="coin-name">${coin.charAt(0).toUpperCase() + coin.slice(1)}</div>
              <div class="coin-symbol">${coinSymbol}</div>
            </div>
            <div class="change-badge ${isPositive ? 'positive' : 'negative'}">
              ${isPositive ? '▲' : '▼'} ${Math.abs(change24h).toFixed(2)}%
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
    if (!data.current_weather) {
      return `<div class="empty-state">Invalid weather format returned.</div>`;
    }
    const current = data.current_weather;
    const temp = current.temperature;
    const wind = current.windspeed;
    const weatherCode = current.weathercode;
    const isDay = current.is_day === 1;

    let condition = "Clear Skies";
    let icon = isDay ? "☀️" : "🌙";
    if (weatherCode >= 1 && weatherCode <= 3) { condition = "Partly Cloudy"; icon = "⛅"; }
    else if (weatherCode >= 45 && weatherCode <= 48) { condition = "Foggy"; icon = "🌫️"; }
    else if (weatherCode >= 51 && weatherCode <= 67) { condition = "Rain / Showers"; icon = "🌧️"; }
    else if (weatherCode >= 71 && weatherCode <= 86) { condition = "Snow"; icon = "❄️"; }
    else if (weatherCode >= 95) { condition = "Thunderstorm"; icon = "⛈️"; }

    return `
      <div class="weather-visual-card">
        <div class="weather-hero">
          <div class="weather-icon-large">${icon}</div>
          <div class="weather-temp-main">${temp}°<span class="temp-unit">C</span></div>
          <div class="weather-condition">${condition}</div>
        </div>
        <div class="weather-details-grid">
          <div class="weather-detail-item">
            <span class="detail-label">Wind Speed</span>
            <span class="detail-val">💨 ${wind} km/h</span>
          </div>
          <div class="weather-detail-item">
            <span class="detail-label">Time of Day</span>
            <span class="detail-val">${isDay ? "☀️ Daylight" : "🌙 Nighttime"}</span>
          </div>
          <div class="weather-detail-item">
            <span class="detail-label">Latitude / Longitude</span>
            <span class="detail-val">📍 ${data.latitude.toFixed(2)}°, ${data.longitude.toFixed(2)}°</span>
          </div>
          <div class="weather-detail-item">
            <span class="detail-label">Elevation</span>
            <span class="detail-val">⛰️ ${data.elevation || 0} meters</span>
          </div>
        </div>
      </div>
    `;
  }

  static renderBooks(data) {
    if (!data.docs || data.docs.length === 0) {
      return `<div class="empty-state">No books found matching query.</div>`;
    }

    let html = `<div class="books-grid">`;
    const books = data.docs.slice(0, 6);

    for (const book of books) {
      const title = book.title || "Untitled";
      const author = book.author_name ? book.author_name.join(", ") : "Unknown Author";
      const year = book.first_publish_year || "N/A";
      const coverId = book.cover_i;
      const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : `https://placehold.co/120x180/1e293b/38bdf8?text=Book+Cover`;

      html += `
        <div class="book-card">
          <img src="${coverUrl}" alt="${title}" class="book-cover" onerror="this.src='https://placehold.co/120x180/1e293b/94a3b8?text=No+Cover'">
          <div class="book-info">
            <div class="book-title" title="${title}">${title}</div>
            <div class="book-author">✍️ ${author}</div>
            <div class="book-year">📅 First Published: ${year}</div>
          </div>
        </div>
      `;
    }
    html += `</div>`;
    return html;
  }

  static renderQuote(data) {
    const advice = data.slip ? data.slip.advice : (data.quote || "Wisdom is the reward you get for a lifetime of listening.");
    const id = data.slip ? data.slip.id : 1;

    return `
      <div class="quote-visual-card">
        <div class="quote-mark">“</div>
        <div class="quote-text">${advice}</div>
        <div class="quote-author">— Daily Wisdom Slip #${id}</div>
      </div>
    `;
  }

  static renderIp(data) {
    return `
      <div class="ip-visual-card">
        <div class="ip-header">
          <div class="ip-badge">🌐 ${data.ip || "Detected IP"}</div>
          <div class="ip-org">${data.org || data.asn || "Network Provider"}</div>
        </div>
        <div class="ip-grid">
          <div class="ip-item"><span>City:</span> <strong>${data.city || "N/A"}</strong></div>
          <div class="ip-item"><span>Region:</span> <strong>${data.region || "N/A"}</strong></div>
          <div class="ip-item"><span>Country:</span> <strong>${data.country_name || "N/A"} (${data.country_code || ""})</strong></div>
          <div class="ip-item"><span>Postal Code:</span> <strong>${data.postal || "N/A"}</strong></div>
          <div class="ip-item"><span>Timezone:</span> <strong>${data.timezone || "N/A"}</strong></div>
          <div class="ip-item"><span>Coordinates:</span> <strong>${data.latitude || 0}, ${data.longitude || 0}</strong></div>
        </div>
      </div>
    `;
  }

  static renderForex(data) {
    if (!data.rates) return `<div class="empty-state">No Forex rates data available.</div>`;
    const base = data.base || "USD";
    const date = data.date || new Date().toISOString().split('T')[0];

    let html = `
      <div class="forex-card">
        <div class="forex-header">
          <div>Base Currency: <strong>1 ${base}</strong></div>
          <div>Date: ${date}</div>
        </div>
        <div class="forex-rates-grid">
    `;

    for (const [cur, rate] of Object.entries(data.rates)) {
      html += `
        <div class="forex-item">
          <span class="forex-cur">${cur}</span>
          <span class="forex-rate">${typeof rate === 'number' ? rate.toFixed(4) : rate}</span>
        </div>
      `;
    }

    html += `</div></div>`;
    return html;
  }

  static renderMockData(data) {
    if (!Array.isArray(data)) return `<div class="empty-state">Received non-array data.</div>`;
    let html = `<div class="mockdata-list">`;
    data.slice(0, 5).forEach(post => {
      html += `
        <div class="mockdata-card">
          <div class="mockdata-id">#${post.id || 1}</div>
          <div class="mockdata-title">${post.title || "Post Title"}</div>
          <div class="mockdata-body">${post.body || "Content description"}</div>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  }

  static renderFact(data) {
    const text = typeof data === 'string' ? data : (data.text || JSON.stringify(data));
    return `
      <div class="fact-visual-card">
        <div class="fact-icon">🔢</div>
        <div class="fact-content">${text}</div>
      </div>
    `;
  }

  static renderImages(data) {
    if (!data.message || !Array.isArray(data.message)) {
      return `<div class="empty-state">No images returned.</div>`;
    }
    let html = `<div class="images-grid">`;
    data.message.forEach(url => {
      html += `<img src="${url}" alt="Sample Animal" class="sample-image" onerror="this.style.display='none'">`;
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
    } else {
      text = JSON.stringify(data, null, 2);
    }

    return `
      <div class="ai-visual-card">
        <div class="ai-card-header">
          <span class="ai-badge">🤖 Gemini AI Model Output</span>
          <button class="copy-btn-mini" onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText); alert('Copied AI Output!');">Copy Output</button>
        </div>
        <div class="ai-response-text">${text.replace(/\n/g, '<br>')}</div>
      </div>
    `;
  }

  static renderGeneric(data) {
    return `
      <div class="generic-visual-card">
        <div class="generic-title">Live Response Summary</div>
        <pre class="generic-pre">${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
  }
}

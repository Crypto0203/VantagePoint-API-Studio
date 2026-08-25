/* OmniAPI Studio - Large Curated Public APIs Dataset & GitHub Sync Engine */

export const POPULAR_CATEGORIES = [
  "All",
  "Cryptocurrency",
  "Weather",
  "Artificial Intelligence",
  "Finance & Currency",
  "Entertainment & Movies",
  "Books & Education",
  "Development & Tools",
  "Science & Math",
  "Transportation & Flights",
  "News & Media",
  "Food & Drink",
  "Gaming & Anime",
  "Social & Quotes",
  "Security & Geolocation"
];

export const CURATED_INTERACTIVE_APIS = [
  {
    id: "coingecko-simple-price",
    name: "CoinGecko Live Crypto Tracker",
    category: "Cryptocurrency",
    description: "Get real-time prices, market cap, and 24h volume for Bitcoin, Ethereum, Solana, and 500+ coins in INR and USD.",
    auth: "No Auth",
    cors: "yes",
    https: true,
    method: "GET",
    endpoint: "https://api.coingecko.com/api/v3/simple/price",
    params: [
      { name: "ids", type: "select", label: "Cryptocurrency", options: ["bitcoin,ethereum,solana,ripple,cardano,dogecoin", "bitcoin", "ethereum", "solana", "binancecoin", "ripple"], default: "bitcoin,ethereum,solana,ripple,cardano,dogecoin" },
      { name: "vs_currencies", type: "select", label: "Target Currencies", options: ["inr,usd", "inr", "usd", "eur", "gbp"], default: "inr,usd" },
      { name: "include_24hr_change", type: "select", label: "24h Change %", options: ["true", "false"], default: "true" },
      { name: "include_market_cap", type: "select", label: "Market Cap", options: ["true", "false"], default: "true" }
    ],
    visualType: "crypto"
  },
  {
    id: "open-meteo-weather",
    name: "Open-Meteo Global Weather",
    category: "Weather",
    description: "Accurate open-source weather forecasts, temperature, windspeed, and weather codes for any city worldwide.",
    auth: "No Auth",
    cors: "yes",
    https: true,
    method: "GET",
    endpoint: "https://api.open-meteo.com/v1/forecast",
    params: [
      { name: "latitude", type: "number", label: "Latitude (e.g. 19.076 for Mumbai)", default: "19.076" },
      { name: "longitude", type: "number", label: "Longitude (e.g. 72.877 for Mumbai)", default: "72.877" },
      { name: "current_weather", type: "select", label: "Current Weather", options: ["true", "false"], default: "true" },
      { name: "hourly", type: "text", label: "Hourly Fields", default: "temperature_2m,relative_humidity_2m,wind_speed_10m" }
    ],
    presets: [
      { name: "Mumbai, India", lat: "19.076", lon: "72.877" },
      { name: "Delhi, India", lat: "28.6139", lon: "77.2090" },
      { name: "Bangalore, India", lat: "12.9716", lon: "77.5946" },
      { name: "London, UK", lat: "51.5074", lon: "-0.1278" },
      { name: "New York, USA", lat: "40.7128", lon: "-74.0060" },
      { name: "Tokyo, Japan", lat: "35.6762", lon: "139.6503" }
    ],
    visualType: "weather"
  },
  {
    id: "open-library-books",
    name: "Open Library Global Book Search",
    category: "Books & Education",
    description: "Search millions of books, author biographies, book covers, and published editions from the Internet Archive.",
    auth: "No Auth",
    cors: "yes",
    https: true,
    method: "GET",
    endpoint: "https://openlibrary.org/search.json",
    params: [
      { name: "q", type: "text", label: "Search Keyword / Title", default: "artificial intelligence" },
      { name: "limit", type: "number", label: "Result Limit", default: "8" }
    ],
    visualType: "books"
  },
  {
    id: "free-advice-quotes",
    name: "Daily Wisdom & Advice API",
    category: "Social & Quotes",
    description: "Generate instant motivational advice, programming wisdom, and life insights with zero rate limits.",
    auth: "No Auth",
    cors: "yes",
    https: true,
    method: "GET",
    endpoint: "https://api.adviceslip.com/advice",
    params: [],
    visualType: "quote"
  },
  {
    id: "ip-api-geolocation",
    name: "IP Geolocation & ISP Detector",
    category: "Security & Geolocation",
    description: "Detect visitor IP address, country, city, ISP organization, zip code, timezone, and precise coordinates.",
    auth: "No Auth",
    cors: "yes",
    https: true,
    method: "GET",
    endpoint: "https://ipapi.co/json/",
    params: [],
    visualType: "ip"
  },
  {
    id: "frankfurter-forex",
    name: "Frankfurter Global Currency Rates",
    category: "Finance & Currency",
    description: "Track live foreign exchange rates published by the European Central Bank (INR, USD, EUR, GBP, JPY).",
    auth: "No Auth",
    cors: "yes",
    https: true,
    method: "GET",
    endpoint: "https://api.frankfurter.app/latest",
    params: [
      { name: "from", type: "select", label: "Base Currency", options: ["USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD"], default: "USD" },
      { name: "to", type: "text", label: "Target Currencies (comma-separated)", default: "INR,EUR,GBP,JPY,CAD,AUD" }
    ],
    visualType: "forex"
  },
  {
    id: "jsonplaceholder-posts",
    name: "JSONPlaceholder Mock Posts & Users",
    category: "Development & Tools",
    description: "Industry-standard mock REST API for testing client-side CRUD operations, pagination, and user directories.",
    auth: "No Auth",
    cors: "yes",
    https: true,
    method: "GET",
    endpoint: "https://jsonplaceholder.typicode.com/posts",
    params: [
      { name: "_limit", type: "number", label: "Items Limit", default: "6" }
    ],
    visualType: "mockdata"
  },
  {
    id: "numbers-trivia-api",
    name: "Numbers & Trivia Fact API",
    category: "Science & Math",
    description: "Get fascinating mathematical, historical, and date trivia facts for any integer.",
    auth: "No Auth",
    cors: "yes",
    https: true,
    method: "GET",
    endpoint: "http://numbersapi.com/random/math",
    params: [
      { name: "json", type: "hidden", default: "true" }
    ],
    visualType: "fact"
  },
  {
    id: "dog-ceo-breeds",
    name: "Dog CEO Random Animal Imagery",
    category: "Entertainment & Movies",
    description: "Open source animal and dog breed database providing high-definition imagery for UI testing.",
    auth: "No Auth",
    cors: "yes",
    https: true,
    method: "GET",
    endpoint: "https://dog.ceo/api/breeds/image/random/4",
    params: [],
    visualType: "images"
  },
  {
    id: "gemini-ai-studio",
    name: "Google Gemini AI Prompt Studio",
    category: "Artificial Intelligence",
    description: "Run advanced reasoning, coding, and language tasks using Google's Gemini models with your private API key.",
    auth: "API Key",
    cors: "yes",
    https: true,
    method: "POST",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    requiresVaultKey: "GEMINI_API_KEY",
    params: [
      { name: "prompt", type: "textarea", label: "AI Prompt", default: "Explain how REST APIs work in simple terms with 3 key rules for junior developers." }
    ],
    visualType: "ai"
  }
];

export const GITHUB_MEGA_DIRECTORY = [
  { name: "OpenWeatherMap", cat: "Weather", auth: "apiKey", https: true, cors: "yes", desc: "Current weather and forecast data for any location worldwide", url: "https://openweathermap.org/api" },
  { name: "CoinGecko", cat: "Cryptocurrency", auth: "null", https: true, cors: "yes", desc: "Cryptocurrency prices, volume, market cap, and exchange data", url: "https://www.coingecko.com/en/api" },
  { name: "CoinCap", cat: "Cryptocurrency", auth: "null", https: true, cors: "yes", desc: "Real-time cryptocurrency market data and historical charts", url: "https://docs.coincap.io/" },
  { name: "NASA Open APIs", cat: "Science & Math", auth: "apiKey", https: true, cors: "yes", desc: "Astronomy Picture of the Day, Mars Rover Photos, Earth Imagery", url: "https://api.nasa.gov/" },
  { name: "The Movie Database (TMDB)", cat: "Entertainment & Movies", auth: "apiKey", https: true, cors: "yes", desc: "World's most popular movie, TV show, and actor metadata", url: "https://developer.themoviedb.org/" },
  { name: "RAWG Video Games Database", cat: "Gaming & Anime", auth: "apiKey", https: true, cors: "yes", desc: "500,000+ video games database with ratings, platforms, trailers", url: "https://rawg.io/apidocs" },
  { name: "Jikan (Unofficial MyAnimeList)", cat: "Gaming & Anime", auth: "null", https: true, cors: "yes", desc: "Open-source anime and manga database API", url: "https://jikan.moe/" },
  { name: "OpenSky Network", cat: "Transportation & Flights", auth: "null", https: true, cors: "yes", desc: "Live aircraft radar tracking and airspace position data", url: "https://opensky-network.org/apidoc/" },
  { name: "AviationStack", cat: "Transportation & Flights", auth: "apiKey", https: true, cors: "yes", desc: "Global flight tracker, airline routes, and airport schedules", url: "https://aviationstack.com/" },
  { name: "Alpha Vantage", cat: "Finance & Currency", auth: "apiKey", https: true, cors: "yes", desc: "Real-time and historical stock market, ETF, and Forex data", url: "https://www.alphavantage.co/" },
  { name: "Finnhub", cat: "Finance & Currency", auth: "apiKey", https: true, cors: "yes", desc: "Institutional-grade financial market data, earnings, financials", url: "https://finnhub.io/" },
  { name: "REST Countries", cat: "Books & Education", auth: "null", https: true, cors: "yes", desc: "Get comprehensive country info (borders, population, currency, flags)", url: "https://restcountries.com/" },
  { name: "PokéAPI", cat: "Gaming & Anime", auth: "null", https: true, cors: "yes", desc: "All the Pokémon data you'll ever need in one RESTful API", url: "https://pokeapi.co/" },
  { name: "GitHub REST API", cat: "Development & Tools", auth: "apiKey", https: true, cors: "yes", desc: "Query repositories, users, issues, commits, and pull requests", url: "https://docs.github.com/en/rest" },
  { name: "GitLab API", cat: "Development & Tools", auth: "apiKey", https: true, cors: "yes", desc: "Automate DevOps pipelines, projects, and user management", url: "https://docs.gitlab.com/ee/api/" },
  { name: "Shodan", cat: "Security & Geolocation", auth: "apiKey", https: true, cors: "yes", desc: "Search engine for Internet-connected devices, servers, ports", url: "https://developer.shodan.io/" },
  { name: "VirusTotal", cat: "Security & Geolocation", auth: "apiKey", https: true, cors: "yes", desc: "Analyze suspicious files, domains, IPs, and URLs for malware", url: "https://developers.virustotal.com/" },
  { name: "Have I Been Pwned", cat: "Security & Geolocation", auth: "apiKey", https: true, cors: "yes", desc: "Check if an email or password has been compromised in data breaches", url: "https://haveibeenpwned.com/API/v3" },
  { name: "Hugging Face Inference API", cat: "Artificial Intelligence", auth: "apiKey", https: true, cors: "yes", desc: "Deploy and infer 100,000+ open-source AI and LLM models", url: "https://huggingface.co/docs/api-inference" },
  { name: "Groq Cloud API", cat: "Artificial Intelligence", auth: "apiKey", https: true, cors: "yes", desc: "Ultra-fast LPU AI inference for Llama 3, Mixtral, and Gemma", url: "https://console.groq.com/docs" },
  { name: "NewsData.io", cat: "News & Media", auth: "apiKey", https: true, cors: "yes", desc: "Live breaking news headlines from 50,000+ verified global sources", url: "https://newsdata.io/" },
  { name: "GNews API", cat: "News & Media", auth: "apiKey", https: true, cors: "yes", desc: "Simple search and top headlines API for major news publications", url: "https://gnews.io/" },
  { name: "TheMealDB", cat: "Food & Drink", auth: "null", https: true, cors: "yes", desc: "Free cooking recipes, ingredients, dish photos, and meal ideas", url: "https://www.themealdb.com/api.php" },
  { name: "TheCocktailDB", cat: "Food & Drink", auth: "null", https: true, cors: "yes", desc: "Database of drinks, cocktails, recipes, and bar ingredients", url: "https://www.thecocktaildb.com/api.php" },
  { name: "Spotify Web API", cat: "Entertainment & Movies", auth: "OAuth", https: true, cors: "yes", desc: "Search songs, albums, artists, user playlists, and audio analysis", url: "https://developer.spotify.com/documentation/web-api" },
  { name: "SoundCloud API", cat: "Entertainment & Movies", auth: "OAuth", https: true, cors: "yes", desc: "Stream and discover audio tracks and creator podcasts", url: "https://developers.soundcloud.com/" },
  { name: "RandomUser.me", cat: "Development & Tools", auth: "null", https: true, cors: "yes", desc: "Generate realistic fake user profiles with photos and addresses", url: "https://randomuser.me/" },
  { name: "FakeStoreAPI", cat: "Development & Tools", auth: "null", https: true, cors: "yes", desc: "Mock e-commerce store with products, shopping carts, and checkout", url: "https://fakestoreapi.com/" },
  { name: "HTTPBin", cat: "Development & Tools", auth: "null", https: true, cors: "yes", desc: "HTTP request & response test service (status codes, headers, body)", url: "https://httpbin.org/" },
  { name: "Chuck Norris Facts", cat: "Social & Quotes", auth: "null", https: true, cors: "yes", desc: "Random curated humor and funny facts API", url: "https://api.chucknorris.io/" },
  { name: "ZenQuotes", cat: "Social & Quotes", auth: "null", https: true, cors: "yes", desc: "Inspirational quotes from philosophers, leaders, and scientists", url: "https://zenquotes.io/" },
  { name: "Open Meteo Air Quality", cat: "Weather", auth: "null", https: true, cors: "yes", desc: "European air quality index, PM2.5, PM10, Ozone, and NO2 tracking", url: "https://open-meteo.com/en/docs/air-quality-api" },
  { name: "Nominatim OpenStreetMap", cat: "Security & Geolocation", auth: "null", https: true, cors: "yes", desc: "Free open-source forward and reverse geocoding from OpenStreetMap", url: "https://nominatim.org/" },
  { name: "arXiv API", cat: "Books & Education", auth: "null", https: true, cors: "yes", desc: "Access 2+ million scientific research preprints in Physics, AI, CS", url: "https://arxiv.org/help/api" },
  { name: "PubMed Central (NCBI)", cat: "Science & Math", auth: "null", https: true, cors: "yes", desc: "Biomedical and life science literature repository query", url: "https://www.ncbi.nlm.nih.gov/home/develop/api/" }
];

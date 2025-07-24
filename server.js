// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import dotenv from "dotenv";

// Charger les fichiers .env
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

// Fix pour __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Debug: afficher toutes les variables d'environnement qui commencent par VITE
console.log("🔍 Variables d'environnement :");
Object.keys(process.env).forEach((key) => {
  if (key.startsWith("VITE_")) {
    console.log(`   ${key}: ${process.env[key] ? "Present" : "Missing"}`);
  }
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, "dist")));

// Route API pour Grist
app.get("/api/grist", (req, res) => {
  const { doc, table } = req.query;
  const API_KEY = process.env.VITE_GRIST_API_KEY;

  console.log("🔍 API appelée");
  console.log("📋 Doc:", doc);
  console.log("📋 Table:", table);
  console.log("🔑 API Key:", API_KEY ? "Present" : "Missing");

  if (!API_KEY) {
    console.log("❌ API Key manquante");
    return res.status(500).json({ error: "API key not configured" });
  }

  if (!doc || !table) {
    console.log("❌ Paramètres manquants");
    return res.status(400).json({ error: "Missing doc or table parameter" });
  }

  const url = `https://grist.numerique.gouv.fr/o/srfd-occ/api/docs/${doc}/tables/${table}/records`;
  const options = {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  console.log("🌐 Calling Grist API:", url);

  const request = https.get(url, options, (response) => {
    let data = "";

    console.log("📡 Response status:", response.statusCode);

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      console.log("✅ Grist response received, length:", data.length);

      if (response.statusCode !== 200) {
        console.error("❌ Grist API error:", response.statusCode, data);
        return res.status(response.statusCode).json({
          error: `Grist API error: ${response.statusCode}`,
          details: data,
        });
      }

      try {
        const jsonData = JSON.parse(data);
        console.log(
          "✅ JSON parsed successfully, records:",
          jsonData.records?.length || 0
        );
        res.json(jsonData);
      } catch (error) {
        console.error("❌ JSON parse error:", error);
        console.error("❌ Raw data:", data.substring(0, 500));
        res.status(500).json({ error: "Invalid JSON response" });
      }
    });
  });

  request.on("error", (error) => {
    console.error("❌ Request error:", error);
    res.status(500).json({ error: error.message });
  });

  request.end();
});

// Fallback pour React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
});

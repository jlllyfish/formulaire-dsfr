// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, "dist")));

// Route API pour Grist
app.get("/api/grist", async (req, res) => {
  try {
    const { doc, table } = req.query;
    const API_KEY = process.env.VITE_GRIST_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    if (!doc || !table) {
      return res.status(400).json({ error: "Missing doc or table parameter" });
    }

    console.log(`🔍 Fetching Grist data: ${doc}/${table}`);

    const response = await fetch(
      `https://grist.numerique.gouv.fr/o/srfd-occ/api/docs/${doc}/tables/${table}/records`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`❌ Grist API error: ${response.status}`);
      return res.status(response.status).json({
        error: `Grist API error: ${response.status}`,
      });
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.records?.length || 0} records`);

    res.json(data);
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Fallback pour React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

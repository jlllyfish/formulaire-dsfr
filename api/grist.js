// api/grist.js
export default async function handler(req, res) {
  // CORS headers pour permettre les requêtes depuis votre site
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Vérifier la méthode
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { doc, table } = req.query;
    const API_KEY = process.env.VITE_GRIST_API_KEY;

    if (!API_KEY) {
      res.status(500).json({ error: "API key not configured" });
      return;
    }

    if (!doc || !table) {
      res.status(400).json({ error: "Missing doc or table parameter" });
      return;
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
      res.status(response.status).json({
        error: `Grist API error: ${response.status}`,
      });
      return;
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.records?.length || 0} records`);

    res.json(data);
  } catch (error) {
    console.error("❌ Serverless function error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}

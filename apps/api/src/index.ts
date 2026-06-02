import cors from "cors";
import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3000;

/** Referenced so ShipFix analyzer detects Postgres provisioning need. */
const databaseUrl = process.env.DATABASE_URL;

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    dbConfigured: Boolean(databaseUrl),
  });
});

app.get("/api/status", (_req, res) => {
  res.status(200).json({
    service: "shipfix-e2e-api",
    dbConfigured: Boolean(databaseUrl),
  });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

import { Client } from "@elastic/elasticsearch";

export const esClient = new Client({
  node: "http://localhost:9200",
});

export async function ensureArtsIndex() {
  const indexExists = await esClient.indices.exists({ index: "arts" });

  if (!indexExists) {
    await esClient.indices.create({
      index: "arts",
      body: {
        mappings: {
          properties: {
            name: { type: "text" },
            caption: { type: "text" },
            content: { type: "text" },
            tags: {
              type: "text",
              fields: {
                keyword: { type: "keyword" } // exact filtering
              }
            },
            owner: { type: "keyword" },
            likes: { type: "integer" },
            views: { type: "integer" },
            createdAt: { type: "date" }
          }
        }
      }
    });
    console.log("✅ 'arts' index created with proper mapping");
  } else {
    console.log("ℹ️ 'arts' index already exists");
  }
}

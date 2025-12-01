import { createClient, type ClientConfig } from "@sanity/client";

const config: ClientConfig = {
  projectId: "YOUR_SANITY_PROJECT_ID",
  dataset: "production",
  useCdn: true,
  apiVersion: "2025-09-23",
};

const client = createClient(config);

export default client;

import type { MetadataRoute } from "next";
const root = "https://www.thehomefront.ai";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "", "/real-estate/fallbrook", "/real-estate/oceanside", "/va-homebuying-north-county",
  ].map(path => ({ url: root + path, changeFrequency: "monthly" as const, priority: path ? 0.8 : 1 }));
}
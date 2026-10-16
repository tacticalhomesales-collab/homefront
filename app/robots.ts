import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/partner/"] },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "OAI-AdsBot", allow: "/" },
    ],
    sitemap: "https://www.thehomefront.ai/sitemap.xml",
    host: "https://www.thehomefront.ai",
  };
}
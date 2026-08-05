import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/settings", "/agent", "/canvas", "/studio"],
    },
    sitemap: "https://deepseekaiagent.com/sitemap.xml",
  };
}

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      priority: 1,
      changeFrequency: "weekly",
      lastModified,
    },
    {
      url: `${SITE_URL}/services`,
      priority: 0.95,
      changeFrequency: "weekly",
      lastModified,
    },
    {
      url: `${SITE_URL}/approach`,
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified,
    },
    {
      url: `${SITE_URL}/cases`,
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified,
    },
    {
      url: `${SITE_URL}/contact`,
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified,
    },
    {
      url: `${SITE_URL}/about`,
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified,
    },
  ];
}

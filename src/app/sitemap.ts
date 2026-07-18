import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";
import { TOOLS } from "@/lib/tools-meta";
import { getAllGuides } from "@/lib/content";

const SITE_URL = "https://myfinanzguru.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/services",
    "/tools",
    "/guide",
    "/webinar",
    "/book",
    "/about",
    "/impressum",
    "/datenschutz",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = SERVICES.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: new Date(),
  }));

  const toolRoutes = TOOLS.map((t) => ({
    url: `${SITE_URL}/tools/${t.slug}`,
    lastModified: new Date(),
  }));

  const guideRoutes = getAllGuides().map((g) => ({
    url: `${SITE_URL}/guide/${g.slug}`,
    lastModified: new Date(g.date),
  }));

  return [...staticRoutes, ...serviceRoutes, ...toolRoutes, ...guideRoutes];
}

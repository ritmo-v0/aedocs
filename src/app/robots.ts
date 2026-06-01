import { getBaseUrl } from "@/lib/utils";

// Types & Interfaces
import type { MetadataRoute } from "next";



export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [],
		},
		sitemap: `${getBaseUrl().origin}/sitemap.xml`,
	};
}
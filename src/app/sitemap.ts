import { source } from "@/lib/fumadocs/source";
import { getBaseUrl } from "@/lib/utils";

// Types & Interfaces
import type { MetadataRoute } from "next";



export default function sitemap(): MetadataRoute.Sitemap {
	const origin = getBaseUrl().origin;

	return [
		{
			url: origin,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
		...(source.getPages().map(page => ({
			url: `${origin}${page.url}`,
			lastModified: page.data.lastModified,
			changeFrequency: "monthly" as const,
			priority: page.slugs.length < 3 ? 0.9 : 0.6,
		}))),
	];
}
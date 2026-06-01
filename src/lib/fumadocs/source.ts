import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

// Constants & Variables
import { docs } from "collections/server";
import { DOCS_CONTENT_ROUTE, DOCS_IMAGE_ROUTE, DOCS_ROUTE } from "./constants";



// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
	baseUrl: DOCS_ROUTE,
	source: docs.toFumadocsSource(),
	plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
	const segments = [...page.slugs, "image.webp"];

	return {
		segments,
		url: `${DOCS_IMAGE_ROUTE}/${segments.join("/")}`,
	};
}

export function getPageMarkdownUrl(page: InferPageType<typeof source>) {
	const segments = [...page.slugs, "content.md"];

	return {
		segments,
		url: `${DOCS_CONTENT_ROUTE}/${segments.join("/")}`,
	};
}

export async function getLLMText(page: InferPageType<typeof source>) {
	const processed = await page.data.getText("processed");

	return `# ${page.data.title} (${page.url})

${processed}`;
}
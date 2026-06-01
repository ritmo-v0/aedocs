import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
	getPageImage,
	getPageMarkdownUrl,
	source,
} from "@/lib/fumadocs/source";
import { generateSocialMetadata } from "@/lib/seo/utils";
import { getBaseUrl } from "@/lib/utils";

// Components & UI
import { getMDXComponents } from "@/components/mdx";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
	MarkdownCopyButton,
	ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { JsonLd } from "@/components/json-ld";

// Types & Interfaces
import type { Metadata } from "next";
import type { TechArticle } from "schema-dts";

// Constants & Variables
import { GIT_CONFIG } from "@/lib/fumadocs/constants";
import { LOCALE } from "@/lib/seo/constants";

// Metadata
export async function generateMetadata(
	{ params }: PageProps<"/docs/[[...slug]]">
): Promise<Metadata> {
	const { slug } = await params;
	const page = source.getPage(slug);
	if (!page) notFound();

	const { title, description } = page.data;

	return {
		title,
		description,
		...generateSocialMetadata({
			type: "article",
			title,
			description,
			url: `${getBaseUrl().origin}${page.url}`,
			images: getPageImage(page).url,
		}),
	};
}

// Static Params
export async function generateStaticParams() {
	return source.generateParams();
}



export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDX = page.data.body;
	const { title, description, lastModified } = page.data;
	const url = `${getBaseUrl().origin}${page.url}`;
	const markdownUrl = getPageMarkdownUrl(page).url;
	const githubUrl = `https://github.com/${GIT_CONFIG.user}/${GIT_CONFIG.repo}/blob/${GIT_CONFIG.branch}/content/docs/${page.path}`;

	const DOC_JSONLD: TechArticle = {
		"@type": "TechArticle",
		"@id": url,
		url,
		headline: title,
		description,
		image: `${getBaseUrl().origin}${getPageImage(page).url}`,
		dateModified: lastModified?.toISOString(),
		inLanguage: LOCALE,
	};

	return (
		<DocsPage
			toc={page.data.toc.filter(t => t.depth <= 3)}
			full={page.data.full}
		>
			<JsonLd data={DOC_JSONLD} />
			<DocsTitle>{title}</DocsTitle>
			<DocsDescription className="mb-0">
				{description}
			</DocsDescription>
			<div className="flex flex-row items-center gap-2 pb-6 border-b">
				<MarkdownCopyButton markdownUrl={markdownUrl} />
				<ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
			</div>
			<DocsBody>
				<MDX components={getMDXComponents({
					a: createRelativeLink(source, page),
				})} />
			</DocsBody>
			{lastModified && (
				<p className="text-sm text-fd-muted-foreground">
					Last updated on {lastModified.toLocaleDateString(LOCALE, {
						year: "numeric",
						month: "short",
						day: "numeric",
						timeZone: "UTC",
					})}
				</p>
			)}
		</DocsPage>
	);
}
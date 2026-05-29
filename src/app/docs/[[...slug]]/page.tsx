import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
	getPageImage,
	getPageMarkdownUrl,
	source,
} from "@/lib/fumadocs/source";
import { getBaseUrl, generateSocialMetadata } from "@/lib/utils";

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
import { JsonLd } from "@/components/common/json-ld";

// Types & Interfaces
import type { Metadata } from "next";
import type { TechArticle } from "schema-dts";

// Constants & Variables
import { GIT_CONFIG } from "@/lib/fumadocs/constants";

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
			url: `/docs/${slug?.join("/") ?? ""}`,
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
	const markdownUrl = getPageMarkdownUrl(page).url;

	const url = `${getBaseUrl().origin}/docs/${params.slug?.join("/") ?? ""}`;
	const DOC_JSONLD: TechArticle = {
		"@type": "TechArticle",
		headline: page.data.title,
		description: page.data.description,
		image: `${getBaseUrl().origin}${getPageImage(page).url}`,
		dateModified: page.data.lastModified?.toISOString(),
		url,
		inLanguage: "en-US",
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": url,
		},
	};

	return (
		<DocsPage toc={page.data.toc} full={page.data.full}>
			<JsonLd data={DOC_JSONLD} />
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription className="mb-0">{page.data.description}</DocsDescription>
			<div className="flex flex-row items-center gap-2 pb-6 border-b">
				<MarkdownCopyButton markdownUrl={markdownUrl} />
				<ViewOptionsPopover
					markdownUrl={markdownUrl}
					githubUrl={`https://github.com/${GIT_CONFIG.user}/${GIT_CONFIG.repo}/blob/${GIT_CONFIG.branch}/content/docs/${page.path}`}
				/>
			</div>
			<DocsBody>
				<MDX
					components={getMDXComponents({
						a: createRelativeLink(source, page),
					})}
				/>
			</DocsBody>
			{page.data.lastModified && (
				<p className="text-sm text-fd-muted-foreground">
					Last updated on {new Date(page.data.lastModified).toLocaleDateString()}
				</p>
			)}
		</DocsPage>
	);
}
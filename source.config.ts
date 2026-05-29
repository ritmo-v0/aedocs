import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import lastModified from "fumadocs-mdx/plugins/last-modified";

// Markdown
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import rehypeKatex from "rehype-katex";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
	dir: "content/docs",
	docs: {
		schema: pageSchema,
		postprocess: {
			includeProcessedMarkdown: true,
		},
	},
	meta: {
		schema: metaSchema,
	},
});

export default defineConfig({
	plugins: [lastModified()],
	mdxOptions: {
		remarkPlugins: [
			[remarkMath, { singleDollarTextMath: false }],
			remarkBreaks,
			[remarkGfm, { singleTilde: false }],
		],

		rehypePlugins: (v) => [
			rehypeKatex,
			...v,
		]
	},
});
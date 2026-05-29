import defaultMdxComponents from "fumadocs-ui/mdx";

// Types & Interfaces
import type { MDXComponents } from "mdx/types";

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}



export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;
import { source } from "@/lib/fumadocs/source";

// Components & UI
import { DocsLayout } from "fumadocs-ui/layouts/docs";

// Constants & Variables
import { baseOptions } from "@/lib/fumadocs/layout.shared";



export default function Layout({ children }: LayoutProps<"/docs">) {
	return (
		<DocsLayout tree={source.getPageTree()} {...baseOptions()}>
			{children}
		</DocsLayout>
	);
}
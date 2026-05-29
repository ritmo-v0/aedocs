import serialize from "serialize-javascript";

// Types & Interfaces
import type { Thing } from "schema-dts";



export function JsonLd<T extends Thing>({ data }: { data: T }) {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
			dangerouslySetInnerHTML={{
				__html: serialize(
					{
						"@context": "https://schema.org",
						...(data as object),
					},
					{ isJSON: true }
				),
			}}
		/>
	);
}
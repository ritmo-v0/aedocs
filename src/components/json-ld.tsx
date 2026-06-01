import serialize from "serialize-javascript";

// Types & Interfaces
import type { Graph, Thing, WithContext } from "schema-dts";



export function JsonLd<T extends Thing>({ data }: { data: T | T[] }) {
	const context = { "@context": "https://schema.org" } as const;
	const payload: WithContext<T> | Graph = Array.isArray(data)
		? { ...context, "@graph": data }
		: { ...context, ...(data as object) } as WithContext<T>;

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
			dangerouslySetInnerHTML={{
				__html: serialize(payload, { isJSON: true }),
			}}
		/>
	);
}
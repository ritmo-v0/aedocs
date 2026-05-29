import { getLLMText, source } from "@/lib/fumadocs/source";

// Route Segment Config
export const revalidate = false;



export async function GET() {
	const scan = source.getPages().map(getLLMText);
	const scanned = await Promise.all(scan);

	return new Response(scanned.join("\n\n"));
}

import { llms } from "fumadocs-core/source";
import { source } from "@/lib/fumadocs/source";

// Route Segment Config
export const revalidate = false;



export function GET() {
	return new Response(llms(source).index());
}
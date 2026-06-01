export { cn } from "cnfast";

export function getBaseUrl() {
	const PRODUCTION_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL;
	const baseUrl = PRODUCTION_URL
		? `https://${PRODUCTION_URL}`
		: `http://localhost:${process.env.PORT || 3000}`;

	return new URL(baseUrl);
}
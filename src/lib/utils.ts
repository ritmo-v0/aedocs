// shadcn
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Types & Interfaces
import type { Metadata } from "next";
import type {
	OpenGraph,
	OpenGraphType,
} from "next/dist/lib/metadata/types/opengraph-types";

type PageTitleProps = {
	title?: string;
	suffix?: string;
};

// Constants & Variables
import { APP_NAME } from "./fumadocs/constants";



// # Metadata Functions
export function getBaseUrl() {
	const PRODUCTION_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL;
	const baseUrl = PRODUCTION_URL
		? `https://${PRODUCTION_URL}`
		: `http://localhost:${process.env.PORT || 3000}`;

	return new URL(baseUrl);
}

export function generatePageTitle({
	title = "%s",
	suffix = APP_NAME
}: Partial<PageTitleProps> = {}): string {
	return `${title} - ${suffix}`;
}

export function generateSocialMetadata({
	type = "website",
	title,
	description,
	url,
	images,
	locale = "en_US"
}: Partial<OpenGraph & { type: OpenGraphType }>): Partial<Metadata> {
	const ogLocale = locale.replace("-", "_");

	return {
		alternates: {
			canonical: url,
		},
		openGraph: {
			type,
			title,
			description,
			url,
			images,
			siteName: APP_NAME,
			locale: ogLocale,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images,
		},
	};
}

// # Utility Functions
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
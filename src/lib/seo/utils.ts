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
import { APP_NAME, LOCALE } from "./constants";



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
	locale = LOCALE
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
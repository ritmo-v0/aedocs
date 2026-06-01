import "@/app/globals.css";
import { cn, getBaseUrl } from "@/lib/utils";
import {
	generatePageTitle,
	generateSocialMetadata,
} from "@/lib/seo/utils";

// Components & UI
import { RootProvider } from "fumadocs-ui/provider/next";

// Fonts
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
const UncutSans = localFont({
	src: "./fonts/UncutSans_VF.woff2",
	display: "swap",
	variable: "--font-uncut-sans",
});
const JetBrainsMono = JetBrains_Mono({
	weight: "variable",
	style: ["normal", "italic"],
	display: "swap",
	subsets: ["latin"],
	variable: "--font-jetbrains-mono",
});

// Types & Interfaces
import type { Metadata } from "next";

// Constants & Variables
import { APP_NAME, APP_DESCRIPTION, LOCALE } from "@/lib/seo/constants";
const title = APP_NAME;
const description = APP_DESCRIPTION;
const url = "/";

// Metadata
export const metadata: Metadata = {
	metadataBase: getBaseUrl(),
	title: {
		default: title,
		template: generatePageTitle(),
	},
	description,
	...generateSocialMetadata({ title, description, url }),
	icons: {
		icon: [
			{ url: "/icon.svg" },
			{ url: "/icon-dark.svg", media: "(prefers-color-scheme: dark)" },
		],
		apple: [{ url: "/apple-icon.png" }],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};



export default async function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang={LOCALE}
			data-scroll-behavior="smooth"
			className={cn(
				UncutSans.variable,
				JetBrainsMono.variable,
			)}
			suppressHydrationWarning
		>
			<body>
				<RootProvider>
					<div className="flex flex-col min-h-svh isolate">
						{children}
					</div>
				</RootProvider>
			</body>
		</html>
	);
}
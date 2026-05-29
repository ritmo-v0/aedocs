import "@/app/globals.css";
import "katex/dist/katex.min.css";
import {
	cn,
	getBaseUrl,
	generatePageTitle,
	generateSocialMetadata,
} from "@/lib/utils";

// Components & UI
import { RootProvider } from "fumadocs-ui/provider/next";

// Fonts
import { GeistSans } from "geist/font/sans";
import {
	JetBrains_Mono,
} from "next/font/google";
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
import { APP_NAME } from "@/lib/fumadocs/constants";
const title = APP_NAME;
const description = "";  // TODO
const url = "/";

// Metadata
export const metadata: Metadata = {
	metadataBase: getBaseUrl(),
	title: {
		default: title,
		template: generatePageTitle(),
	},
	...generateSocialMetadata({ title, description, url }),
	description,
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
			lang="en-US"
			data-scroll-behavior="smooth"
			className={cn(
				GeistSans.variable,
				JetBrainsMono.variable,
			)}
			suppressHydrationWarning
		>
			{/* <head>
				<script
					src="//unpkg.com/react-scan/dist/auto.global.js"
					crossOrigin="anonymous" async
				/>
			</head> */}
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
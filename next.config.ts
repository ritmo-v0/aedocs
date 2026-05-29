import { createMDX } from "fumadocs-mdx/next";

// Types & Interfaces
import type { NextConfig } from "next";

// Constants & Variables
const isDev = process.env.NODE_ENV === "development";
const CSP_HEADER = `
	default-src 'self';
	script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
	style-src 'self' 'unsafe-inline';
	img-src 'self' blob: data:;
	font-src 'self';
	object-src 'none';
	base-uri 'self';
	form-action 'self';
	frame-ancestors 'none';
	upgrade-insecure-requests;
`;

// Config
const config: NextConfig = {
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Content-Security-Policy",
						value: CSP_HEADER.replace(/\n/g, ""),
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload"
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
				],
			},
		];
	},
	async rewrites() {
		return [
			{
				source: "/docs/:path*.md",
				destination: "/llms.mdx/docs/:path*",
			},
		];
	},
	devIndicators: false,
	serverExternalPackages: ["@takumi-rs/image-response"],
	turbopack: {
		resolveAlias: {
			"micromark-extension-math": "micromark-extension-llm-math",
		},
	},
	typedRoutes: true,
};

const withMDX = createMDX();
export default withMDX(config);
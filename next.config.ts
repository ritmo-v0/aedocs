import { createMDX } from "fumadocs-mdx/next";

// Types & Interfaces
import type { NextConfig } from "next";

// Constants & Variables
import { CSP_HEADER_VALUE } from "@/lib/csp";

// Config
const config: NextConfig = {
	headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Content-Security-Policy",
						value: CSP_HEADER_VALUE,
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
				],
			},
		];
	},
	devIndicators: false,
	serverExternalPackages: ["@takumi-rs/core"],
	typedRoutes: true,
};

const withMDX = createMDX();
export default withMDX(config);
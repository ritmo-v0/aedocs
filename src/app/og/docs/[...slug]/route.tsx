import path from "node:path";
import fs from "node:fs/promises";
import { notFound } from "next/navigation";
import { getPageImage, source } from "@/lib/fumadocs/source";

// Takumi
import { ImageResponse } from "takumi-js/response";

// Components & UI
import { OgImage } from "@/components/og-image";

// Constants & Variables
import { APP_NAME } from "@/lib/seo/constants";
const LOGO_SRC = "logo";

// Static Params
export function generateStaticParams() {
	return source.getPages().map(page => ({
		lang: page.locale,
		slug: getPageImage(page).segments,
	}));
}

// Route Segment Config
export const revalidate = false;



export async function GET(
	_req: Request,
	{ params }: RouteContext<"/og/docs/[...slug]">
) {
	const { slug } = await params;
	const page = source.getPage(slug.slice(0, -1));
	if (!page) notFound();

	return new ImageResponse(
		<OgImage
			title={page.data.title}
			description={page.data.description}
			logoSrc={LOGO_SRC}
			category={page.slugs[0]}
			site={APP_NAME}
		/>,
		{
			width: 1200,
			height: 630,
			format: "webp",
			fonts: [
				{
					name: "Uncut Sans",
					data: () => fs.readFile(
						path.join(process.cwd(), `src/app/fonts/UncutSans_VF.woff2`)
					),
				},
			],
			images: [
				{
					src: LOGO_SRC,
					data: () => fs.readFile(
						path.join(process.cwd(), "public/apple-icon.png")
					),
				}
			],
		}
	);
}
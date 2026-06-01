// Components & UI
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";

// Types & Interfaces
import type { Route } from "next";

// Constants & Variables
import { PERSON_JSON_LD, WEBSITE_JSON_LD } from "@/lib/seo/constants";



export default function HomePage() {
	return (
		<div className="flex flex-col justify-center text-center flex-1">
			<JsonLd data={[PERSON_JSON_LD, WEBSITE_JSON_LD]} />
			<h1 className="text-2xl font-bold mb-4">Hello AE</h1>
			<p>
				You can open{" "}
				<Link
					href={"/docs" as Route}
					className="font-medium underline"
				>
					/docs
				</Link>{" "}
				and see the documentation.
			</p>
		</div>
	);
}
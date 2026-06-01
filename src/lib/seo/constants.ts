import { getBaseUrl } from "@/lib/utils";

// Types & Interfaces
import type { Person, WebSite } from "schema-dts";

// Constants & Variables
const origin = getBaseUrl().origin;

export const APP_NAME = "AEdocs";
export const APP_DESCRIPTION = "Unified, modern docs for After Effects expressions and scripting — rebuilt in Fumadocs from the ground up.";
export const LOCALE = "en-US";

export const PERSON_ID = `${origin}/#person`;
export const PERSON_JSON_LD: Person = {
	"@type": "Person",
	"@id": PERSON_ID,
	name: "ritmo_v0",
	url: "https://ritmo.dev",
};

export const WEBSITE_JSON_LD: WebSite = {
	"@type": "WebSite",
	url: origin,
	name: APP_NAME,
	description: APP_DESCRIPTION,
	inLanguage: LOCALE,
	publisher: { "@id": PERSON_ID },
};
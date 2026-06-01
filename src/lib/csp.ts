// Constants & Variables
const isDev = process.env.NODE_ENV === "development";

const CSP_DIRECTIVES = {
	"default-src": ["'self'"],
	"script-src": [
		"'self'",
		"'unsafe-inline'",
		isDev && "'unsafe-eval'",
	],
	"style-src": ["'self'", "'unsafe-inline'"],
	"img-src": ["'self'", "blob:", "data:"],
	"object-src": ["'none'"],
	"base-uri": ["'none'"],
	"form-action": ["'none'"],
	"frame-ancestors": ["'none'"],
	"upgrade-insecure-requests": [],
};

export const CSP_HEADER_VALUE = Object.entries(CSP_DIRECTIVES)
	.map(([directive, sources]) => {
		const values = sources.filter(Boolean);
		return values.length ? `${directive} ${values.join(" ")}` : directive;
	}).join("; ");
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

// Use different configs based on deployment target
const isCloudflare = process.env.CF_PAGES || process.env.CLOUDFLARE_API_TOKEN;

let config = {
	integrations: [react()],
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	devToolbar: { enabled: false },
};

if (isCloudflare) {
	// Cloudflare deployment with EmDash
	const cloudflare = await import("@astrojs/cloudflare");
	const emdash = await import("emdash/astro");
	const { d1, r2, sandbox } = await import("@emdash-cms/cloudflare");
	
	config.output = "server";
	config.adapter = cloudflare.default();
	config.integrations.push(
		emdash.default({
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
			sandboxRunner: sandbox(),
		})
	);
} else {
	// Static build for Vercel/other platforms
	config.output = "static";
}

export default defineConfig(config);
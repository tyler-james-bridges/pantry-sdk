import react from "@astrojs/react";
import { defineConfig } from "astro/config";

// Use different configs based on deployment target
const isCloudflare = process.env.CF_PAGES || process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE;

let config = {
	integrations: [react()],
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	devToolbar: { enabled: false },
};

if (isCloudflare) {
	// Basic Cloudflare deployment - DISABLE ALL AUTO-BINDINGS
	const cloudflare = await import("@astrojs/cloudflare");
	
	config.output = "server";
	config.adapter = cloudflare.default({
		mode: "directory",
		// DISABLE IMAGE PROCESSING TO PREVENT KV SESSION
		imageService: "no-op"
	});
} else {
	// Static build for Vercel/other platforms
	config.output = "static";
}

export default defineConfig(config);
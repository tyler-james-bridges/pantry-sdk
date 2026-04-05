import react from "@astrojs/react";
import { defineConfig } from "astro/config";

export default defineConfig({
	output: "static",
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
	],
	devToolbar: { enabled: false },
});

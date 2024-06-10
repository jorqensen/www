import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
    prefetch: true,
    integrations: [tailwind(), icon()],
    markdown: {
        shikiConfig: {
            theme: "github-dark-default",
        },
    },
});

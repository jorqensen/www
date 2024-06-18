import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercelStatic from "@astrojs/vercel/static";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
    prefetch: true,
    integrations: [tailwind(), icon()],
    site: "https://jorqensen.dev",
    markdown: {
        shikiConfig: {
            theme: "github-dark-default",
        },
    },
    output: "static",
    adapter: vercelStatic(),
});

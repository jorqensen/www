/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
    plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
    tailwindConfig: "./tailwind.config.mjs",
    singleAttributePerLine: true,
    singleQuote: false,
    tabWidth: 4,
    useTabs: false,
    trailingComma: "all",
};

export default config;

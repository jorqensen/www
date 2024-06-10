import { defineCollection, z } from "astro:content";

const blog = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        preface: z.string(),
        tags: z.array(z.string()),
        date: z.date(),
        draft: z.boolean().default(false),
    }),
});

const authors = defineCollection({
    type: "content",
    schema: z.object({
        name: z.string(),
        headline: z.string(),
        email: z.string().email(),
        twitter: z.string(),
        github: z.string(),
        linkedin: z.string(),
    }),
});

export const collections = {
    blog,
    authors,
};

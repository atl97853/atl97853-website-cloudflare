import { defineCollection, z } from "astro:content";
const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        pubDate: z.date(),
        title: z.string(),
        summary: z.string(), 
    }),
});

export const collections = {
    blog: blogCollection,
}; 

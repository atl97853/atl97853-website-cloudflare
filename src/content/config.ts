import { defineCollection, z } from "astro:content";

const requiredString = z.string().trim().min(1);

const blogCollection = defineCollection({
    type: "content",
    schema: z.object({
        pubDate: z.date(),
        title: requiredString,
        summary: requiredString,
    }),
});

const libraryCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: requiredString,
        author: requiredString,
        pubYear: z.number().int().positive().optional(),
        readYear: z.number().int().positive(),
        status: z.enum(["reading", "finished", "paused", "planned"]),
        rating: z.number().min(0).max(5).optional(),
        // This allows both local paths and external image URLs.
        cover: z.string().trim().optional(),
        coverAlt: z.string().trim().optional(),
        coverHasSpoiler: z.boolean().default(false),
        tags: z.array(requiredString).default([]),
        summary: requiredString,
    }),
});

export const collections = {
    blog: blogCollection,
    library: libraryCollection,
};
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type CreateEntryState = {
  error?: string;
};

export type UpdateEntryState = {
  error?: string;
};

export type TagFormState = {
  error?: string;
};

export type CategoryFormState = {
  error?: string;
};

export type MediaFormState = {
  error?: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  if (!text) return null;

  const num = Number(text);
  if (Number.isNaN(num)) return null;

  return num;
}

export async function createEntry(
  prevState: CreateEntryState,
  formData: FormData
): Promise<CreateEntryState> {
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const personalNote = String(formData.get("personalNote") || "").trim();
  const creator = String(formData.get("creator") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const year = parseOptionalNumber(formData.get("year"));
  const kindInput = String(formData.get("kind") || "").trim();
  const tagIds = formData.getAll("tagIds").map(String);

  if (!title) {
    return { error: "Title is required." };
  }

  if (!categoryId) {
    return { error: "Please select a category." };
  }

  const kind =
    kindInput === "movie" ||
    kindInput === "series" ||
    kindInput === "book" ||
    kindInput === "anime" ||
    kindInput === "other"
      ? kindInput
      : "other";

  const slug = slugInput ? slugify(slugInput) : slugify(title);

  if (!slug) {
    return { error: "Could not generate a valid slug." };
  }

  const existingEntry = await prisma.entry.findUnique({
    where: { slug },
  });

  if (existingEntry) {
    return { error: "An entry with this slug already exists." };
  }

  const categoryExists = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!categoryExists) {
    return { error: "Selected category does not exist." };
  }

  if (year !== null && (year < 0 || year > 3000)) {
    return { error: "Please enter a valid year." };
  }

  const entry = await prisma.entry.create({
    data: {
      title,
      slug,
      kind,
      description: description || null,
      imageUrl: imageUrl || null,
      personalNote: personalNote || null,
      creator: creator || null,
      year,
      categoryId,
    },
  });

  if (tagIds.length > 0) {
    await prisma.entryTag.createMany({
      data: tagIds.map((tagId) => ({
        entryId: entry.id,
        tagId,
      })),
      skipDuplicates: true,
    });
  }

  revalidatePath("/library");
  revalidatePath("/categories");
  revalidatePath("/tags");

  redirect(`/library/${entry.slug}`);
}

export async function updateEntry(
  prevState: UpdateEntryState,
  formData: FormData
): Promise<UpdateEntryState> {
  const entryId = String(formData.get("entryId") || "").trim();
  const originalSlug = String(formData.get("originalSlug") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const personalNote = String(formData.get("personalNote") || "").trim();
  const creator = String(formData.get("creator") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const year = parseOptionalNumber(formData.get("year"));
  const kindInput = String(formData.get("kind") || "").trim();
  const tagIds = formData.getAll("tagIds").map(String);

  if (!entryId || !originalSlug) {
    return { error: "Missing entry reference." };
  }

  if (!title) {
    return { error: "Title is required." };
  }

  if (!categoryId) {
    return { error: "Please select a category." };
  }

  const kind =
    kindInput === "movie" ||
    kindInput === "series" ||
    kindInput === "book" ||
    kindInput === "anime" ||
    kindInput === "other"
      ? kindInput
      : "other";

  const slug = slugInput ? slugify(slugInput) : slugify(title);

  if (!slug) {
    return { error: "Could not generate a valid slug." };
  }

  const existingEntry = await prisma.entry.findUnique({
    where: { id: entryId },
  });

  if (!existingEntry) {
    return { error: "Entry not found." };
  }

  const conflictingSlug = await prisma.entry.findUnique({
    where: { slug },
  });

  if (conflictingSlug && conflictingSlug.id !== entryId) {
    return { error: "Another entry already uses this slug." };
  }

  const categoryExists = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!categoryExists) {
    return { error: "Selected category does not exist." };
  }

  if (year !== null && (year < 0 || year > 3000)) {
    return { error: "Please enter a valid year." };
  }

  const updatedEntry = await prisma.entry.update({
    where: { id: entryId },
    data: {
      title,
      slug,
      kind,
      description: description || null,
      imageUrl: imageUrl || null,
      personalNote: personalNote || null,
      creator: creator || null,
      year,
      categoryId,
    },
  });

  await prisma.entryTag.deleteMany({
    where: { entryId },
  });

  if (tagIds.length > 0) {
    await prisma.entryTag.createMany({
      data: tagIds.map((tagId) => ({
        entryId,
        tagId,
      })),
      skipDuplicates: true,
    });
  }

  revalidatePath("/library");
  revalidatePath(`/library/${originalSlug}`);
  revalidatePath(`/library/${updatedEntry.slug}`);
  revalidatePath("/categories");
  revalidatePath("/tags");

  redirect(`/library/${updatedEntry.slug}`);
}

export async function deleteEntry(formData: FormData) {
  const entryId = String(formData.get("entryId") || "").trim();
  const slug = String(formData.get("slug") || "").trim();

  if (!entryId) {
    throw new Error("Missing entry id.");
  }

  await prisma.entryTag.deleteMany({
    where: { entryId },
  });

  await prisma.entry.delete({
    where: { id: entryId },
  });

  revalidatePath("/library");
  if (slug) {
    revalidatePath(`/library/${slug}`);
  }
  revalidatePath("/categories");
  revalidatePath("/tags");

  redirect("/library");
}

export async function createTag(
  prevState: TagFormState,
  formData: FormData
): Promise<TagFormState> {
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();

  if (!name) return { error: "Tag name is required." };

  const slug = slugInput ? slugify(slugInput) : slugify(name);
  if (!slug) return { error: "Could not generate a valid slug." };

  const existingByName = await prisma.tag.findUnique({ where: { name } });
  if (existingByName) return { error: "A tag with this name already exists." };

  const existingBySlug = await prisma.tag.findUnique({ where: { slug } });
  if (existingBySlug) return { error: "A tag with this slug already exists." };

  await prisma.tag.create({ data: { name, slug } });

  revalidatePath("/tags");
  revalidatePath("/tags/manage");
  redirect("/tags/manage");
}

export async function updateTag(
  prevState: TagFormState,
  formData: FormData
): Promise<TagFormState> {
  const tagId = String(formData.get("tagId") || "").trim();
  const originalSlug = String(formData.get("originalSlug") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();

  if (!tagId) return { error: "Missing tag id." };
  if (!name) return { error: "Tag name is required." };

  const slug = slugInput ? slugify(slugInput) : slugify(name);
  if (!slug) return { error: "Could not generate a valid slug." };

  const existingTag = await prisma.tag.findUnique({ where: { id: tagId } });
  if (!existingTag) return { error: "Tag not found." };

  const conflictingName = await prisma.tag.findUnique({ where: { name } });
  if (conflictingName && conflictingName.id !== tagId) {
    return { error: "Another tag already uses this name." };
  }

  const conflictingSlug = await prisma.tag.findUnique({ where: { slug } });
  if (conflictingSlug && conflictingSlug.id !== tagId) {
    return { error: "Another tag already uses this slug." };
  }

  const updatedTag = await prisma.tag.update({
    where: { id: tagId },
    data: { name, slug },
  });

  revalidatePath("/tags");
  revalidatePath("/tags/manage");
  revalidatePath(`/tags/${originalSlug}`);
  revalidatePath(`/tags/${updatedTag.slug}`);
  redirect("/tags/manage");
}

export async function deleteTag(formData: FormData) {
  const tagId = String(formData.get("tagId") || "").trim();
  const slug = String(formData.get("slug") || "").trim();

  if (!tagId) throw new Error("Missing tag id.");

  await prisma.entryTag.deleteMany({ where: { tagId } });
  await prisma.tag.delete({ where: { id: tagId } });

  revalidatePath("/tags");
  revalidatePath("/tags/manage");
  if (slug) revalidatePath(`/tags/${slug}`);
  revalidatePath("/library");

  redirect("/tags/manage");
}

export async function createCategory(
  prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();

  if (!name) return { error: "Category name is required." };

  const slug = slugInput ? slugify(slugInput) : slugify(name);
  if (!slug) return { error: "Could not generate a valid slug." };

  const existingByName = await prisma.category.findUnique({ where: { name } });
  if (existingByName) {
    return { error: "A category with this name already exists." };
  }

  const existingBySlug = await prisma.category.findUnique({ where: { slug } });
  if (existingBySlug) {
    return { error: "A category with this slug already exists." };
  }

  await prisma.category.create({ data: { name, slug } });

  revalidatePath("/categories");
  revalidatePath("/categories/manage");
  redirect("/categories/manage");
}

export async function updateCategory(
  prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const categoryId = String(formData.get("categoryId") || "").trim();
  const originalSlug = String(formData.get("originalSlug") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();

  if (!categoryId) return { error: "Missing category id." };
  if (!name) return { error: "Category name is required." };

  const slug = slugInput ? slugify(slugInput) : slugify(name);
  if (!slug) return { error: "Could not generate a valid slug." };

  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!existingCategory) return { error: "Category not found." };

  const conflictingName = await prisma.category.findUnique({ where: { name } });
  if (conflictingName && conflictingName.id !== categoryId) {
    return { error: "Another category already uses this name." };
  }

  const conflictingSlug = await prisma.category.findUnique({ where: { slug } });
  if (conflictingSlug && conflictingSlug.id !== categoryId) {
    return { error: "Another category already uses this slug." };
  }

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: { name, slug },
  });

  revalidatePath("/categories");
  revalidatePath("/categories/manage");
  revalidatePath(`/categories/${originalSlug}`);
  revalidatePath(`/categories/${updatedCategory.slug}`);
  revalidatePath("/new");

  redirect("/categories/manage");
}

export async function deleteCategory(formData: FormData) {
  const categoryId = String(formData.get("categoryId") || "").trim();
  const slug = String(formData.get("slug") || "").trim();

  if (!categoryId) throw new Error("Missing category id.");

  const categoryWithEntries = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      _count: {
        select: {
          entries: true,
        },
      },
    },
  });

  if (!categoryWithEntries) throw new Error("Category not found.");
  if (categoryWithEntries._count.entries > 0) {
    throw new Error("Cannot delete a category that still has entries.");
  }

  await prisma.category.delete({ where: { id: categoryId } });

  revalidatePath("/categories");
  revalidatePath("/categories/manage");
  if (slug) revalidatePath(`/categories/${slug}`);
  revalidatePath("/new");

  redirect("/categories/manage");
}

export async function createMediaAsset(
  prevState: MediaFormState,
  formData: FormData
): Promise<MediaFormState> {
  const entryId = String(formData.get("entryId") || "").trim();
  const entrySlug = String(formData.get("entrySlug") || "").trim();
  const typeInput = String(formData.get("type") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const url = String(formData.get("url") || "").trim();
  const mimeType = String(formData.get("mimeType") || "").trim();

  if (!entryId || !entrySlug) return { error: "Missing entry reference." };
  if (!url) return { error: "Media URL is required." };

  const type =
    typeInput === "video" ||
    typeInput === "pdf" ||
    typeInput === "image" ||
    typeInput === "audio" ||
    typeInput === "other"
      ? typeInput
      : "other";

  await prisma.mediaAsset.create({
    data: {
      entryId,
      type,
      title: title || null,
      url,
      mimeType: mimeType || null,
    },
  });

  revalidatePath(`/library/${entrySlug}`);
  revalidatePath(`/library/${entrySlug}/media`);

  redirect(`/library/${entrySlug}/media`);
}

export async function createSeason(
  prevState: MediaFormState,
  formData: FormData
): Promise<MediaFormState> {
  const entryId = String(formData.get("entryId") || "").trim();
  const entrySlug = String(formData.get("entrySlug") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const number = parseOptionalNumber(formData.get("number"));

  if (!entryId || !entrySlug) return { error: "Missing entry reference." };
  if (number === null) return { error: "Season number is required." };

  const existing = await prisma.season.findFirst({
    where: { entryId, number },
  });

  if (existing) {
    return { error: "This season number already exists for the entry." };
  }

  await prisma.season.create({
    data: {
      entryId,
      number,
      title: title || null,
    },
  });

  revalidatePath(`/library/${entrySlug}`);
  revalidatePath(`/library/${entrySlug}/media`);

  redirect(`/library/${entrySlug}/media`);
}

export async function createEpisode(
  prevState: MediaFormState,
  formData: FormData
): Promise<MediaFormState> {
  const seasonId = String(formData.get("seasonId") || "").trim();
  const entrySlug = String(formData.get("entrySlug") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const videoUrl = String(formData.get("videoUrl") || "").trim();
  const thumbnailUrl = String(formData.get("thumbnailUrl") || "").trim();
  const number = parseOptionalNumber(formData.get("number"));

  if (!seasonId || !entrySlug) return { error: "Missing season reference." };
  if (!title) return { error: "Episode title is required." };
  if (!videoUrl) return { error: "Episode video URL is required." };
  if (number === null) return { error: "Episode number is required." };

  const existing = await prisma.episode.findFirst({
    where: { seasonId, number },
  });

  if (existing) {
    return { error: "This episode number already exists in the season." };
  }

  await prisma.episode.create({
    data: {
      seasonId,
      number,
      title,
      description: description || null,
      videoUrl,
      thumbnailUrl: thumbnailUrl || null,
    },
  });

  revalidatePath(`/library/${entrySlug}`);
  revalidatePath(`/library/${entrySlug}/media`);

  redirect(`/library/${entrySlug}/media`);
}
export async function updateMediaAsset(
  prevState: MediaFormState,
  formData: FormData
): Promise<MediaFormState> {
  const mediaAssetId = String(formData.get("mediaAssetId") || "").trim();
  const entrySlug = String(formData.get("entrySlug") || "").trim();
  const typeInput = String(formData.get("type") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const url = String(formData.get("url") || "").trim();
  const mimeType = String(formData.get("mimeType") || "").trim();

  if (!mediaAssetId || !entrySlug) {
    return { error: "Missing media asset reference." };
  }

  if (!url) {
    return { error: "Media URL is required." };
  }

  const type =
    typeInput === "video" ||
    typeInput === "pdf" ||
    typeInput === "image" ||
    typeInput === "audio" ||
    typeInput === "other"
      ? typeInput
      : "other";

  await prisma.mediaAsset.update({
    where: { id: mediaAssetId },
    data: {
      type,
      title: title || null,
      url,
      mimeType: mimeType || null,
    },
  });

  revalidatePath(`/library/${entrySlug}`);
  revalidatePath(`/library/${entrySlug}/media`);

  redirect(`/library/${entrySlug}/media`);
}

export async function deleteMediaAsset(formData: FormData) {
  const mediaAssetId = String(formData.get("mediaAssetId") || "").trim();
  const entrySlug = String(formData.get("entrySlug") || "").trim();

  if (!mediaAssetId || !entrySlug) {
    throw new Error("Missing media asset reference.");
  }

  await prisma.mediaAsset.delete({
    where: { id: mediaAssetId },
  });

  revalidatePath(`/library/${entrySlug}`);
  revalidatePath(`/library/${entrySlug}/media`);

  redirect(`/library/${entrySlug}/media`);
}

export async function updateSeason(
  prevState: MediaFormState,
  formData: FormData
): Promise<MediaFormState> {
  const seasonId = String(formData.get("seasonId") || "").trim();
  const entryId = String(formData.get("entryId") || "").trim();
  const entrySlug = String(formData.get("entrySlug") || "").trim();
  const number = parseOptionalNumber(formData.get("number"));
  const title = String(formData.get("title") || "").trim();

  if (!seasonId || !entryId || !entrySlug) {
    return { error: "Missing season reference." };
  }

  if (number === null) {
    return { error: "Season number is required." };
  }

  const existingSeason = await prisma.season.findUnique({
    where: { id: seasonId },
  });

  if (!existingSeason) {
    return { error: "Season not found." };
  }

  const conflictingSeason = await prisma.season.findFirst({
    where: {
      entryId,
      number,
      NOT: {
        id: seasonId,
      },
    },
  });

  if (conflictingSeason) {
    return { error: "Another season with this number already exists." };
  }

  await prisma.season.update({
    where: { id: seasonId },
    data: {
      number,
      title: title || null,
    },
  });

  revalidatePath(`/library/${entrySlug}`);
  revalidatePath(`/library/${entrySlug}/media`);

  redirect(`/library/${entrySlug}/media`);
}

export async function deleteSeason(formData: FormData) {
  const seasonId = String(formData.get("seasonId") || "").trim();
  const entrySlug = String(formData.get("entrySlug") || "").trim();

  if (!seasonId || !entrySlug) {
    throw new Error("Missing season reference.");
  }

  await prisma.season.delete({
    where: { id: seasonId },
  });

  revalidatePath(`/library/${entrySlug}`);
  revalidatePath(`/library/${entrySlug}/media`);

  redirect(`/library/${entrySlug}/media`);
}

export async function updateEpisode(
  prevState: MediaFormState,
  formData: FormData
): Promise<MediaFormState> {
  const episodeId = String(formData.get("episodeId") || "").trim();
  const seasonId = String(formData.get("seasonId") || "").trim();
  const entrySlug = String(formData.get("entrySlug") || "").trim();
  const number = parseOptionalNumber(formData.get("number"));
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const videoUrl = String(formData.get("videoUrl") || "").trim();
  const thumbnailUrl = String(formData.get("thumbnailUrl") || "").trim();

  if (!episodeId || !seasonId || !entrySlug) {
    return { error: "Missing episode reference." };
  }

  if (number === null) {
    return { error: "Episode number is required." };
  }

  if (!title) {
    return { error: "Episode title is required." };
  }

  if (!videoUrl) {
    return { error: "Episode video URL is required." };
  }

  const existingEpisode = await prisma.episode.findUnique({
    where: { id: episodeId },
  });

  if (!existingEpisode) {
    return { error: "Episode not found." };
  }

  const conflictingEpisode = await prisma.episode.findFirst({
    where: {
      seasonId,
      number,
      NOT: {
        id: episodeId,
      },
    },
  });

  if (conflictingEpisode) {
    return { error: "Another episode with this number already exists in this season." };
  }

  await prisma.episode.update({
    where: { id: episodeId },
    data: {
      number,
      title,
      description: description || null,
      videoUrl,
      thumbnailUrl: thumbnailUrl || null,
    },
  });

  revalidatePath(`/library/${entrySlug}`);
  revalidatePath(`/library/${entrySlug}/media`);

  redirect(`/library/${entrySlug}/media`);
}

export async function deleteEpisode(formData: FormData) {
  const episodeId = String(formData.get("episodeId") || "").trim();
  const entrySlug = String(formData.get("entrySlug") || "").trim();

  if (!episodeId || !entrySlug) {
    throw new Error("Missing episode reference.");
  }

  await prisma.episode.delete({
    where: { id: episodeId },
  });

  revalidatePath(`/library/${entrySlug}`);
  revalidatePath(`/library/${entrySlug}/media`);

  redirect(`/library/${entrySlug}/media`);
}
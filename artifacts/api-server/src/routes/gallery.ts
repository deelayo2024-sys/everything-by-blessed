import { Router, type IRouter, type Request, type Response } from "express";
import { desc, eq } from "drizzle-orm";
import { db, galleryItemsTable, categoriesTable } from "@workspace/db";
import {
  CreateGalleryItemBody,
  CreateGalleryItemResponse,
  DeleteGalleryItemParams,
  ListGalleryItemsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/adminAuth";

const router: IRouter = Router();

router.get("/gallery", async (req: Request, res: Response): Promise<void> => {
  const { categorySlug } = req.query;

  if (typeof categorySlug === "string" && categorySlug.length > 0) {
    const [category] = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.slug, categorySlug));
    if (!category) {
      res.json(ListGalleryItemsResponse.parse([]));
      return;
    }
    const items = await db
      .select()
      .from(galleryItemsTable)
      .where(eq(galleryItemsTable.categoryId, category.id))
      .orderBy(desc(galleryItemsTable.createdAt));
    res.json(ListGalleryItemsResponse.parse(items));
    return;
  }

  const items = await db.select().from(galleryItemsTable).orderBy(desc(galleryItemsTable.createdAt));
  res.json(ListGalleryItemsResponse.parse(items));
});

router.post("/admin/gallery", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = CreateGalleryItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [item] = await db.insert(galleryItemsTable).values(parsed.data).returning();
  res.status(201).json(CreateGalleryItemResponse.parse(item));
});

router.delete("/admin/gallery/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const params = DeleteGalleryItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [item] = await db
    .delete(galleryItemsTable)
    .where(eq(galleryItemsTable.id, params.data.id))
    .returning();

  if (!item) {
    res.status(404).json({ error: "Gallery item not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;

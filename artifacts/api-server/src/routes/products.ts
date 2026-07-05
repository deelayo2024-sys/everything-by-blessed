import { Router, type IRouter, type Request, type Response } from "express";
import { and, desc, eq } from "drizzle-orm";
import { db, productsTable, categoriesTable } from "@workspace/db";
import {
  CreateProductBody,
  CreateProductResponse,
  GetProductParams,
  GetProductResponse,
  UpdateProductParams,
  UpdateProductBody,
  UpdateProductResponse,
  DeleteProductParams,
  ListProductsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/adminAuth";

const router: IRouter = Router();

router.get("/products", async (req: Request, res: Response): Promise<void> => {
  const { categorySlug, featured, newArrival } = req.query;

  const conditions = [];

  if (typeof categorySlug === "string" && categorySlug.length > 0) {
    const [category] = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.slug, categorySlug));
    if (!category) {
      res.json(ListProductsResponse.parse([]));
      return;
    }
    conditions.push(eq(productsTable.categoryId, category.id));
  }

  if (featured === "true") {
    conditions.push(eq(productsTable.featured, true));
  }

  if (newArrival === "true") {
    conditions.push(eq(productsTable.newArrival, true));
  }

  const query =
    conditions.length > 0
      ? db
          .select()
          .from(productsTable)
          .where(and(...conditions))
          .orderBy(desc(productsTable.createdAt))
      : db.select().from(productsTable).orderBy(desc(productsTable.createdAt));

  const products = await query;
  res.json(ListProductsResponse.parse(products));
});

router.get("/products/:id", async (req: Request, res: Response): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(GetProductResponse.parse(product));
});

router.post("/admin/products", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [product] = await db.insert(productsTable).values(parsed.data).returning();
  res.status(201).json(CreateProductResponse.parse(product));
});

router.patch("/admin/products/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [product] = await db
    .update(productsTable)
    .set(parsed.data)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(UpdateProductResponse.parse(product));
});

router.delete("/admin/products/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;

import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, testimonialsTable } from "@workspace/db";
import {
  CreateTestimonialBody,
  CreateTestimonialResponse,
  DeleteTestimonialParams,
  ListTestimonialsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/adminAuth";

const router: IRouter = Router();

router.get("/testimonials", async (_req: Request, res: Response): Promise<void> => {
  const testimonials = await db.select().from(testimonialsTable);
  res.json(ListTestimonialsResponse.parse(testimonials));
});

router.post("/admin/testimonials", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = CreateTestimonialBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [testimonial] = await db.insert(testimonialsTable).values(parsed.data).returning();
  res.status(201).json(CreateTestimonialResponse.parse(testimonial));
});

router.delete("/admin/testimonials/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const params = DeleteTestimonialParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [testimonial] = await db
    .delete(testimonialsTable)
    .where(eq(testimonialsTable.id, params.data.id))
    .returning();

  if (!testimonial) {
    res.status(404).json({ error: "Testimonial not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;

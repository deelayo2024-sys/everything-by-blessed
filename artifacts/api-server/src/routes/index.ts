import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import galleryRouter from "./gallery";
import testimonialsRouter from "./testimonials";
import adminAuthRouter from "./adminAuth";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(productsRouter);
router.use(galleryRouter);
router.use(testimonialsRouter);
router.use(adminAuthRouter);
router.use(storageRouter);

export default router;

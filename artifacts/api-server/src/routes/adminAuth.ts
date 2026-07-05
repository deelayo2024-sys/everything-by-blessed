import { Router, type IRouter, type Request, type Response } from "express";
import { AdminLoginBody, AdminLoginResponse, GetAdminSessionResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/admin/login", (req: Request, res: Response): void => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    req.log.error("ADMIN_EMAIL or ADMIN_PASSWORD is not configured");
    res.status(500).json({ error: "Admin login is not configured" });
    return;
  }

  if (email !== adminEmail || password !== adminPassword) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  req.session.adminEmail = adminEmail;
  res.json(AdminLoginResponse.parse({ email: adminEmail, authenticated: true }));
});

router.post("/admin/logout", (req: Request, res: Response): void => {
  req.session.destroy(() => {
    res.sendStatus(204);
  });
});

router.get("/admin/me", (req: Request, res: Response): void => {
  if (!req.session.adminEmail) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(GetAdminSessionResponse.parse({ email: req.session.adminEmail, authenticated: true }));
});

export default router;

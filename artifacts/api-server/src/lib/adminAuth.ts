import type { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    adminEmail?: string;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.adminEmail) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
}

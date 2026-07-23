import { ZodError } from "zod";

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Validation failed", details: err.flatten() });
  }
  // Prisma unique constraint
  if (err?.code === "P2002") {
    return res.status(409).json({ error: "A record with that value already exists" });
  }
  console.error(err);
  return res.status(err.status || 500).json({ error: err.message || "Internal server error" });
}

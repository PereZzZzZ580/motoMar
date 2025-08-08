import { Router } from "express";
import { chatSupport } from "../controllers/chat";
import { optionalAuth } from "../middleware/auth";

const router = Router();
router.post("/chat", optionalAuth, chatSupport);

export default router;

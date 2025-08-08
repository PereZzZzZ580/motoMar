import { Router } from "express";
import { chatSupport } from "../controllers/chat";
import { authenticateToken } from "../middleware/auth";

const router = Router();
router.post("/support/chat", authenticateToken, chatSupport);
export default router;

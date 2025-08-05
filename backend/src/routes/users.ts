import { Router } from "express";
import {
  changePassword,
  toggle2FA,
  updatePrivacy,
  getSessions,
  revokeSession,
  exportData,
  deleteAccount,
  updateProfile,
} from "../controllers/users";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.patch("/users/me", authenticateToken, updateProfile);
router.patch("/users/me/password", authenticateToken, changePassword);
router.patch("/users/me/2fa", authenticateToken, toggle2FA);
router.patch("/users/me/privacy", authenticateToken, updatePrivacy);

router.get("/users/me/sessions", authenticateToken, getSessions);
router.delete(
  "/users/me/sessions/:id",
  authenticateToken,
  revokeSession
);

router.post("/users/me/export", authenticateToken, exportData);
router.delete("/users/me", authenticateToken, deleteAccount);

export default router;

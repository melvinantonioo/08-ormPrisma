import { Router } from "express";

import { CreateBranch, GetBranches, GetBranchesByid } from "../controllers/branch.controller";

const router = Router();

router.post("/branches", CreateBranch);

router.get("/branches", GetBranches);
router.get("/branches/:id", GetBranchesByid);

export default router;
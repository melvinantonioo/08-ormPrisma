import { Router } from "express";

import { CreateBranch, GetBranches, GetBranchesByid, GetBranchesName, UpdatBranchById, DeleteBranch } from "../controllers/branch.controller";

const router = Router();

router.post("/branches", CreateBranch);

router.get("/branches", GetBranches);
router.get("/branches/:id", GetBranchesByid);

router.get("/branches", GetBranchesName);

router.patch("branches/:id", UpdatBranchById);

router.delete("branches/:id", DeleteBranch);

export default router;
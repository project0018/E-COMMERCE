import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createProject, getProjectDetail } from "../controllers/project.controller.js";

const router = express.Router();

// Create project route
router.post('/create', verifyToken, createProject);
router.get('/getProjectDetail/:userId', getProjectDetail);


export default router;
 
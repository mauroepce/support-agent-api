import express from 'express';
import handleSupportQuery from "../controllers/support-chat.controller";

const router = express.Router();

router.use('/', handleSupportQuery);

export default router;
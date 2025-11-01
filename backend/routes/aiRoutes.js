import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  tripPlanner,
  listingGenerator,
  reviewSummarizer,
} from '../controllers/aiController.js';

const router = express.Router();

router.post('/trip-planner', verifyToken, tripPlanner);
router.post('/listing-generator', verifyToken, listingGenerator);
router.post('/review-summarizer', verifyToken, reviewSummarizer);

export default router;

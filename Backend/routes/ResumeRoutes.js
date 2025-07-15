import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createResume,
  deleteResume,
  getResumeById,
  getUserResume,
  updateResume
} from '../controller/ResumeController.js';
import { uploadResumeImage } from '../controller/uploadImage.js';

const resumeRouter = express.Router();

resumeRouter.post('/', protect, createResume);
resumeRouter.get('/', protect, getUserResume);
resumeRouter.get('/:id', protect, getResumeById);
resumeRouter.put('/:id', protect, updateResume);
resumeRouter.put('/:id/upload-image', protect, uploadResumeImage);
resumeRouter.delete('/:id', protect, deleteResume);

export default resumeRouter;

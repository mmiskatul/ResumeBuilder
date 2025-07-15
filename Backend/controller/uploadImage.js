import fs from 'fs'
import path from 'path'
import Resume from '../models/resumeModel.js'
import upload from '../middleware/uploadmiddleware.js'

export const uploadResumeImage = (req, res) => {
  upload.fields([{ name: "thumbnails" }, { name: "profileImage" }])(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ message: "File Upload Failed", error: err.message });
      }

      const resumeId = req.params.id;
      const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
      if (!resume) {
        return res.status(404).json({ message: "Resume not found or unauthorized" });
      }

      const uploadsFolder = path.join(process.cwd(), "upload");
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const newThumbnail = req.files?.thumbnails?.[0];
      const newProfileImage = req.files?.profileImage?.[0];

      if (newThumbnail) {
        if (resume.thumbnailLink) {
          const oldThumb = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
          if (fs.existsSync(oldThumb)) fs.unlinkSync(oldThumb);
        }
        resume.thumbnailLink = `${baseUrl}/upload/${newThumbnail.filename}`;
      }

      if (newProfileImage) {
        if (resume.profileInfo?.profilePreviewUrl) {
          const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
          if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
        }
        resume.profileInfo.profilePreviewUrl = `${baseUrl}/upload/${newProfileImage.filename}`;
      }

      await resume.save();

      res.status(200).json({
        message: "Images uploaded successfully",
        thumbnailLink: resume.thumbnailLink,
        profilePreviewUrl: resume.profileInfo.profilePreviewUrl
      });

    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload images", error: error.message });
    }
  });
};

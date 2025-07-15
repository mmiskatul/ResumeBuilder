import fs from 'fs'
import path from 'path'
import Resume from '../models/resumeModel.js'
import upload from '../middleware/uploadmiddleware.js'
import { error } from 'console'

export const uploadResumeImage=async (req,res)=>{
    try {
        // CONFIGURE MULTER TO HANDLE IMAGES
        upload.fields([{name:"thumbails"},{name :"ProfileImage"}])
        (req,res, async(err)=>{
            if(err){
                return res.status(400).json({message:"File Upload Failed ",Error : err.message})
            }
            const resumeId=req.params.id;
            const resume =await Resume.findOne({_id :resumeId,userId: req.user._id})
            if(!resume){
                return res.status(404).json({message: "Resume not Found or unauthorized "})
            }
            // USE PROCESS CWD TO LOCATE UPLOAD FOLDER 
            const uploadsFolder=path.join(process.cwd(),"upload")
            const baseUrl =`${req.protocol}://${req.get("host")}`

            const newthumbail=req.files.thumbnails?.[0];
            const newProfileImage=req.files.profileimage?.[0]
            if(newthumbail ){
                if(resume.thumbnailLink){
                    const oldThumbnail=path.join(uploadsFolder,path.basename(resume.thumbnailLink))
                    if(fs.existsSync(oldThumbnail)){
                        fs.unlinkSync(oldThumbnail)
                    }

                }
                resume.thumbnailLink =`${baseUrl}/uploads/${newthumbail.filename}`;
            }
            // SAME FOR PROFILEPRIVIEW IMAGE
            if(newProfileImage){
                if(resume.profileInfo.profilePreviewUrl){
                    const oldProfile =path.join(uploadsFolder,path.basename(resume.profileInfo.profilePreviewUrl));
                    if(fs.existsSync(oldProfile))
                        fs.unlinkSync(oldProfile);
                }
                resume.profileInfo.profilePreviewUrl=`${baseUrl}/uploads/${newProfileImage.filename}`
            }
            await resume.save();
            res.status(200).json({
                message : "Image uploaded successfully ",
                thumbnailLink :resume.thumbnailLink,
                profilePreviewUrl :resume.profileInfo.profilePreviewUrl 
            })

        })

    } catch (err) {
        console.error(`Error uploading image: `,err);
         res.status(500).json({message:"Failed to Uploads Images ",error:err.message})

    }
}
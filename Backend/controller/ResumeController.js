import Resume from '../models/resumeModel.js'


export const createResum=async (req,res)=>{
    try {
        const {title}=req.body;
        // DEFAULT TEMPALTE 
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };
        const newResume=await Resume.create({
            userId :req.user._id,
            title,
            ...defaultResumeData,
            ...req.body,

        })
        res.status(201).json(newResume)
    } catch (error) {
        res.status(500).json({massage :"Failed to create resume",error: error.massage})
    }
}

// GET FUNCTION 
export const getUserResume=async (req,res)=>{
    try {
        const resumes=await Resume.findOne({userId:req.user._id}).sort({
            updateAt :-1
        });
        res.json(resumes)
    } catch (error) {
     res.status(500).json({massage :"Failed to get resume",error: error.massage})     
    }
}
// Get RESUME BY ID
export const getResumeById=async ( req,res) => {
    try {
        const resume=await Resume.findOne({_id: req.params.id,userId : req.user._id})
        if(!resume){
            return res.status(404).json({massage : " The Resume not Found "})
        }
        res.json({resume})
    } catch (error) {
        res.status(500).json({massage :"Failed to get resume",error: error.massage})  
    }
}
// UPDATE RESUME FUNCTION 
export const updateResume=async (req,res)=>{
    try {
        const resume=await Resume.findOne({
            _id :req.params.id,
            userId:req.user._id
        })
        if(!resume){
            return res.status(404).json({massage :"Resume Not Found or not authorized"})
        }
        // MERGE UPDATED RESUME
        Object.assign(resume,req.body)
        // SAVE UPADATED RESUME
        const saveResume =await resume.save();
        res.json(saveResume)
        } catch (error) {
        res.status(500).json({massage :"Failed to Update resume",error: error.massage})  
    }
}
// DELETE RESUME FUNCTION 
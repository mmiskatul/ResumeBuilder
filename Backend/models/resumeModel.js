import mongoose from "mongoose";
const ResumeSchema= new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required :true
    },
    title : {
        type :String ,
        required :true
    },
    thumbnailLink : {
        type : String 
    },
    template : {
        theme :String ,
        colorPalette : [String]
    },
    profileInfo:{
        profilePreviewUrl :String,
        fullName :String ,
        designation : String ,
        summary :String,
    },

    ContactInfo :{
        email: String ,
        phone:String ,
        loaction :String ,
        linkedin:String ,
        gihubLink:String ,
        websiteLink :String,
    },
    // WORK EXP
    workExperiance :[
        {
            company :String ,
            role :String ,
            startDate :String ,
            endDate :String ,
            description :String ,

        },

    ],
    Education:[
        {
            degree:String ,
            institution:String ,
            startDate:String,
            endDate :String ,
        },
    ],
    Skill: [
        {
            name:String ,
            progress :Number ,

        },

    ],
    Projects :[
        {
            title :String ,
            description :String,
            githubLink:String ,
            liveDemo :String ,

        },
    ],
    certification:[
        {
            title:String ,
            issuer :String,
            year : String ,

        },
    ],
    Language :[
        {
            name :String ,
            progress : Number ,

        },
    ],
    interests : [String ],

},
{
    timestamps : {createdAt:"createdAt",updatedAt :"updatedAt"}
})

export default mongoose.model("Resume",ResumeSchema)
import mongoose from "mongoose";
import { User } from "./user.model.js";

const courseSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true
    },
    subTitle: {
        type: String
    },
    description: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    courseLevel: {
        type: String,
        enum: ['Beginner', 'Moderate', 'Advanced']
    },
    coursePrice: {
        type: Number
    },
    courseThumbnail: {
        type: String
    },
    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    lectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture"
        }
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    creatorName: {
        type: String, // Field to store the creator's name
    },
    isPublished: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
    versionKey: false
})

// export const Course = mongoose.model("Course" , courseSchema);

// Pre-save hook to populate creatorName from the User collection
courseSchema.pre("save", async function (next) {
    try {
      // Only populate creatorName if it is not already set
      if (!this.creatorName && this.creator) {
        const user = await User.findById(this.creator);
        if (user) {
          this.creatorName = user.name; // Assuming the User model has a `name` field
        } else {
          return next(new Error("Creator not found"));
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  });
  
  export const Course = mongoose.model("Course", courseSchema);

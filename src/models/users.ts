import mongoose from "mongoose";


const UserScheme = new mongoose.Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String,
            select: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationToken: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default UserScheme;
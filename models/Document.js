import { Schema, model } from "mongoose";

const DocumentSchema = new Schema({
  fileName: String,  
  fileUrl: String,
  localFileName: String,
  cloudinaryUrl: String,
  cloudinaryPublicId: String,
  title: String,
  uploadedBy: String,
},
{timestamps: true}
);

export const Document = model("Document", DocumentSchema);

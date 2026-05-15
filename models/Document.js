<<<<<<< HEAD
import { Schema, model } from "mongoose";

const DocumentSchema = new Schema({
  fileName: String,
  title: String,
  uploadedBy: String,
},
{ timestamps: true }
=======
// import { Schema, model } from "mongoose";

// const DocumentSchema = new Schema({
//   title: String,
//   uploadedBy: String,
//   fileName: String,
//   uploadDate: {
//     type: Date,
//     default: Date.now
//   }
// },{timestamps: true});

// export const Document = model("Document", DocumentSchema);

import { Schema, model } from "mongoose";

const DocumentSchema = new Schema({
  fileName: String,  
  title: String,
  uploadedBy: String,
},
{timestamps: true}
>>>>>>> 19a7afb44ac6c861223453c03033db06a142d84e
);

export const Document = model("Document", DocumentSchema);
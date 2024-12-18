// import mongoose from "mongoose";
// import dbConnect from "@/lib/mongodb";

// const personaSchema = new mongoose.Schema(
//   {
//     persona_name: {
//       type: String,
//       required: true,
//     },
//     system_prompt_en: {
//       type: String,
//       required: true,
//     },
//     system_prompt: {
//       type: String,
//       required: true,
//     },
//     intro: {
//       type: String,
//       required: true,
//     },
//     intro_en: {
//       type: String,
//       required: true,
//     },
//     waiting_message: {
//       type: [String],
//       required: true,
//     },
//   },
//   {
//     collection: "persona",
//     timestamps: true,
//   }
// );

// export async function getPersonaModel() {
//   try {
//     await dbConnect("MarketingAgent");
//     return mongoose.models.persona || mongoose.model("persona", personaSchema);
//   } catch (error) {
//     console.error("獲取用戶模型時出錯:", error);
//     throw error;
//   }
// }

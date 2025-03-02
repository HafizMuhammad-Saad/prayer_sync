// import axios from "axios";

// const API_KEY = "AIzaSyCzu9x7kHoFdRPwgcaXSfOUOfAVNk7FCvU";

// const handleAskQuestion = async (inputText) => {
//   try {
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
//       {
//         contents: [{ parts: [{ text: inputText }] }]
//       }
//     );
//     console.log("Gemini Response:", response.data);
//     return response.data?.candidates?.[0]?.content ?? "No response from Gemini";
//   } catch (error) {
//     console.error("Error fetching Gemini API:", error);
//   }
// };

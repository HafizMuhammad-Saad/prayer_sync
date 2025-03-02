

// import React, { useState } from "react";
// import { OpenAI } from "openai";

// const AIChat = () => {
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [loading, setLoading] = useState(false);

//   const openai = new OpenAI({
//     apiKey: "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", // Replace with your OpenAI API key
//     dangerouslyAllowBrowser: true, // Only for frontend development (not recommended for production)
//   });

//   const handleAskQuestion = async () => {
//     if (!question) return;

//     setLoading(true);
//     try {
//       const response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo", // Use GPT-3.5 for cost-effectiveness
//         messages: [
//           {
//             role: "system",
//             content: "You are a knowledgeable Islamic scholar. Answer questions about Saum (fasting) in a clear and concise manner.",
//           },
//           {
//             role: "user",
//             content: question,
//           },
//         ],
//       });

//       setAnswer(response.choices[0].message.content);
//     } catch (error) {
//       console.error("Error fetching AI response:", error);
//       setAnswer("Sorry, I couldn't process your question. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
//       <h2 className="text-xl font-bold mb-4">Ask About Saum (Fasting)</h2>
//       <div className="flex flex-col space-y-4">
//         <input
//           type="text"
//           placeholder="Ask a question about Saum..."
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           className="p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
//         />
//         <button
//           onClick={handleAskQuestion}
//           disabled={loading}
//           className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
//         >
//           {loading ? "Loading..." : "Ask"}
//         </button>
//       </div>
//       {answer && (
//         <div className="mt-4 p-4 bg-white/20 rounded-lg">
//           <p className="text-gray-200">{answer}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AIChat;


import React, { useState } from "react";

const AIChat = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "AIzaSyCzu9x7kHoFdRPwgcaXSfOUOfAVNk7FCvU"; // 🔹 Replace with your actual API key

  const handleAskQuestion = async () => {
    if (!question) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": API_KEY, // 🔹 Correct authorization header
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: question }] }], // 🔹 Correct format
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json(); // ✅ Read JSON response correctly
      console.log("API Response:", data); // ✅ Debugging log

      if (data.candidates && data.candidates.length > 0) {
        setAnswer(data.candidates[0].content.parts[0].text);
      } else {
        setAnswer("Sorry, I couldn't process your question.");
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setAnswer("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Ask About Saum (Fasting) or everything</h2>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Ask a question about Saum..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={handleAskQuestion}
          disabled={loading}
          className={`flex justify-center items-center px-6 py-3 font-semibold rounded-lg shadow-md transition duration-300 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600 text-white"
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            "Ask"
          )}
        </button>
      </div>
      {answer && (
        <div className="mt-4 p-4 bg-white/20 rounded-lg text-gray-200 whitespace-pre-line leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export default AIChat;
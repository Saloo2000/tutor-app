import React, { useState } from "react";
import ThreeDotLoading from "./ThreeDotLoading";
// import.meta.env
// console.log(import.meta.env);


const ScienceTutor = () => {
  // State variables
  const [userInput, setUserInput] = useState(""); 
  const [messages, setMessages] = useState([]); 
  const [aiInput, setAiInput] = useState("")
  const [loading, setLoading] = useState(false);


  // Function to handle the API call
  const fetchChatCompletion = async () => {
    setLoading(true);

    try {
      // Defining the system prompt for the AI
      const systemPrompt = {
        role: "system",
        content:
          "You are a highly knowledgeable and focused science tutor. Your only purpose is to discuss, explain, and answer questions related to science. You are not allowed to engage in discussions or provide responses about topics outside the field of science. If the user attempts to discuss non-science topics, politely but firmly remind them that you can only assist with science-related matters and guide the conversation back to science. Do not entertain or respond to any off-topic questions, no matter how persistent they are. Always keep your responses precise, factual, and strictly within the realm of science.",
      };

      // Add the user's input to the conversation history
      const userMessage = { role: "user", content: userInput };
      const updatedMessages = [...messages, userMessage];
      // console.log(updatedMessages);
    
        console.log(updatedMessages);
      

      // Make the API call to OpenRouter
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer "+process.env.REACT_APP_API_KEY_TWO,
          Authorization: "Bearer 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", 
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-lite-preview-02-05:free",
          messages: [systemPrompt, ...updatedMessages],
        }),

      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data);

      const aiResponse = data.choices[0].message.content;
      const aiMessage = { role: "system", content: aiResponse };
      setMessages([...updatedMessages, aiMessage]);
      setUserInput(""); 
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessages([...messages, { role: "system", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
      console.log();

    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">AI Science Tutor</h1>
    {/* <ThreeDotLoading/> */}
      <div className="flex flex-col justify-end h-[750px] overflow-y-auto px-4 py-6 relative">
 {loading ? <ThreeDotLoading/> :  <div className=" overflow-y-auto flex flex-col items-end ">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`p-3 mb-2 w-fit rounded-lg ${
          message.role === "user"
            ? "bg-blue-100 text-blue-900 float-right"
            : "bg-gray-100 text-gray-900 float-left"
        }`}
      >
        <strong>{message.role === "user" ? "You: " : "Tutor: "}</strong>
        {message.content}
      </div>
    ))}
  </div>}

  <div>
    <textarea
      value={userInput}
      onChange={(e) => setUserInput(e.target.value)}
      placeholder="Ask a science question..."
      className="w-full p-3 h-[80px] border rounded-lg mb-4 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    ></textarea>

    <button
      onClick={fetchChatCompletion}
      disabled={loading}
      className={`px-6 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Thinking..." : "Ask"}
    </button>
  </div>
</div>

    </div>
  );
};

export default ScienceTutor;









// import React, { useState } from "react";
// import ThreeDotLoading from "./ThreeDotLoading";

// const ScienceTutor = () => {
//   // State variables
//   const [userInput, setUserInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [image, setImage] = useState(null); // State to store the uploaded image

//   // Function to handle the API call
//   const fetchChatCompletion = async () => {
//     setLoading(true);

//     try {
//       // Defining the system prompt for the AI
//       const systemPrompt = {
//         role: "system",
//         content:
//           "You are a highly knowledgeable and focused science tutor. Your only purpose is to discuss, explain, and answer questions related to science. You are not allowed to engage in discussions or provide responses about topics outside the field of science. If the user attempts to discuss non-science topics, politely but firmly remind them that you can only assist with science-related matters and guide the conversation back to science. Do not entertain or respond to any off-topic questions, no matter how persistent they are. Always keep your responses precise, factual, and strictly within the realm of science.",
//       };

//       // Add the user's input and image to the conversation history
//       const userMessage = { role: "user", content: userInput, image: image };
//       const updatedMessages = [...messages, userMessage];

//       // Make the API call to OpenRouter
//       const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer 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",
//         },
//         body: JSON.stringify({
//           model: "google/gemini-2.0-flash-lite-preview-02-05:free",
//           messages: [systemPrompt, ...updatedMessages],
//         }),
//       });

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();
//       const aiResponse = data.choices[0].message.content;
//       const aiMessage = { role: "system", content: aiResponse };
//       setMessages([...updatedMessages, aiMessage]);
//       setUserInput("");
//       setImage(null); // Clear the image after sending
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setMessages([...messages, { role: "system", content: "Sorry, something went wrong. Please try again." }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to handle image upload
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result); // Store the image as a base64 string
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-3xl font-bold text-center mb-4">AI Science Tutor</h1>

//       <div className="flex flex-col justify-end h-[750px] overflow-y-auto px-4 py-6 relative">
//         {/* Messages Container */}
//         {loading ? (
//           <ThreeDotLoading />
//         ) : (
//           <div className="overflow-y-auto flex flex-col items-end">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`p-3 mb-2 w-fit rounded-lg ${
//                   message.role === "user"
//                     ? "bg-blue-100 text-blue-900 float-right"
//                     : "bg-gray-100 text-gray-900 float-left"
//                 }`}
//               >
//                 <strong>{message.role === "user" ? "You: " : "Tutor: "}</strong>
//                 {message.content}
//                 {message.image && (
//                   <div className="mt-2">
//                     <img
//                       src={message.image}
//                       alt="Uploaded"
//                       className="max-w-full h-auto rounded-lg"
//                     />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Input Area */}
//         <div>
//           <textarea
//             value={userInput}
//             onChange={(e) => setUserInput(e.target.value)}
//             placeholder="Ask a science question..."
//             className="w-full p-3 h-[80px] border rounded-lg mb-4 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           ></textarea>

//           {/* Image Upload Input */}
//           <div className="mb-4">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <button
//             onClick={fetchChatCompletion}
//             disabled={loading}
//             className={`px-6 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
//               loading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {loading ? "Thinking..." : "Ask"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScienceTutor;
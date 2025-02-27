



import React, { useState, useEffect, useRef, use } from "react";
import ThreeDotLoading from "../UI/ThreeDotLoading";
import { Upload, Send, FileText, User, Bot, Plus  } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const ScienceTutor = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [pdfText, setPdfText] = useState(''); // Store PDF text content
  const [knowledgeBase, setKnowledgeBase] = useState([]); // Store knowledge base content
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const fetchChatCompletion = async () => {
    setLoading(true);
    
    try {
      const systemPrompt = {
        role: "system",
        content: `
      You are a highly knowledgeable and focused science tutor. Your only purpose is to discuss, explain, and answer questions related to science. You can also discuss and provide answers based on PDF file content or images provided by the user. If the user has provided a PDF or image, use information from the PDF or image to provide assistance when relevant. Your assistance must be factual and strictly based on the data provided by the user. Do not use any external knowledge or pre-trained data. If the user attempts to discuss non-science topics, politely but firmly remind them that you can only assist with science-related matters and guide the conversation back to science. Do not entertain or respond to any off-topic questions, no matter how persistent they are.
      
      Knowledge Base:${knowledgeBase}.
        `,
      };

      
      const chatHistory = messages.map((message) => message)
      
      console.log(chatHistory);
      const chatMessages = [
         { role: "user", content: userInput }, // Always include the user's message
        ...(imageURL
          ? [{ role: "user", content: { type: "image_url", image_url: { url: imageURL } } }] // Image handling
          : []), // Conditionally add image URL
        ...(pdfText
          ? [{ role: "user", content: `Here's the content from the PDF:\n${pdfText}` }]
          : []),
      ];
  
      const formattedMessages = chatMessages.map((message) => {
        if (typeof message.content === "string") {
          return {
            role: message.role,
            content: [
              {
                type: "text",
                text: message.content,
              },
            ],
          };
        }
  
        if (message.content.type === "image_url") {
          return {
            role: message.role,
            content: [
              {
                type: "image_url",
                image_url: message.content.image_url,
              },
            ],
          };
        }
  
        return {
          role: message.role,
          content: [
            {
              type: "text",
              text: message.content,
            },
          ],
        };
      });
  
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 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",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-lite-preview-02-05:free",
          messages: [systemPrompt, ...formattedMessages],
          top_p: 1,
          temperature: 0.5,
          repetition_penalty: 1
        }),
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      const data = await res.json();
      const aiResponse = data.choices[0].message.content;
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: userInput, image: imageURL, pdfText: pdfText },
        { role: "system", content: aiResponse },
      ]);
      setUserInput("");
      setImage(null);
      setImageURL(null);
      setPdfText(""); // Clear document content after sending
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "system", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (file.type === "application/pdf") {
        processPDF(file);
      } else {
        //Process Images
        processImage(file);
      }
    }
  };

  const processImage = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      setImage(imageData);
      setImageURL(imageData); // Base64 placeholder for the image
      // setKnowledgeBase([...knowledgeBase, `${inputRef.current.value}: ${imageData}`]);
      // console.log("Image uploaded:",)
      
    };
    reader.readAsDataURL(file);
  };


const processPDF = async (file) => {
setFileLoading(true)
  const data={
    pdfFilePath:"C:\\Users\\saloo\\OneDrive\\Desktop\\Tutor\\tutor-app - v2\\public\\"+file.name,
  }
  try {
    const response = await fetch("http://localhost:5000/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Adjust as needed (e.g., multipart/form-data for file uploads)
      },
      body:JSON.stringify(data)  // Convert data to JSON string
    });

    if (!response.ok) {
      setFileLoading(false)
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Response from server:", result);
    setFileLoading(false)
  } catch (error) {
    console.error("Error during POST request:", error);
  }
  
}

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); 


  const handleFileUploadBase = (event) => {
    handleKnowledg();
    console.log(event.target.files[0]);
    
    const file = event.target.files[0]; // Get the first file from the input
    if (!file) {
        console.error("No file selected.");
        return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
        const imageData = reader.result;
        setKnowledgeBase([...knowledgeBase, `${inputRef.current.value}: ${imageData}`]);
        console.log("Image uploaded:", imageData);
    };

    reader.readAsDataURL(file); // Read the file as a Data URL
    event.target.value = null; // Reset the file input
};


  const handleKnowledg = () => {
    const data = inputRef.current.value;
    setKnowledgeBase([...knowledgeBase, data]);
    // console.log(knowledgeBase);
    inputRef.current.value = '';
  }

  return (
    <div className="p-6 mx-[200px] bg-gray-900  text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">AI Science Tutor</h1>

      <div className="flex flex-col justify-end h-[750px] overflow-y-auto relative px-4 py-6 bg-gray-800 rounded-lg">
        <div className="flex flex-col gap-4"> {!messages.length && <div className="text-center overflow-y-auto text-zinc-400">Start a conversation with the AI Science Tutor!</div>}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 mb-2 rounded-lg shadow-md ${
                message.role === "user"
                  ? "bg-blue-600 self-end"
                  : "bg-gray-700 self-start"
              }`}
            >
              <div className="flex items-center gap-2">
                {message.role === "user" ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
                <strong>
                  {message.role === "user" ? "You: " : "Tutor: "}
                </strong>
              </div>
              <div className="mt-1 text-sm">{message.content}</div>
              {message.image && (
                <img
                  src={message.image}
                  alt="Uploaded by user"
                  className="max-w-[200px] mt-2 rounded-lg"
                />
              )}
              {message.pdfText && (
                <div className="mt-2 p-2 border rounded-md bg-gray-800 text-sm max-h-40 overflow-auto">
                  <strong className="block mb-1">PDF Content:</strong>
                  {message.pdfText}
                </div>
              )}
            </div>
          ))}
          {loading && <ThreeDotLoading />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mt-4 flex gap-3 bg-gray-800 p-3 rounded-lg">

<div className="flex items-center gap-2">

<div className="rounded-lg flex h-[120px] bg-gray-700 p-3">
<input
  type="file"
  accept="image/*,application/pdf"
  onChange={handleFileUpload}
  className="hidden"
  id="file-upload" // ID matches
/>
<label
  htmlFor="file-upload" // Reference updated
  className="cursor-pointer flex items-center gap-2 text-gray-300 hover:text-white"
>
  {fileLoading ? <LoadingSpinner /> : <Upload className="w-5 h-5" />}
  <span>{fileLoading ? "Uploading File" : imageURL ? "Uploaded" : "Upload File"}</span>
</label>

</div>
        

</div>


        <div className="w-[100%] h-[vh] flex flex-col justify-center gap-2">
          
<div
className="flex items-center gap-2 pb-2">

<input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a science question..."
          className="flex-1 p-3 h-[50px] bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchChatCompletion}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Send className="w-5 h-5" />
          {loading ? "Thinking..." : "Send"}
        </button>
        
</div>

<div
className="flex items-center gap-2 pb-2">

<input
          // value={userInput}
          ref={inputRef}
          // onChange={(e) => setUserInput(e.target.value)}
          placeholder="Add data to Knowledgeable Base..."
          className="flex-1 p-3 h-[50px] bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleKnowledg}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Plus className="w-5 h-5" />
          {loading ? "Adding..." : "Add"}
        </button>
</div>

        </div>

      </div>
    </div>
  );
};

export default ScienceTutor;


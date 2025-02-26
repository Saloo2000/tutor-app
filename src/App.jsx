
import "./App.css";
import ScienceTutor from "./UI/Science v-1"; // Updated import
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import PDFToImage from "./UI/PDFUploader";
// import pdf from "../public/sal.pdf"

function App() {
  const basename = process.env.NODE_ENV === "production" ? "/tutor-app/" : "/";

  return (
    <div>
      <BrowserRouter basename="/tutor-app">
        <Routes>
          <Route path="/" element={<ScienceTutor />} />
          {/* <Route path="/pdf" element={<PDFToImage pdfUrl={pdf} />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

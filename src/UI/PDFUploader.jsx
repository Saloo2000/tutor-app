import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFToImage = () => {
  const [pdfImages, setPdfImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
      setLoading(true);
      try {
        // Read the PDF file
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

          const images = [];
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);

            // Create a canvas for each page
            const viewport = page.getViewport({ scale: 2 }); // Adjust scale for quality
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Render PDF page into the canvas
            await page.render({ canvasContext: context, viewport }).promise;

            // Convert canvas to an image (data URL)
            const imageUrl = canvas.toDataURL("image/png");
            images.push(imageUrl);
          }

          setPdfImages(images);
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error processing PDF:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">PDF to Image Converter</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={handlePDFUpload}
        className="mb-4"
      />

      {loading && <p>Loading PDF...</p>}

      <div className="flex flex-col gap-4">
        {pdfImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Page ${index + 1}`}
            className="w-full border rounded-md shadow-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default PDFToImage;

// const path = require("path");
import path from "path"
// const pdfPoppler = require("pdf-poppler");
import pdfPoppler from "pdf-poppler"


// Function to convert PDF to images
export const convertPdfToImages = async (pdfFilePath, outputDir) => {
  try {
    // Ensure output folder exists
    const outputBaseName = path.basename(pdfFilePath, path.extname(pdfFilePath)); // Get file name without extension

    const options = {
      format: "jpeg",      // Output format (can be "jpeg" or "png")
      out_dir: outputDir,  // Output directory for images
      out_prefix: outputBaseName, // Prefix for output images
      page: null,          // If null, it converts all pages
    };

    // Convert PDF to images
    const result = await pdfPoppler.convert(pdfFilePath, options);
    return result
    console.log("Conversion successful! Images saved at:", outputDir);
  } catch (error) {
    console.error("Error converting PDF to images:", error);
  }
};

// Paths for input and output
const inputPdfPath = path.resolve(__dirname, "input/sal.pdf"); // Replace 'sample.pdf' with your PDF name
const outputDirPath = path.resolve(__dirname, "output");

// Convert PDF to images
// convertPdfToImages(inputPdfPath, outputDirPath);

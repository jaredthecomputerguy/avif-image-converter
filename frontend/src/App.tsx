import { useState, useCallback, CSSProperties } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const App = () => {
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [convertedFileName, setConvertedFileName] = useState<string | null>(
    null
  );

  const fileUrl = `http://localhost:8000${convertedFileUrl}`;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await axios.post(
          "http://localhost:8000/convert",
          formData
        );

        console.log("File uploaded successfully:", response.data);
        setConvertedFileUrl(response.data.imageUrl);
        setConvertedFileName(response.data.fileName);
      } else {
        console.error("No file selected");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }, []);

  const dropzoneStyles: CSSProperties = {
    border: "2px dashed #ccc",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const downloadImage = async () => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      // Use the File System Access API to show a file picker
      // @ts-expect-error Not supported in firefox, but is supported in Chrome
      const handle = await window.showSaveFilePicker({
        suggestedName: convertedFileName ?? "downloaded_image.png",
        types: [
          {
            description: "PNG Files",
            accept: {
              "image/png": [".png"],
            },
          },
        ],
      });

      // Create a writable stream to the selected file
      const writable = await handle.createWritable();

      // Write the blob to the file
      await writable.write(blob);

      // Close the file
      await writable.close();
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center py-8">
      <h1 className="text-4xl py-16">Image Converter</h1>
      <div className="flex flex-col gap-8 text-center pb-32">
        <div
          {...getRootProps()}
          className="hover:bg-zinc-100/5"
          style={dropzoneStyles}
        >
          <input {...getInputProps()} />
          <p>Drag & drop an image here, or click to select one</p>
        </div>
        {convertedFileUrl ? (
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-xl">Converted File</h2>
            <img
              className="w-64 h-64 cursor-pointer object-contain border border-gray-100/25 rounded-lg p-2 hover:border-gray-100 hover:bg-zinc-100/5 focus:border-gray-100 focus:bg-zinc-100/5"
              src={fileUrl}
              alt="Converted image"
              onClick={downloadImage}
            />
            <button
              className="border border-gray-100/25 p-4 rounded-lg hover:border-gray-100 hover:bg-zinc-100/5 focus:border-gray-100 focus:bg-zinc-100/5"
              onClick={downloadImage}
            >
              Download Image
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <footer className="fixed bottom-6">
        Made by{" "}
        <a
          className="text-cyan-600 hover:text-cyan-400 focus:text-cyan-400 active:text-cyan-400"
          href="https://www.github.com/jaredthecomputerguy"
          target="_blank"
        >
          Jared Mercer
        </a>
      </footer>
    </main>
  );
};

export default App;

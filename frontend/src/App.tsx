import { useState, useCallback, CSSProperties } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const App = () => {
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [convertedFileName, setConvertedFileName] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const fileUrl = `http://localhost:8000${convertedFileUrl}`;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];

    setError("");

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await axios.post(
          "http://localhost:8000/convert",
          formData,
        );

        console.log("File uploaded successfully:", response.data);
        setConvertedFileUrl(response.data.imageUrl);
        setConvertedFileName(response.data.fileName);
      } else {
        console.error("No file selected");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error uploading file:", err);
        setError(err.message);
      } else {
        console.error("Error uploading file:", err);
        // @ts-expect-error Not sure how to type narrow this
        setError(err.response.data.error);
      }
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
    <main className="flex h-screen flex-col items-center justify-center">
      <h1 className="py-16 text-4xl">Image Converter</h1>
      <div className="flex flex-col gap-8 pb-6 text-center">
        <div
          {...getRootProps()}
          className="hover:bg-zinc-100/5"
          style={dropzoneStyles}
        >
          <input {...getInputProps()} />
          <p>Drag & drop an image here, or click to select one</p>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {convertedFileUrl ? (
          <div className="flex flex-col items-center gap-6">
            <img
              className="h-48 w-48 cursor-pointer rounded-lg border border-gray-100/25 object-contain p-2 hover:border-gray-100 hover:bg-zinc-100/5 focus:border-gray-100 focus:bg-zinc-100/5"
              src={fileUrl}
              alt="Converted image"
              onClick={downloadImage}
            />
            <button
              className="rounded-lg border border-gray-100/25 p-4 hover:border-gray-100 hover:bg-zinc-100/5 focus:border-gray-100 focus:bg-zinc-100/5"
              onClick={downloadImage}
            >
              Download Image (Chrome)
            </button>
            <a
              href={`/uploads/${convertedFileUrl}`}
              download={convertedFileName}
            >
              Download Image (Firefox)
            </a>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <footer className="fixed bottom-2 rounded-lg bg-slate-800 p-2">
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

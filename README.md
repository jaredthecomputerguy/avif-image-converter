# Avif Image Converter

This repository contains the frontend and backend components of the Avif Image Converter application. The application allows users to upload AVIF images, convert them to PNG on the backend, and download the converted images.
Frontend
Features

- Drag-and-drop or select an AVIF image to upload.
- Convert AVIF image to PNG.
- Download the converted PNG image.

## Prerequisites

1. Node.js and npm installed.

## Usage

1. Open the application in your web browser.

2. Drag-and-drop an AVIF image or click to select one.

3. Click the "Upload" button to convert the image to PNG on the backend.

4. Once converted, you can view the image and download it using the "Download Image" button.

## How to Create a Shell Command

To create a shell command after downloading the repository, follow these steps:

1. Open the terminal of your choice.

3. Navigate to ~/.local/bin.

3. Create a new file named "avif-image-converter" with the following content:
```sh
#!/bin/bash

AVIF_IMAGE_CONVERTER_PATH=path/to/avif-image-converter

npx concurrently -p "[{name}]" -n "API,WEB" -c "auto" \
"npm --prefix $AVIF_IMAGE_CONVERTER_PATH/backend run dev" \
"npm --prefix $AVIF_IMAGE_CONVERTER_PATH/frontend run dev"

```

4. Make the script executable by running the following command:

```sh
chmod +x avif-image-converter
```

5. Run the script to start the application:

```sh
./avif-image-converter
```

6. (Optional) Add the ~/.local/bin directory to your PATH environment variable by running the following command:

```sh
export PATH="$PATH:$HOME/.local/bin"
```

7. You can now run the application by typing "avif-image-converter" in the terminal.

```sh
avif-image-converter
```

## Technologies Used

- React
- Typescript
- Axios
- React-Dropzone
- Express
- Multer
- Cors
- Node
- Sharp

## License

This project is licensed under the MIT License.

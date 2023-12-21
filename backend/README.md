# Avif Image Converter Backend

This is the backend component of the Avif Image Converter application. It provides an API endpoint for uploading AVIF images, converting them to PNG, and serving the converted images.

## Features

- Accept AVIF image uploads.
- Convert AVIF image to PNG.
- Serve the converted PNG image.
- Health check endpoint.

## Prerequisites

- Node.js installed.
- Express, Multer, Sharp, CORS installed.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/jaredthecomputerguy/avif-image-converter
   ```

2. Navigate to the backend directory:

   ```bash
   cd backend
   ```

3. Install the dependencies:

   ```bash
   npm i
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

## API Endpoints

1. GET /health: Check the health of the backend.

2. POST /convert: Upload an AVIF image and receive the converted PNG image.

## Technologies Used

- Express
- Multer
- Cors
- Node
- Sharp

## License

This project is licensed under the MIT license.

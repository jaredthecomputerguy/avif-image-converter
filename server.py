from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from PIL import Image
from io import BytesIO

app = FastAPI()

@app.get("/")
def root():
    return {"test": "message"}

@app.post("/convert")
async def convert_image(file: UploadFile = File(...)):
    try:
        # Check if the uploaded file is .avif
        if not file.filename.lower().endswith(('.avif')):
            raise HTTPException(status_code=400, detail="Only .avif files are allowed.")

        # Read the .avif file and convert to .png
        avif_content = await file.read()
        with Image.open(BytesIO(avif_content)) as img:
            png_content = BytesIO()
            img.save(png_content, format='PNG')
            png_content.seek(0)

        # Return the converted .png as a StreamingResponse
        return StreamingResponse(io=png_content, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during conversion: {e}")

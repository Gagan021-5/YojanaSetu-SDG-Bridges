import whisper
import sys

file_path = sys.argv[1]  # Get audio path from Node

model = whisper.load_model("base")  # You can use small/medium for better accuracy
result = model.transcribe(file_path, language="hi")  # Use "mr" for Marathi

print(result["text"])

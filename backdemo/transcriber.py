import sys
import whisper

sys.stdout.reconfigure(encoding='utf-8')  # enable emoji

file_path = sys.argv[1]
print("📂 Incoming file:", file_path)

model = whisper.load_model("base")
result = model.transcribe(file_path)

print(f"{result['language']}|||{result['text']}")


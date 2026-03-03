import asyncio
from services.translation_engine import translation_engine

async def main():
    texts = [
        "Welcome to our application.",
        "Please select your language.",
        "This is a test of the translation system.",
        "Thank you for using our services."
    ]
    for text in texts:
        print(f"Original: {text}")
        mni_text = await translation_engine.translate(text, "en", "mni")
        print(f"Manipuri: {mni_text}\n")

if __name__ == "__main__":
    asyncio.run(main())

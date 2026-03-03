import asyncio
from services.translation_engine import translation_engine

async def main():
    text = "Hello, how are you today?"
    print(f"Original: {text}")
    print("Translating to Manipuri...")
    mni_text = await translation_engine.translate(text, "en", "mni")
    print(f"Manipuri: {mni_text}")

if __name__ == "__main__":
    asyncio.run(main())

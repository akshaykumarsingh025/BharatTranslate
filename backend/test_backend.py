import asyncio
import io
import aiohttp

async def test_api():
    base_url = "http://localhost:8000/v1"
    
    print("-----------------------------------")
    print("Testing Text Translation API")
    print("-----------------------------------")
    try:
        async with aiohttp.ClientSession() as session:
            payload = {
                "text": "What are you doing brother?",
                "source_lang": "en",
                "target_lang": "hi"
            }
            async with session.post(f"{base_url}/translate/text", json=payload) as resp:
                result = await resp.json()
                print(f"Status: {resp.status}")
                print(f"Response: {result}")
    except Exception as e:
        print(f"Error: {e}")

    print("\n-----------------------------------")
    print("Testing ASR (Audio to Text) API")
    print("-----------------------------------")
    try:
        async with aiohttp.ClientSession() as session:
            data = aiohttp.FormData()
            # dummy file to bypass fastpi requirement
            data.add_field('file', io.BytesIO(b'dummy_audio'), filename='audio.m4a', content_type='audio/m4a')
            data.add_field('language', 'en')
            
            async with session.post(f"{base_url}/asr/transcribe", data=data) as resp:
                result = await resp.json()
                print(f"Status: {resp.status}")
                print(f"Response: {result}")
    except Exception as e:
        print(f"Error: {e}")

    print("\n-----------------------------------")
    print("Testing OCR (Image to Text) API")
    print("-----------------------------------")
    try:
        async with aiohttp.ClientSession() as session:
            data = aiohttp.FormData()
            data.add_field('file', io.BytesIO(b'dummy_image'), filename='image.jpg', content_type='image/jpeg')
            data.add_field('language', 'en')
            
            async with session.post(f"{base_url}/ocr/extract", data=data) as resp:
                result = await resp.json()
                print(f"Status: {resp.status}")
                print(f"Response: {result}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_api())

import io
import PyPDF2
import docx
from services.translation_engine import translation_engine

def extract_text(file_bytes: bytes, filename: str) -> str:
    """Extract text from PDF, DOCX, or TXT formats."""
    text = ""
    try:
        if filename.lower().endswith(".pdf"):
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            for page in pdf_reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        elif filename.lower().endswith(".docx"):
            document = docx.Document(io.BytesIO(file_bytes))
            for paragraph in document.paragraphs:
                text += paragraph.text + "\n"
        elif filename.lower().endswith(".txt"):
            text = file_bytes.decode('utf-8')
    except Exception as e:
        print(f"Extraction error: {e}")
        return ""
    
    return text.strip()

def chunk_text(text: str, max_chunk_size: int = 400) -> list:
    """Splits text into manageable chunks for the translation engine based on length."""
    sentences = text.replace('\n', ' ').split('.')
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
            
        if len(current_chunk) + len(sentence) < max_chunk_size:
            current_chunk += sentence + ". "
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence + ". "
            
    if current_chunk:
        chunks.append(current_chunk.strip())
        
    return chunks

async def translate_document(chunks: list, source_lang: str, target_lang: str) -> list:
    """Translates a list of text chunks asynchronously."""
    translated_chunks = []
    for chunk in chunks:
        try:
             translated_chunk = await translation_engine.translate(chunk, source_lang, target_lang)
             translated_chunks.append(translated_chunk)
        except Exception as e:
             print(f"Chunk translation error: {e}")
             translated_chunks.append(chunk) # Fallback to original text on error
             
    return translated_chunks

import sys
from pypdf import PdfReader

def extract_pdf_text(filepath):
    try:
        reader = PdfReader(filepath)
        text = ""
        for i, page in enumerate(reader.pages):
            text += f"\n--- Page {i+1} ---\n"
            text += page.extract_text()
        return text
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        filepath = sys.argv[1]
    else:
        filepath = r"c:\Users\kadal\Documents\AI-ML-Smartbridge-Project-Credit-Card-Approval-Prediction\AI-ML-Smartbridge-Project-Credit-Card-Approval-Prediction--main\8.Project Demonstration\Demonstration of Proposed Features.pdf"
    text = extract_pdf_text(filepath)
    with open("pdf_extracted_text.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Extracted text saved to pdf_extracted_text.txt")

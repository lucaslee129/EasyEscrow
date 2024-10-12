import fitz  # PyMuPDF


def extract_text_from_pdf(pdf_path):
    # Open the PDF
    pdf_document = fitz.open(pdf_path)
    text = ""

    # Iterate through the pages and extract text
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        text += page.get_text("text")

    return text


pdf_path = "data/setupS3.pdf"

# Extract text from the PDF
extracted_text = extract_text_from_pdf(pdf_path)

# Print the extracted text
print(extracted_text)

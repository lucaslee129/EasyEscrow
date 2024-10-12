from extraction import extract_text_from_pdf
from sample import getComponents

path = "data/FakeEscrow1.pdf"

# Extract text from the PDF
extracted_text = extract_text_from_pdf(path)
print(extracted_text)

components = getComponents(extracted_text)
print(components)

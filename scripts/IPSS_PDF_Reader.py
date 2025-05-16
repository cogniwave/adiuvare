# The warning "CropBox missing from /Page, defaulting to MediaBox" can be safely ignored.
# The script will run as normal.

import pdfplumber
import csv

# Path to the PDF file
pdf_path = r"filestoParse/IPSS.pdf"

# Expected headers
headers = ["DENOMINAÇÃO", "MORADA", "CONCELHO", "DISTRITO", "FORMA JURÍDICA", "ANO REGISTO", "NIPC"]

batch_size = 100

# Open the PDF
with pdfplumber.open(pdf_path) as pdf:
    all_documents = []
    for page in pdf.pages:
        tables = page.extract_tables()
        page_rows = []

        # Combine all rows from all tables on the page
        for table in tables:
            for row in table:
                if len(row) == len(headers):
                    page_rows.append(row)

        # Skip the first row of the page (usually header)
        for row in page_rows[1:]:
            document = [cell.strip() if cell else "" for cell in row]
            all_documents.append(document)

# Save to CSV file
if all_documents:
    with open("generatedFiles/IPSS.csv", "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
        for i in range(0, len(all_documents), batch_size):
            batch = all_documents[i:i+batch_size]
            writer.writerows(batch)
            print(f"✅ Batch {i//batch_size+1}: {len(batch)} rows written.")
    print(f"✅ {len(all_documents)} rows saved to generatedFiles/IPSS.csv successfully.")
else:
    print("⚠️ No valid table found in the PDF.")
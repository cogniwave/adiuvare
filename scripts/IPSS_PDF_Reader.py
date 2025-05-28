# The warning "CropBox missing from /Page, defaulting to MediaBox" can be safely ignored.
# The script will run as normal.

import pdfplumber
import csv
import os
from crawl_constants import CSV_FIELDS  

# Path to the PDF file
pdf_path = r"filestoParse/IPSS.pdf"

# Expected headers
headers = ["DENOMINAÇÃO", "MORADA", "CONCELHO", "DISTRITO", "FORMA JURÍDICA", "ANO REGISTO", "NIPC"]

batch_size = 100

merged_csv = "generatedFiles/merged_output.csv"
# all_fields = [
#     "NOME ONGD", "TELEFONE / TELEMÓVEL", "EMAIL", "SITE", "MORADA",
#     "CONCELHO", "DISTRITO", "FORMA JURÍDICA", "ANO REGISTO", "NIPC",
#     "Código Postal", "LOGOTIPO", "SOURCE"
# ]

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

# Map IPSS fields to unified fields
def map_ipss_row(row):
    # headers = ["DENOMINAÇÃO", "MORADA", "CONCELHO", "DISTRITO", "FORMA JURÍDICA", "ANO REGISTO", "NIPC"]
    return [
        row[0] if len(row) > 0 else "",  # NOME ONGD (from DENOMINAÇÃO)
        "", "", "", "",                  # TELEFONE / TELEMÓVEL, EMAIL, SITE, MORADA
        row[2] if len(row) > 2 else "",  # CONCELHO
        row[3] if len(row) > 3 else "",  # DISTRITO
        row[4] if len(row) > 4 else "",  # FORMA JURÍDICA
        row[5] if len(row) > 5 else "",  # ANO REGISTO
        row[6] if len(row) > 6 else "",  # NIPC
        "",  # Código Postal
        "",  # LOGOTIPO
        "IPSS"
    ]

# Save to merged CSV file
if all_documents:
    write_header = not os.path.exists(merged_csv)
    with open(merged_csv, "a", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        if write_header:
            writer.writerow(CSV_FIELDS)  
        mapped_rows = [map_ipss_row(row) for row in all_documents]
        for i in range(0, len(mapped_rows), batch_size):
            batch = mapped_rows[i:i+batch_size]
            writer.writerows(batch)
            print(f"✅ Batch {i//batch_size+1}: {len(batch)} rows written from IPSS.")
    print(f"✅ {len(mapped_rows)} rows from IPSS saved to {merged_csv} successfully.")
else:
    print("⚠️ No valid table found in the PDF.")
import pdfplumber
import csv
import os

# Path to the PDF file
pdf_path = r"filestoParse/ONGAs.e.equiparadas.pdf"
# Output CSV path
output_csv = "generatedFiles/ONGAs.e.equiparadas.csv"

# Expected headers in the PDF (for reference)
expected_headers = ["Nome", "Morada", "Código Postal", "e-mail"]

# Ensure output directory exists
os.makedirs(os.path.dirname(output_csv), exist_ok=True)

batch_size = 100

all_rows = []

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            # Find the header row index
            header_idx = None
            for idx, row in enumerate(table):
                if row and all(h in (row_cell or "") for h, row_cell in zip(expected_headers, row)):
                    header_idx = idx
                    break
            if header_idx is not None:
                # Get column indices for the required headers
                header_row = table[header_idx]
                col_indices = []
                for h in expected_headers:
                    try:
                        col_indices.append(header_row.index(h))
                    except ValueError:
                        col_indices.append(None)
                # Extract data rows
                for data_row in table[header_idx+1:]:
                    if len(data_row) >= max([i for i in col_indices if i is not None])+1:
                        extracted = []
                        for i in col_indices:
                            extracted.append(data_row[i].strip() if i is not None and data_row[i] else "")
                        all_rows.append(extracted)

# Write to CSV
if all_rows:
    with open(output_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(expected_headers)
        for i in range(0, len(all_rows), batch_size):
            batch = all_rows[i:i+batch_size]
            writer.writerows(batch)
            print(f"✅ Batch {i//batch_size+1}: {len(batch)} rows written.")
    print(f"✅ {len(all_rows)} rows saved to {output_csv} successfully.")
else:
    print("⚠️ No valid table found in the PDF.")

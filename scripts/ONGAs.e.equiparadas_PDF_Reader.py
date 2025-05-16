import pdfplumber
import csv
import os

# Path to the PDF file
pdf_path = r"filestoParse/ONGAs.e.equiparadas.pdf"
# Output merged CSV path
merged_csv = "generatedFiles/merged_output.csv"

# All fields for the merged file (without "DENOMINAÇÃO")
all_fields = [
    "NOME ONGD", "TELEFONE / TELEMÓVEL", "EMAIL", "SITE", "MORADA",
    "CONCELHO", "DISTRITO", "FORMA JURÍDICA", "ANO REGISTO", "NIPC",
    "Código Postal", "SOURCE"
]

# Expected headers in the PDF (for reference)
expected_headers = ["Nome", "Morada", "Código Postal", "e-mail"]

# Ensure output directory exists
os.makedirs(os.path.dirname(merged_csv), exist_ok=True)

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
                        # Map to all fields in the unified header
                        nome = data_row[col_indices[0]].strip() if col_indices[0] is not None and data_row[col_indices[0]] else ""
                        morada = data_row[col_indices[1]].strip() if col_indices[1] is not None and data_row[col_indices[1]] else ""
                        codigo_postal = data_row[col_indices[2]].strip() if col_indices[2] is not None and data_row[col_indices[2]] else ""
                        email = data_row[col_indices[3]].strip() if col_indices[3] is not None and data_row[col_indices[3]] else ""
                        extracted = [
                            nome, "", email, "", morada,  # NOME ONGD, TELEPHONE / MOBILE, EMAIL, SITE, ADDRESS
                            "", "", "", "", "",           # MUNICIPALITY, DISTRICT, LEGAL FORM, REGISTRATION YEAR, NIPC
                            codigo_postal, "ONGAs"
                        ]
                        all_rows.append(extracted)

# Write to merged CSV
if all_rows:
    write_header = not os.path.exists(merged_csv)
    with open(merged_csv, "a", newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        if write_header:
            writer.writerow(all_fields)
        for i in range(0, len(all_rows), batch_size):
            batch = all_rows[i:i+batch_size]
            writer.writerows(batch)
            print(f"✅ Batch {i//batch_size+1}: {len(batch)} rows written from ONGAs.")
    print(f"✅ {len(all_rows)} rows from ONGAs saved to {merged_csv} successfully.")
else:
    print("⚠️ No valid table found in the PDF.")

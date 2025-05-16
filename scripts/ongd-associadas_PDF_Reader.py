import csv
import os

input_csv = "filestoParse/ongd-associadas.csv"
output_csv = "generatedFiles/ongd-associadas-parsed.csv"

# Ensure output directory exists
os.makedirs(os.path.dirname(output_csv), exist_ok=True)

fields_to_extract = [
    "NOME ONGD",
    "TELEFONE / TELEMÓVEL",
    "EMAIL",
    "SITE",
    "MORADA"
]

batch_size = 100
rows = []

with open(input_csv, newline='', encoding='latin1') as infile:
    reader = csv.DictReader(infile, delimiter=';')
    for row in reader:
        extracted = [(row.get(field) or "").strip() for field in fields_to_extract]
        rows.append(extracted)

with open(output_csv, "w", newline='', encoding='utf-8') as outfile:
    writer = csv.writer(outfile)
    writer.writerow(fields_to_extract)
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i+batch_size]
        writer.writerows(batch)
        print(f"✅ Batch {i//batch_size+1}: {len(batch)} rows written.")

print(f"✅ {len(rows)} rows saved to {output_csv} successfully.")

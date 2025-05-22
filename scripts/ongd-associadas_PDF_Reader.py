import csv
import os

input_csv = "filestoParse/ongd-associadas.csv"
merged_csv = "generatedFiles/merged_output.csv"

# Unified header without "DENOMINAÇÃO"
all_fields = [
    "NOME ONGD", "TELEFONE / TELEMÓVEL", "EMAIL", "SITE", "MORADA",
    "CONCELHO", "DISTRITO", "FORMA JURÍDICA", "ANO REGISTO", "NIPC",
    "Código Postal", "LOGOTIPO", "SOURCE"
]

batch_size = 100
rows = []

with open(input_csv, newline='', encoding='latin1') as infile:
    reader = csv.DictReader(infile, delimiter=';')
    for row in reader:
        # Fill the unified header fields, using "" for fields not present in this source
        data = [
            (row.get("NOME ONGD") or "").strip(),
            (row.get("TELEFONE / TELEMÓVEL") or "").strip(),
            (row.get("EMAIL") or "").strip(),
            (row.get("SITE") or "").strip(),
            (row.get("MORADA") or "").strip(),
            "", "", "", "", "", "",  # Extra fields not present in this source
            "",  # LOGOTIPO
            "ONGD"
        ]
        rows.append(data)

write_header = not os.path.exists(merged_csv)
with open(merged_csv, "a", newline='', encoding='utf-8') as outfile:
    writer = csv.writer(outfile)
    if write_header:
        writer.writerow(all_fields)
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i+batch_size]
        writer.writerows(batch)
        print(f"✅ Batch {i//batch_size+1}: {len(batch)} rows written from ONGD.")

print(f"✅ {len(rows)} rows from ONGD saved to {merged_csv} successfully.")

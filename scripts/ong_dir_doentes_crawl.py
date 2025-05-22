import requests
from bs4 import BeautifulSoup
import csv
import urllib3
import os

BASE_URL = "https://ong.pt/dir/74-ambito-nacional-1?site={}"
ORG_BASE = "https://ong.pt"
OUTPUT_CSV = "generatedFiles/merged_output.csv"

CSV_FIELDS = [
    "NOME ONGD", "TELEFONE / TELEMÓVEL", "EMAIL", "SITE", "MORADA",
    "CONCELHO", "DISTRITO", "FORMA JURÍDICA", "ANO REGISTO", "NIPC",
    "Código Postal", "LOGOTIPO", "SOURCE"
]

def extract_detail_data(soup):
    entry = soup.find("div", class_="SPDetailEntry")
    if not entry:
        return None
    # Nome
    name_tag = entry.find("h1")
    name = name_tag.get_text(strip=True) if name_tag else ""

    # Objeto da Organização
    obj_div = entry.find("div", class_="field_objeto_da_organizacao")
    objeto = ""
    if obj_div:
        strong = obj_div.find("strong")
        if strong:
            objeto = obj_div.get_text(strip=True).replace(strong.get_text(strip=True), "").strip(": ").strip()
        else:
            objeto = obj_div.get_text(strip=True)

    # NIF
    nif_div = entry.find("div", class_="field_nif")
    nif = ""
    if nif_div:
        strong = nif_div.find("strong")
        if strong:
            nif = nif_div.get_text(strip=True).replace(strong.get_text(strip=True), "").strip(": ").strip()
        else:
            nif = nif_div.get_text(strip=True)

    # Morada
    morada_div = entry.find("div", class_="field_morada")
    morada = ""
    if morada_div:
        strong = morada_div.find("strong")
        if strong:
            morada = morada_div.get_text(strip=True).replace(strong.get_text(strip=True), "").strip(": ").strip()
        else:
            morada = morada_div.get_text(strip=True)

    # Telefone
    tel_div = entry.find("div", class_="field_telefone")
    telefone = ""
    if tel_div:
        strong = tel_div.find("strong")
        if strong:
            telefone = tel_div.get_text(strip=True).replace(strong.get_text(strip=True), "").strip(": ").strip()
        else:
            telefone = tel_div.get_text(strip=True)

    # Email
    email = ""
    email_a = entry.find("a", class_="spClassEmail field_email")
    if email_a:
        email = email_a.get("href", "").replace("mailto:", "").strip()
        if not email:
            email = email_a.get_text(strip=True)

    # Site
    site = ""
    site_a = entry.find("a", class_="spClassUrl field_site")
    if site_a and site_a.has_attr("href"):
        site = site_a["href"].strip()

    # Logotipo
    logo = ""
    logo_img = entry.find("img", class_="spClassImage field_logo")
    if logo_img and logo_img.has_attr("src"):
        logo = logo_img["src"].strip()

    # Monta linha para o CSV
    return {
        "NOME ONGD": name,
        "TELEFONE / TELEMÓVEL": telefone,
        "EMAIL": email,
        "SITE": site,
        "MORADA": morada,
        "CONCELHO": "",
        "DISTRITO": "",
        "FORMA JURÍDICA": "",
        "ANO REGISTO": "",
        "NIPC": nif,
        "Código Postal": "",
        "LOGOTIPO": logo,
        "SOURCE": "ONG.PT"
    }

def main():
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    all_data = []
    print("Starting crawling pages...")
    for page in range(1, 10):
        url = BASE_URL.format(page)
        print(f"Processing page {page}: {url}")
        try:
            resp = requests.get(url, verify=False)
        except Exception as e:
            print(f"Error accessing {url}: {e}")
            continue
        if resp.status_code != 200:
            print(f"Failed to access {url} (status {resp.status_code})")
            continue
        soup = BeautifulSoup(resp.text, "html.parser")
        for row in soup.find_all("div", class_="row-fluid"):
            h2 = row.find("h2", class_="lead page-header")
            if not h2:
                continue
            a = h2.find("a", href=True)
            if not a:
                continue
            org_url = ORG_BASE + a["href"]
            print(f"  Fetching organization details: {org_url}")
            try:
                org_resp = requests.get(org_url, verify=False)
                if org_resp.status_code != 200:
                    print(f"    Failed to access {org_url} (status {org_resp.status_code})")
                    continue
                org_soup = BeautifulSoup(org_resp.text, "html.parser")
                detalhes = extract_detail_data(org_soup)
                if detalhes and detalhes["NOME ONGD"]:
                    all_data.append(detalhes)
                    print(f"    OK: {detalhes['NOME ONGD']}")
                else:
                    print(f"    Insufficient data at {org_url}")
            except Exception as e:
                print(f"    Error processing {org_url}: {e}")
                continue

    print(f"Saving {len(all_data)} records to {OUTPUT_CSV}...")
    os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)
    write_header = not os.path.exists(OUTPUT_CSV)
    with open(OUTPUT_CSV, "a", newline='', encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        if write_header:
            writer.writeheader()
        for row in all_data:
            writer.writerow(row)
    print("Concluído.")

if __name__ == "__main__":
    main()

import requests
from bs4 import BeautifulSoup
import csv
from os import path, makedirs
import urllib3

def crawl_pages(base_url, org_base, output_csv, csv_fields, page_range, extract_detail_data):
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    all_data = []
    print("Starting crawling pages...")
    for page in page_range:
        url = base_url.format(page)
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
            org_url = org_base + a["href"]
            print(f"  Fetching organization details: {org_url}")
            try:
                org_resp = requests.get(org_url, verify=False)
                if org_resp.status_code != 200:
                    print(f"    Failed to access {org_url} (status {org_resp.status_code})")
                    continue
                org_soup = BeautifulSoup(org_resp.text, "html.parser")
                detalhes = extract_detail_data(org_soup)
                if detalhes and detalhes.get("NOME ONGD"):
                    all_data.append(detalhes)
                    print(f"    OK: {detalhes['NOME ONGD']}")
                else:
                    print(f"    Insufficient data at {org_url}")
            except Exception as e:
                print(f"    Error processing {org_url}: {e}")
                continue
    print(f"Saving {len(all_data)} records to {output_csv}...")
    makedirs(path.dirname(output_csv), exist_ok=True)
    write_header = not path.exists(output_csv)
    with open(output_csv, "a", newline='', encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=csv_fields)
        if write_header:
            writer.writeheader()
        for row in all_data:
            writer.writerow(row)
    print("Concluído.")

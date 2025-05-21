import requests
from bs4 import BeautifulSoup
import csv
import os

def crawl_associacoes():
    url = "https://www.unidosparaosdireitoshumanos.com.pt/voices-for-human-rights/human-rights-organizations/non-governmental.html"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    html = response.text

    soup = BeautifulSoup(html, 'html.parser')

    # Find the content div with the organizations
    content_div = soup.find('div', class_='content')
    if not content_div:
        print("Content div not found.")
        return

    orgs = []
    # Find all <strong> tags that are followed by a <a> (site) or by text and then a <a>
    for strong in content_div.find_all('strong'):
        # Get the name (strip trailing colon)
        name = strong.get_text(strip=True).rstrip(':')
        # Find the next <a> after this <strong>
        a = strong.find_next('a', href=True)
        # Only consider <a> that is not an image link
        if a and a.get('href', '').startswith('http'):
            site = a.get_text(strip=True)
            # Sometimes the <a> text is the url, sometimes not
            if not site or site.startswith('www.'):
                site = a['href']
            orgs.append((name, site))
        else:
            # Try to find <a> in the next siblings (for some orgs)
            next_a = None
            for sib in strong.next_siblings:
                if getattr(sib, "name", None) == "a" and sib.get('href', '').startswith('http'):
                    next_a = sib
                    break
            if next_a:
                site = next_a.get_text(strip=True)
                if not site or site.startswith('www.'):
                    site = next_a['href']
                orgs.append((name, site))

    # Remove empty names/sites and duplicates
    orgs = [(n, s) for n, s in orgs if n and s]
    orgs = list(dict.fromkeys(orgs))  # remove duplicates, keep order

    # Write to merged_output.csv
    merged_csv = "generatedFiles/merged_output.csv"
    all_fields = [
        "NOME ONGD", "TELEFONE / TELEMÓVEL", "EMAIL", "SITE", "MORADA",
        "CONCELHO", "DISTRITO", "FORMA JURÍDICA", "ANO REGISTO", "NIPC",
        "Código Postal", "SOURCE"
    ]
    write_header = not os.path.exists(merged_csv)
    os.makedirs(os.path.dirname(merged_csv), exist_ok=True)
    with open(merged_csv, 'a', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        if write_header:
            writer.writerow(all_fields)
        for name, site in orgs:
            writer.writerow([
                name, "", "", site, "", "", "", "", "", "", "", "UNIDOS_DH"
            ])
    print(f"Dados de {len(orgs)} organizações foram salvos em {merged_csv}")

if __name__ == "__main__":
    crawl_associacoes()
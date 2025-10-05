import requests
from bs4 import BeautifulSoup
import csv
from os import path, makedirs
from crawl_constants import CSV_FIELDS

def crawl_cpf():
    url = "https://cpf.org.pt/diretorio-de-associados/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        container = soup.find('div', id='associados-container')
        if not container:
            print("No associados-container found.")
            return

        merged_csv = "generatedFiles/merged_output.csv"
        rows = []
        for unit in container.find_all('div', class_='unit'):
            name = ""
            site = ""
            # Find name
            name_tag = unit.find('h3', class_='name')
            if name_tag:
                name = name_tag.get_text(strip=True)
            # Find website (may be empty)
            website_a = unit.find('a', class_='website')
            if website_a and website_a.get('href'):
                site = website_a['href'].strip()
            rows.append([
                name,
                "",  # TELEFONE / TELEMÓVEL
                "",  # EMAIL
                site,
                "",  # MORADA
                "",  # CONCELHO
                "",  # DISTRITO
                "",  # FORMA JURÍDICA
                "",  # ANO REGISTO
                "",  # NIPC
                "",  # Código Postal
                "",  # LOGOTIPO
                "CPF"
            ])

        write_header = not path.exists(merged_csv)
        makedirs(path.dirname(merged_csv), exist_ok=True)
        with open(merged_csv, 'a', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            if write_header:
                writer.writerow(CSV_FIELDS)
            for row in rows:
                writer.writerow(row)
        print(f"Saved {len(rows)} organizations to {merged_csv}")
    except requests.exceptions.RequestException as e:
        print(f"Error accessing the site: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    crawl_cpf()

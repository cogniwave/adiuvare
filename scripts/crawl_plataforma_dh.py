import requests
from bs4 import BeautifulSoup
import csv
import os

def crawl_plataforma_dh():
    url = "https://plataformadh.pt/associados/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        org_list = soup.find('ul', class_='organizations__list')
        if not org_list:
            print("No organization list found.")
            return

        merged_csv = "generatedFiles/merged_output.csv"
        all_fields = [
            "NOME ONGD", "TELEFONE / TELEMÓVEL", "EMAIL", "SITE", "MORADA",
            "CONCELHO", "DISTRITO", "FORMA JURÍDICA", "ANO REGISTO", "NIPC",
            "Código Postal", "SOURCE"
        ]
        rows = []
        for li in org_list.find_all('li', class_='organizations__item'):
            a = li.find('a', href=True)
            name_div = li.find('div', class_='organizations__name')
            if a and name_div:
                nome = name_div.get_text(strip=True)
                site = a['href']
                rows.append([
                    nome,
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
                    "PLATAFORMADH"
                ])

        write_header = not os.path.exists(merged_csv)
        os.makedirs(os.path.dirname(merged_csv), exist_ok=True)
        with open(merged_csv, 'a', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            if write_header:
                writer.writerow(all_fields)
            for row in rows:
                writer.writerow(row)
        print(f"Saved {len(rows)} organizations to {merged_csv}")
    except requests.exceptions.RequestException as e:
        print(f"Error accessing the site: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    crawl_plataforma_dh()

import requests
from bs4 import BeautifulSoup
import csv
from os import path, makedirs
from crawl_constants import CSV_FIELDS  

def crawl_associacoes():
    url = "https://www.encontra-me.org/lista_associacoes"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        orgs_div = soup.find('div', class_='orgs')

        dados = []
        current_distrito = ""
        current_concelho = ""

        skip_intro = True
        for element in orgs_div.children:
            if getattr(element, "name", None) == 'p':
                # Skip the intro paragraph if it matches the known intro text
                if skip_intro and element.get_text(strip=True).startswith("Segue-se abaixo uma lista de associações"):
                    skip_intro = False
                    continue
                skip_intro = False
            if getattr(element, "name", None) == 'h2':
                # Update current district
                current_distrito = element.get_text(strip=True).replace('Distrito de ', '').replace('Região Autónoma dos ', '')
            elif getattr(element, "name", None) == 'p':
                # Extract county (if <strong> exists)
                strong = element.find('strong')
                if strong:
                    current_concelho = strong.get_text(strip=True)
                # Extract all associations with link
                for a in element.find_all('a'):
                    nome = a.get_text(strip=True)
                    site = a.get('href', 'N/A')
                    dados.append({
                        'Nome': nome,
                        'Site': site,
                        'Concelho': current_concelho,
                        'Distrito': current_distrito
                    })
                # Extract associations without link (plain text, except county name)
                text_parts = []
                for content in element.contents:
                    if getattr(content, "name", None) in ['strong', 'a']:
                        continue
                    if isinstance(content, str):
                        text_parts.append(content.strip())
                for part in text_parts:
                    for nome in [n.strip() for n in part.split('\n') if n.strip()]:
                        if nome and nome != current_concelho:
                            dados.append({
                                'Nome': nome,
                                'Site': 'N/A',
                                'Concelho': current_concelho,
                                'Distrito': current_distrito
                            })

        # Map to unified header
        merged_csv = "generatedFiles/merged_output.csv"
        rows = []
        for row in dados:
            rows.append([
                row.get('Nome', ''),
                "",  # TELEFONE / TELEMÓVEL
                "",  # EMAIL
                row.get('Site', ''),
                "",  # MORADA
                row.get('Concelho', ''),
                row.get('Distrito', ''),
                "",  # FORMA JURÍDICA
                "",  # ANO REGISTO
                "",  # NIPC
                "",  # Código Postal
                "",  # LOGOTIPO
                "ENCONTRAME"
            ])

        write_header = not path.exists(merged_csv)
        makedirs(path.dirname(merged_csv), exist_ok=True)
        with open(merged_csv, 'a', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            if write_header:
                writer.writerow(CSV_FIELDS)  
            for row in rows:
                writer.writerow(row)
        print(f"Dados de {len(rows)} associações foram salvos em {merged_csv}")
    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar o site: {e}")
    except Exception as e:
        print(f"Ocorreu um erro: {e}")

if __name__ == "__main__":
    crawl_associacoes()
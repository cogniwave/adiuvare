import requests
from bs4 import BeautifulSoup
import csv
from urllib.parse import urljoin
import time
import os

def get_association_links(main_url):
    """Obtém todos os links das associações da página principal"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(main_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Encontrar todas as listas de associações (ONGM e ONG)
        lists = soup.find_all('ul')
        links = []
        
        for ul in lists:
            # Verificar se é uma lista de associações (pela estrutura observada)
            if ul.find_parent('div', class_='entry-content'):
                for link in ul.find_all('a', href=True):
                    full_url = urljoin(main_url, link['href'])
                    links.append(full_url)
        
        return list(set(links))  # Remover duplicados
    
    except Exception as e:
        print(f"Erro ao obter links: {e}")
        return []

def extract_association_details(url):
    """Extrai os detalhes de uma associação individual"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        entry_content = soup.find('div', class_='content-sidebar-wrap')
        if not entry_content:
            return None

        # Nome pelo <h1> (header principal)
        nome_h1 = soup.find('h1', class_='entry-title')
        nome = nome_h1.get_text(strip=True) if nome_h1 else ''

        # Inicializar dados
        data = {
            'Nome': nome,
            'E-mail': '',
            'Morada': '',
            'Telefone': '',
            'URL': url
        }

        # Busca por <strong> em toda a entry-content
        for strong in entry_content.find_all('strong'):
            label = strong.get_text(strip=True).replace(':', '').lower()

            # Morada
            if 'morada' in label:
                morada_lines = []
                sib = strong.next_sibling
                # Pula ':' e <br>
                while sib and (str(sib).strip() == ':' or getattr(sib, 'name', None) == 'br'):
                    sib = sib.next_sibling
                # Coleta linhas até próximo <strong>
                while sib:
                    if hasattr(sib, 'name') and sib.name == 'strong':
                        break
                    if getattr(sib, 'name', None) == 'br':
                        sib = sib.next_sibling
                        continue
                    txt = str(sib).strip()
                    if txt:
                        morada_lines.append(txt)
                    sib = sib.next_sibling
                data['Morada'] = '\n'.join(morada_lines).replace(':', '').strip()

            # E-mail
            elif 'e-mail' in label:
                email = ''
                sib = strong.next_sibling
                while sib and (str(sib).strip() == ':' or getattr(sib, 'name', None) == 'br'):
                    sib = sib.next_sibling
                if sib:
                    email = str(sib).strip()
                    if email.startswith(':'):
                        email = email[1:].strip()
                data['E-mail'] = email

            # Telefone
            elif 'tel' in label:
                tel = ''
                sib = strong.next_sibling
                while sib and (str(sib).strip() == ':' or getattr(sib, 'name', None) == 'br'):
                    sib = sib.next_sibling
                if sib:
                    tel = str(sib).strip()
                    if tel.startswith(':'):
                        tel = tel[1:].strip()
                data['Telefone'] = tel

            # Nome (Designação)
            elif 'designação' in label:
                val = ''
                sib = strong.next_sibling
                while sib and (str(sib).strip() == ':' or getattr(sib, 'name', None) == 'br'):
                    sib = sib.next_sibling
                if sib:
                    val = str(sib).strip()
                if val:
                    data['Nome'] = val

        return data

    except Exception as e:
        print(f"Erro ao extrair dados de {url}: {e}")
        return None

def save_to_csv(data, filename):
    """Salva os dados em um arquivo CSV"""
    if not data:
        return
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Nome', 'E-mail', 'Morada', 'Telefone', 'URL']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for row in data:
            if row:  # Só escreve se houver dados
                writer.writerow(row)
    
    print(f"Dados salvos em {filename}")

def save_to_merged_csv(data, filename):
    """Salva os dados no formato padronizado do merged_output.csv"""
    if not data:
        return
    all_fields = [
        "NOME ONGD", "TELEFONE / TELEMÓVEL", "EMAIL", "SITE", "MORADA",
        "CONCELHO", "DISTRITO", "FORMA JURÍDICA", "ANO REGISTO", "NIPC",
        "Código Postal", "SOURCE"
    ]
    rows = []
    for row in data:
        rows.append([
            row.get('Nome', ''),
            row.get('Telefone', ''),
            row.get('E-mail', ''),
            row.get('URL', ''),
            row.get('Morada', ''),
            "",  # CONCELHO
            "",  # DISTRITO
            "",  # FORMA JURÍDICA
            "",  # ANO REGISTO
            "",  # NIPC
            "",  # Código Postal
            "CIG"
        ])
    write_header = not os.path.exists(filename)
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'a', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        if write_header:
            writer.writerow(all_fields)
        for row in rows:
            writer.writerow(row)
    print(f"Dados também salvos em {filename}")

def main():
    main_url = "https://www.cig.gov.pt/registo-ongm-e-ong/diretorio/"
    output_file = "generatedFiles/associacoes_cig_detalhadas.csv"
    merged_file = "generatedFiles/merged_output.csv"
    
    print("Iniciando coleta de dados...")
    
    # Obter links das associações
    print("Coletando links das associações...")
    association_links = get_association_links(main_url)
    print(f"Encontrados {len(association_links)} links de associações")
    
    # Extrair detalhes de cada associação
    all_data = []
    for i, link in enumerate(association_links, 1):
        print(f"Processando associação {i}/{len(association_links)}: {link}")
        details = extract_association_details(link)
        if details:
            all_data.append(details)
        time.sleep(1)  # Intervalo para evitar sobrecarregar o servidor
    
    # Salvar os dados
    save_to_csv(all_data, output_file)
    save_to_merged_csv(all_data, merged_file)
    print("Processo concluído!")

if __name__ == "__main__":
    main()
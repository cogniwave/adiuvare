import requests
from bs4 import BeautifulSoup
import csv
from urllib.parse import urljoin
import time
import os

def get_association_links(main_url):
    """Get all association links from the main page"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(main_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all association lists (ONGM and ONG)
        lists = soup.find_all('ul')
        links = []
        
        for ul in lists:
            # Check if it's an association list (by observed structure)
            if ul.find_parent('div', class_='entry-content'):
                for link in ul.find_all('a', href=True):
                    full_url = urljoin(main_url, link['href'])
                    links.append(full_url)
        
        return list(set(links))  # Remove duplicates
    
    except Exception as e:
        print(f"Error getting links: {e}")
        return []

def extract_association_details(url):
    """Extract details from an individual association"""
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

        # Name from <h1> (main header)
        nome_h1 = soup.find('h1', class_='entry-title')
        nome = nome_h1.get_text(strip=True) if nome_h1 else ''

        # Initialize data
        data = {
            'Nome': nome,
            'E-mail': '',
            'Morada': '',
            'Telefone': '',
            'URL': url
        }

        # Search for <strong> in all entry-content
        for strong in entry_content.find_all('strong'):
            label = strong.get_text(strip=True).replace(':', '').lower()

            # Address
            if 'morada' in label:
                morada_lines = []
                sib = strong.next_sibling
                # Skip ':' and <br>
                while sib and (str(sib).strip() == ':' or getattr(sib, 'name', None) == 'br'):
                    sib = sib.next_sibling
                # Collect lines until next <strong>
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

            # Email
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

            # Phone
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

            # Name (Designação)
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
        print(f"Error extracting data from {url}: {e}")
        return None

def save_to_csv(data, filename):
    """Save data to a CSV file"""
    if not data:
        return
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Nome', 'E-mail', 'Morada', 'Telefone', 'URL']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for row in data:
            if row:  # Only write if there is data
                writer.writerow(row)
    
    print(f"Data saved to {filename}")

def save_to_merged_csv(data, filename):
    """Save data in the standard merged_output.csv format"""
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
    print(f"Data also saved to {filename}")

def main():
    main_url = "https://www.cig.gov.pt/registo-ongm-e-ong/diretorio/"
    output_file = "generatedFiles/associacoes_cig_detalhadas.csv"
    merged_file = "generatedFiles/merged_output.csv"
    
    print("Starting data collection...")
    
    # Get association links
    print("Collecting association links...")
    association_links = get_association_links(main_url)
    print(f"Found {len(association_links)} association links")
    
    # Extract details from each association
    all_data = []
    for i, link in enumerate(association_links, 1):
        print(f"Processing association {i}/{len(association_links)}: {link}")
        details = extract_association_details(link)
        if details:
            all_data.append(details)
        time.sleep(1)  # Interval to avoid overloading the server
    
    # Save the data
    save_to_csv(all_data, output_file)
    save_to_merged_csv(all_data, merged_file)
    print("Process finished!")

if __name__ == "__main__":
    main()
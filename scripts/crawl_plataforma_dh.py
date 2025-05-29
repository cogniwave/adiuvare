import requests
from bs4 import BeautifulSoup
import csv
from os import path, makedirs
from crawl_constants import CSV_FIELDS 
MANUAL_INFO = {
    "Amnistia Internacional Portugal": {
        "email": "aiportugal@amnistia.pt",
        "telefone": "+351 213 861 652",
        "morada": "Rua dos Remolares, 7, 2º, com o código postal 1200-370"
    },
    "ORBIS – Cooperação e Desenvolvimento": {
        "email": "info@orbis.org",
        "telefone": "+351 912 923 815",
        "morada": "Av. Dr. Lourenço Peixinho 146, 1º andar, loja 303, 3800-159, Aveiro."
    },
    "Akto – Associação para a Promoção dos Direitos Humanos e Democracia": {
        "email": "geral@akto.org",
        "telefone": "+351 910 061 663",
        "morada": "Rua Aires de Campos, nº 6, 3000-014 Coimbra"
    },
    "ILGA Portugal": {
        "email": "ilga@ilga-portugal.pt",
        "telefone": "218 873 918",
        "morada": "Rua dos Fanqueiros Nº38 3ºEsq 1100-231 Lisboa"
    },
    "Conselho Português para os Refugiados": {
        "email": "geral@cpr.pt",
        "telefone": "351 21 831 43 72",
        "morada": "Quinta do Pombeiro, Casa Senhorial Norte Azinhaga do Pombeiro, s/n 1900-793 Lisboa, Portugal"
    },
    "P&D Factor – Associação para a Cooperação sobre População e Desenvolvimento": {
        "email": "info@popdesenvolvimento.org",
        "telefone": "",
        "morada": "RUA MARQUÊS DA FRONTEIRA, 4C 5ºESQ"
    },
    "Associação Portuguesa de Mulheres Juristas": {
        "email": "apmjsede@apmj.pt",
        "telefone": "211 994 816",
        "morada": "Rua Manuel Marques, nº 21-P Lisboa"
    },
    "Chão de Oliva – Centro de Difusão Cultural": {
        "email": "geral@chaodeoliva.com",
        "telefone": "+351 21 923 37 19",
        "morada": "Rua Veiga da Cunha, 20, 2710-627 Sintra"
    },
    "ACTUAR – Associação para a Cooperação e o Desenvolvimento": {
        "email": "geral@actuar-acd.org",
        "telefone": "+351 961 585 638",
        "morada": "INOPOL – Escola Agrária de Coimbra Quinta Agrícola, Bencanta. 3045-601 Coimbra, Portugal"
    },
    "QUERCUS – Associação Nacional de Conservação da Natureza": {
        "email": "quercus@quercus.pt",
        "telefone": "+351 217 788 474",
        "morada": "Centro Associativo do Calhau Bairro do Calhau Parque Florestal de Monsanto 1500-045 LISBOA"
    },
    "4Change, Cooperativa Cultural e de Solidariedade Social Crl": {
        "email": "info@4change.org",
        "telefone": "",
        "morada": "R. de Oeiras do Piauí Brasil 11A, 2780-285 Oeiras"
    },
    "FENACERCI": {
        "email": "fenacerci@fenacerci.pt",
        "telefone": "+351 21 711 25 80",
        "morada": "Rua Augusto Macedo 2 A 1600-794 Lisboa |Portugal"
    },
    "Associação Cova do Mar": {
        "email": "info@covadomar.pt",
        "telefone": "",
        "morada": ""
    },
    "CRESAÇOR - Cooperativa Regional de Economia Solidária CRL": {
        "email": "cresacor@cresacor.pt",
        "telefone": "+351 296 281 554",
        "morada": "Rua D. Maria José Borges, 137 9500-466 Fajã de Baixo, Ponta Delgada Açores"
    },
    "Almada Mundo Associação Internacional de Educação, Formação e Inovação": {
        "email": "almadamundo.amai@gmail.com",
        "telefone": "920 179 300",
        "morada": "Praça Capitães de Abril, nº 2 A e B Cova da Piedade, 2805- 111, Almada"
    },
    "Kairós - Cooperativa de Incubação de Iniciativas de Economia Solidária": {
        "email": "comunicar.incluir@kairos-acores.pt",
        "telefone": "296 209 800",
        "morada": "Rua José Manuel Bernardo Cabral, nº 10 9500-450 Ponta Delgada"
    },
    "Coolabora": {
        "email": "coolabora@gmail.com",
        "telefone": "+351 275 335 427",
        "morada": "Rua Comendador Marcelino, 53, R/C 6200-136 Covilhã"
    },
    "ARRISCA - Associação Regional de Reabilitação e Integração Sociocultural dos Açores": {
        "email": "arrisca.pdl@gmail.com",
        "telefone": "+351 296 281 658",
        "morada": "Rua de Lisboa, 60 9500-216 Santa Clara - Ponta Delgada São Miguel - Açores"
    },
    "APF Açores": {
        "email": "apfacores@gmail.com",
        "telefone": "926 783 778",
        "morada": "Rua d'Água n.º 29, Ponta Delgada, Portugal"
    },
    "Rede Inducar": {
        "email": "info@inducar.pt.",
        "telefone": "+351 916 312 550.",
        "morada": "Rua Alexandre Herculano, 158 4420- 437."
    },
    "Omnis Factum Associação": {
        "email": "omnisfactum@gmail.com",
        "telefone": "93 275 77 11",
        "morada": "Alm. Cândido dos Reis 44, 2870-234 Montijo"
    },
    "Academia Cidadã": {
        "email": "info@academiacidada.org",
        "telefone": "",
        "morada": ""
    },
    "GAT - Grupo de Ativistas em Tratamentos": {
        "email": "geral@gatportugal.org",
        "telefone": "+351 210 967 826",
        "morada": "Avenida Paris, 4 - 1º direito, 1000-228 Lisboa, Portugal"
    }
}

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
        rows = []
        for li in org_list.find_all('li', class_='organizations__item'):
            a = li.find('a', href=True)
            name_div = li.find('div', class_='organizations__name')
            if a and name_div:
                nome = name_div.get_text(strip=True)
                site = a['href']
                info = MANUAL_INFO.get(nome, {})
                email = info.get("email", "")
                telefone = info.get("telefone", "")
                morada = info.get("morada", "")
                rows.append([
                    nome,
                    telefone,
                    email,
                    site,
                    morada,
                    "",  # CONCELHO
                    "",  # DISTRITO
                    "",  # FORMA JURÍDICA
                    "",  # ANO REGISTO
                    "",  # NIPC
                    "",  # Código Postal
                    "",  # LOGOTIPO
                    "PLATAFORMADH"
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
    crawl_plataforma_dh()

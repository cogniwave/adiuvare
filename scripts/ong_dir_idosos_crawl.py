import requests
from bs4 import BeautifulSoup
import csv
import urllib3
import os
from crawl_helper import crawl_pages

BASE_URL = "https://ong.pt/dir/66-ambito-nacional-1-1"
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
    crawl_pages(BASE_URL, ORG_BASE, OUTPUT_CSV, CSV_FIELDS, range(1, 2), extract_detail_data)

if __name__ == "__main__":
    main()

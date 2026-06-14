# -*- coding: utf-8 -*-
"""Extrae textos e imagenes de las paginas descargadas de clinicadentalbinai.net
y los clasifica en carpetas por idioma / pagina."""
import os, re, shutil
from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(ROOT, "_raw")
OUT = os.path.join(ROOT, "clinicadentalbinai-extraido")
IMG_SRC = os.path.join(RAW, "imagenes")

# Mapa: archivo html -> (idioma/categoria, slug de carpeta, titulo legible)
PAGES = {
    "index.html":                 ("es",    "inicio",                "Inicio (Español)"),
    "dentistas-irun.html":        ("es",    "clinica-dental",        "Clínica Dental / Especialidades (Español)"),
    "donde-estamos.html":         ("es",    "donde-estamos",         "Dónde estamos / Contacto (Español)"),
    "hasiera.html":               ("eu",    "hasiera",               "Hasiera / Inicio (Euskera)"),
    "dentistak-irun.html":        ("eu",    "dentistak-irun",        "Klinika Dentala / Espezialitateak (Euskera)"),
    "non-gaude.html":             ("eu",    "non-gaude",             "Non gaude / Kontaktua (Euskera)"),
    "aviso-legal.html":           ("legal", "aviso-legal",           "Aviso Legal"),
    "politica-de-privacidad.html":("legal", "politica-de-privacidad","Política de Privacidad"),
    "politica-de-cookies.html":   ("legal", "politica-de-cookies",   "Política de Cookies"),
}

# Imagenes de interfaz/footer compartidas (no son contenido propio de pagina)
UI_IMAGES = {
    "es.png", "eu.png", "dientes.png", "telefono.png", "whatsapp.png",
    "email.png", "direccion.png", "clinica-dental-binai-irun-gipuzkoa.png",
    "klinika-hortza-binai-irun-gipuzkoa.png",
    "contacto-direccion.png", "contacto-email.png", "contacto-horario.png",
    "contacto-telefono.png",
}

def clean_text(soup):
    # quitar scripts/estilos
    for t in soup(["script", "style"]):
        t.decompose()
    body = soup.body or soup
    # Sustituir <br> por saltos, conservar parrafos
    for br in body.find_all("br"):
        br.replace_with("\n")
    text = body.get_text("\n")
    # normalizar: colapsar lineas vacias y espacios
    lines = [re.sub(r"[ \t\xa0]+", " ", ln).strip() for ln in text.splitlines()]
    out, blank = [], 0
    for ln in lines:
        if ln == "":
            blank += 1
            if blank <= 1 and out:
                out.append("")
        else:
            blank = 0
            out.append(ln)
    return "\n".join(out).strip() + "\n"

def media_for(html):
    """Devuelve set de archivos de media referenciados en el html."""
    files = set(re.findall(r'(?:src|href)=["\']imagenes/([A-Za-z0-9._-]+\.(?:jpe?g|png|gif|svg|webp|ico|mp4|webm|mov|ogg))["\']', html, re.I))
    files |= set(re.findall(r'url\(["\']?imagenes/([A-Za-z0-9._-]+\.(?:jpe?g|png|gif|svg|webp))', html, re.I))
    return files

def meta_info(soup):
    info = {}
    if soup.title:
        info["title"] = soup.title.get_text(strip=True)
    d = soup.find("meta", attrs={"name": "description"})
    if d and d.get("content"):
        info["description"] = d["content"].strip()
    h1 = soup.find("h1")
    if h1:
        info["h1"] = h1.get_text(strip=True)
    return info

if os.path.exists(OUT):
    shutil.rmtree(OUT)

# Carpeta comun para imagenes de UI
common_img = os.path.join(OUT, "_comunes", "imagenes")
os.makedirs(common_img, exist_ok=True)
for ui in UI_IMAGES:
    src = os.path.join(IMG_SRC, ui)
    if os.path.exists(src):
        shutil.copy2(src, os.path.join(common_img, ui))

summary = []
for html_file, (cat, slug, title) in PAGES.items():
    path = os.path.join(RAW, html_file)
    if not os.path.exists(path):
        continue
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        html = f.read()
    soup = BeautifulSoup(html, "html.parser")

    page_dir = os.path.join(OUT, cat, slug)
    img_dir = os.path.join(page_dir, "imagenes")
    os.makedirs(img_dir, exist_ok=True)

    # --- texto ---
    txt = clean_text(soup)
    meta = meta_info(soup)
    header = [f"# {title}", "", f"Origen: {html_file}"]
    if meta.get("title"):       header.append(f"Title: {meta['title']}")
    if meta.get("description"): header.append(f"Meta description: {meta['description']}")
    if meta.get("h1"):          header.append(f"H1: {meta['h1']}")
    header.append("")
    header.append("---")
    header.append("")
    md = "\n".join(header) + txt
    with open(os.path.join(page_dir, "texto.md"), "w", encoding="utf-8") as f:
        f.write(md)
    with open(os.path.join(page_dir, "texto.txt"), "w", encoding="utf-8") as f:
        f.write(txt)

    # --- imagenes propias de la pagina (no UI) ---
    media = media_for(html)
    own = sorted(m for m in media if m not in UI_IMAGES)
    copied = []
    for m in own:
        src = os.path.join(IMG_SRC, m)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(img_dir, m))
            copied.append(m)
    if not copied:
        # si la pagina solo usa imagenes UI, dejamos la carpeta pero anotamos
        os.rmdir(img_dir)
    summary.append((cat, slug, len(txt.split()), len(copied), sorted(media & UI_IMAGES)))

# indice general
idx = ["# Clínica Dental Binai — contenido extraído", "",
       "Sitio: https://www.clinicadentalbinai.net", "",
       "Estructura: `es/` (español), `eu/` (euskera), `legal/` (avisos legales), `_comunes/` (imágenes de interfaz compartidas: logos, iconos, banderas).",
       "", "| Idioma/Cat | Página | Palabras | Imágenes propias |",
       "|---|---|---|---|"]
for cat, slug, words, nimg, _ in summary:
    idx.append(f"| {cat} | {slug} | {words} | {nimg} |")
with open(os.path.join(OUT, "INDICE.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(idx) + "\n")

print("OK ->", OUT)
for cat, slug, words, nimg, ui in summary:
    print(f"  {cat}/{slug}: {words} palabras, {nimg} imagenes propias")

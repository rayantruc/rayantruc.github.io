"""Récupère les actualités IT via SerpAPI et régénère les cartes dans veille.html.

Usage :
    python generate_veille.py --categories ia,securite
    python generate_veille.py --categories toutes

Le script ne touche qu'au bloc HTML compris entre les marqueurs
<!-- VEILLE-AUTO-START --> et <!-- VEILLE-AUTO-END --> dans veille.html.
Tout le reste de la page (nav, footer, section "Mes sources de veille", etc.)
n'est jamais modifié.
"""

import argparse
import html
import re
import sys
from pathlib import Path

import yaml

from fetch_news import fetch_news, SerpApiError

CONFIG_PATH = Path(__file__).parent / "veille-config.yaml"
VEILLE_HTML_PATH = Path(__file__).parent / "veille.html"

START_MARKER = "<!-- VEILLE-AUTO-START"
END_MARKER = "<!-- VEILLE-AUTO-END -->"


def load_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def parse_categories(arg: str, all_keys: list[str]) -> list[str]:
    arg = (arg or "toutes").strip().lower()
    if arg in ("toutes", "tous", "all", ""):
        return all_keys
    requested = [c.strip() for c in arg.split(",") if c.strip()]
    unknown = [c for c in requested if c not in all_keys]
    if unknown:
        print(f"Avertissement : catégorie(s) inconnue(s) ignorée(s) : {', '.join(unknown)}", file=sys.stderr)
    return [c for c in requested if c in all_keys]


def truncate_words(text: str, max_words: int) -> str:
    words = text.split()
    if len(words) <= max_words:
        return text
    return " ".join(words[:max_words]).rstrip(",.;:") + "…"


def build_card(cat_key: str, cat_label: str, cat_icon: str, article: dict, max_snippet_words: int) -> str:
    title = html.escape(article["title"])
    link = html.escape(article["link"], quote=True)
    source_name = html.escape(article["source_name"])
    date = html.escape(article["date"])
    snippet = truncate_words(article["snippet"], max_snippet_words) if article["snippet"] else ""
    snippet = html.escape(snippet)

    p_block = f"\n                        <p>\n                            {snippet}\n                        </p>" if snippet else ""

    return f"""                <div class="veille-card reveal" data-category="{cat_key}">
                    <div class="veille-card-top">
                        <div class="veille-card-meta">
                            <span class="veille-badge {cat_key}"><i class="{cat_icon}"></i> {html.escape(cat_label)}</span>
                            <span class="veille-date"><i class="far fa-calendar"></i> {date}</span>
                        </div>
                        <h3><a href="{link}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">{title}</a></h3>{p_block}
                    </div>
                    <div class="veille-card-sources">
                        <span class="veille-source-label">Source</span>
                        <a class="veille-source-tag" href="{link}" target="_blank" rel="noopener" style="text-decoration:none"><i class="fas fa-link"></i> {source_name}</a>
                    </div>
                </div>"""


def build_grid_html(config, selected_keys: list[str]) -> str:
    categories_cfg = config["categories"]
    settings = config.get("settings", {})
    hl = settings.get("hl", "fr")
    gl = settings.get("gl", "fr")
    max_articles = settings.get("max_articles_per_category", 3)
    max_snippet_words = settings.get("max_snippet_words", 12)

    cards = []
    for key in selected_keys:
        cat = categories_cfg[key]
        print(f"Récupération des actualités pour « {cat['label']} » ({key})...")
        try:
            articles = fetch_news(cat["query"], hl=hl, gl=gl)
        except SerpApiError as e:
            print(f"  Ignoré ({key}) : {e}", file=sys.stderr)
            continue

        for article in articles[:max_articles]:
            if not article["title"] or not article["link"]:
                continue
            cards.append(build_card(key, cat["label"], cat["icon"], article, max_snippet_words))
        print(f"  {min(len(articles), max_articles)} article(s) ajouté(s).")

    if not cards:
        return "                <p style=\"color:var(--text-2)\">Aucun article récupéré lors de cette exécution.</p>"

    return "\n\n".join(cards)


def inject_into_veille_html(new_grid_html: str):
    content = VEILLE_HTML_PATH.read_text(encoding="utf-8")

    pattern = re.compile(
        re.escape(START_MARKER) + r".*?" + re.escape(END_MARKER),
        re.DOTALL,
    )

    if not pattern.search(content):
        raise RuntimeError(
            "Marqueurs VEILLE-AUTO-START / VEILLE-AUTO-END introuvables dans veille.html. "
            "Le fichier a peut-être été modifié — vérifiez qu'ils sont toujours présents."
        )

    # On garde une ligne de commentaire d'ouverture identique, avec les cartes
    # fraîchement générées entre les deux marqueurs.
    replacement = (
        f"{START_MARKER} — Ne pas éditer à la main entre ces deux balises : "
        "ce bloc est régénéré automatiquement par .github/workflows/veille-auto.yml -->\n\n"
        f"{new_grid_html}\n\n                {END_MARKER}"
    )

    new_content = pattern.sub(replacement, content)
    VEILLE_HTML_PATH.write_text(new_content, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Régénère les cartes de veille.html via SerpAPI.")
    parser.add_argument(
        "--categories",
        default="toutes",
        help="Clés de catégories séparées par des virgules (ex: ia,securite), ou 'toutes'.",
    )
    args = parser.parse_args()

    config = load_config()
    all_keys = list(config["categories"].keys())
    selected = parse_categories(args.categories, all_keys)

    if not selected:
        print("Aucune catégorie valide sélectionnée. Disponibles : " + ", ".join(all_keys))
        sys.exit(1)

    grid_html = build_grid_html(config, selected)
    inject_into_veille_html(grid_html)
    print("veille.html mis à jour.")


if __name__ == "__main__":
    main()

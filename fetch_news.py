"""Petit client pour l'API google_news de SerpAPI."""

import os
import requests

SERPAPI_ENDPOINT = "https://serpapi.com/search.json"


class SerpApiError(RuntimeError):
    pass


def get_api_key():
    key = os.environ.get("SERPAPI_KEY")
    if not key:
        raise SerpApiError(
            "La variable d'environnement SERPAPI_KEY n'est pas définie. "
            "En local : export SERPAPI_KEY=votre_cle. "
            "Sur GitHub Actions : ajoutez-la comme secret du dépôt sous le nom SERPAPI_KEY."
        )
    return key


def fetch_news(query: str, hl: str = "fr", gl: str = "fr") -> list[dict]:
    """Interroge SerpAPI (moteur google_news) et renvoie une liste d'articles normalisés."""
    params = {
        "engine": "google_news",
        "q": query,
        "hl": hl,
        "gl": gl,
        "api_key": get_api_key(),
    }

    resp = requests.get(SERPAPI_ENDPOINT, params=params, timeout=30)
    resp.raise_for_status()
    data = resp.json()

    if "error" in data:
        raise SerpApiError(f"Erreur SerpAPI : {data['error']}")

    results = data.get("news_results", [])

    articles = []
    for item in results:
        # Certains résultats sont des clusters "stories" regroupant plusieurs
        # sources sur le même sujet : on les déplie.
        if "stories" in item and item["stories"]:
            for sub in item["stories"]:
                articles.append(_normalize(sub))
        else:
            articles.append(_normalize(item))

    return articles


def _normalize(item: dict) -> dict:
    source = item.get("source", {})
    return {
        "title": item.get("title", "").strip(),
        "link": item.get("link", ""),
        "source_name": source.get("name", "Source inconnue") if isinstance(source, dict) else str(source),
        "date": item.get("date", ""),
        "snippet": item.get("snippet", "") or "",
    }

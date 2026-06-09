"""Exporta el esquema OpenAPI de la app a backend/openapi.json.

Uso (desde backend/, con el venv activo):
    python -m scripts.export_openapi
"""
import json
from pathlib import Path

from app.main import app

OUTPUT = Path(__file__).resolve().parent.parent / "openapi.json"


def main() -> None:
    schema = app.openapi()
    OUTPUT.write_text(json.dumps(schema, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"OpenAPI exportado a {OUTPUT} ({len(schema.get('paths', {}))} rutas)")


if __name__ == "__main__":
    main()

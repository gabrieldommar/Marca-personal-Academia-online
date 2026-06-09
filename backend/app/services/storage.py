import re
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.config import settings

# Extensiones permitidas por tipo de contenido.
ALLOWED_EXT = {
    "pdf": {".pdf"},
    "video": {".mp4", ".webm", ".mov", ".m4v"},
    "image": {".jpg", ".jpeg", ".png", ".webp", ".gif"},
}


def _storage_root() -> Path:
    root = Path(settings.storage_dir)
    root.mkdir(parents=True, exist_ok=True)
    return root


def _safe_name(filename: str) -> str:
    name = Path(filename).name
    return re.sub(r"[^a-zA-Z0-9._-]", "_", name)


def save_upload(file: UploadFile, kind: str) -> str:
    """Guarda el archivo en STORAGE_DIR/{kind}s con nombre único, validando la extensión.
    Devuelve la ruta pública relativa servida en /storage/..."""
    allowed = ALLOWED_EXT.get(kind)
    if allowed is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Tipo de archivo no soportado")

    ext = Path(file.filename or "").suffix.lower()
    if ext not in allowed:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Extensión {ext or '(vacía)'} no permitida para {kind}",
        )

    subdir = f"{kind}s"
    dest_dir = _storage_root() / subdir
    dest_dir.mkdir(parents=True, exist_ok=True)

    safe = _safe_name(file.filename or "file")
    unique = f"{uuid.uuid4().hex}_{safe}"
    dest = dest_dir / unique

    with dest.open("wb") as out:
        out.write(file.file.read())

    return f"/storage/{subdir}/{unique}"

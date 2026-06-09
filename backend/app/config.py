from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./app.db"

    jwt_secret: str
    jwt_expire_hours: int = 24

    google_client_id: str = ""
    google_client_secret: str = ""
    google_redirect_uri: str = "http://localhost:8000/api/auth/callback"

    admin_email: str = "feraligart160@gmail.com"

    frontend_url: str = "http://localhost:5173"
    allowed_origins: str = "http://localhost:5173"

    storage_dir: str = "./storage"

    debug: bool = False

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


settings = Settings()

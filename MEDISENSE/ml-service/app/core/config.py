from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    host: str = "0.0.0.0"
    port: int = 8000

    model_path: str = "models/skin_classifier.keras"
    labels_path: str = "models/labels.json"

    image_size: int = 224
    confidence_threshold: float = 0.15

    allowed_origins: str = "http://localhost:5000,http://localhost:5173"

    class Config:
        env_file = ".env"

    @property
    def origins_list(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


settings = Settings()

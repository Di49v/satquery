import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "SatQuery Production Pipeline"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "AQ.Ab8RN6IkPKZ525aLirLzxc7TCMG4xdhk5zVBvo0YbiNA4lVUFg")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "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")
    PLANETARY_COMPUTER_KEY: str = os.getenv("PC_SDK_KEY", "")
    PORT: int = int(os.getenv("PORT", "8000"))

settings = Settings()
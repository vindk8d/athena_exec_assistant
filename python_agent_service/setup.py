from setuptools import setup, find_packages

setup(
    name="telegram-bot-api",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.109.2",
        "uvicorn==0.27.1",
        "python-dotenv==1.0.1",
        "httpx==0.27.0",
        "pydantic==2.6.1",
        "langchain-openai==0.0.5",
    ],
    python_requires=">=3.8",
)

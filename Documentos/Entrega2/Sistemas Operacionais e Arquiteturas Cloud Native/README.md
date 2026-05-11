# Maya RPG API

Este repositório contém o backend REST da Clínica Maya RPG.

A documentação principal foi organizada em `docs/`:

- [Visão geral e contratos da API](docs/README.md)
- [Quick start com Docker Compose](docs/docker-quickstart.md)
- [Relatório Cloud Native](docs/RELATORIO_CLOUD_NATIVE.md)
- [Checklist de implementação](docs/checklist-implementacao.md)
- [Guia de testes e prints da entrega](docs/guia-testes-entrega.md)
- [Roteiro da demo final](docs/final-demo-roteiro.md)

Execução rápida:

```bash
cp .env.example .env
docker compose up --build -d
```

Swagger: `http://localhost:3000/api/docs`

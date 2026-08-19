Sistema do Prompt Simples https://sistema-de-despesas-azure.vercel.app

Sistema do Prompt Avançado https://auditoria-pessoal-gastos.vercel.app/



# Clareza — Auditoria Pessoal de Gastos

Dashboard responsivo feito com HTML, CSS e JavaScript puro, Chart.js e uma API Flask preparada para funções serverless do Vercel.

## Estrutura

```text
.
├── index.html
├── style.css
├── app.js
├── api/
│   └── index.py
├── requirements.txt
└── vercel.json
```

## Executar localmente

Crie um ambiente virtual, instale as dependências e inicie o Flask:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python api/index.py
```

Para reproduzir as rotas e o hosting estático exatamente como no deploy, use a Vercel CLI:

```powershell
npx vercel dev
```

Depois, abra o endereço mostrado no terminal (normalmente `http://localhost:3000`).

## Deploy

Importe este diretório em um projeto da Vercel ou execute `vercel`. Não é necessário configurar um comando de build.

> O armazenamento está em memória para demonstração. Em produção, use um banco persistente; instâncias serverless podem reiniciar ou atender requisições em processos diferentes.

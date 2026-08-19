# 📊 Sistema de Auditoria Pessoal de Gastos

## 1. O que o projeto faz e qual opção foi escolhida
**Opção Escolhida:** Projeto de estudo acadêmico. 

**O que faz:** O projeto tem como objetivo criar um sistema de auditoria pessoal de gastos funcional, gerado integralmente por IA a partir de prompts distintos. A aplicação permite o registro de despesas, possui indicadores financeiros, exibe gráficos interativos (utilizando a biblioteca Chart.js) e mantém um histórico com filtros (incluindo método de pagamento e observações). A arquitetura foi desenhada com HTML5, CSS3 e JavaScript no frontend, e Python/Flask no backend, estruturada para deploy via Vercel utilizando Serverless Functions.

## 2. O System Prompt Usado (Completo)
O prompt final (avançado) utilizado para gerar a versão definitiva e estruturada do projeto foi o seguinte:
Contexto e Papel:
Atue como um Engenheiro de Software Full-Stack Sênior. Sua missão é criar o código completo para um "Sistema de Auditoria Pessoal de Gastos", uma aplicação web responsiva projetada para gerenciar e visualizar finanças pessoais de qualquer dispositivo.

Stack Tecnológico Exigido:

Frontend: HTML5, CSS3 e JavaScript puro (Vanilla JS).

Visualização de Dados: Utilize a biblioteca Chart.js via CDN para o dashboard.

Backend: Python (utilize Flask ou FastAPI).

Hospedagem/Deploy: Vercel (O projeto deve ser estruturado para suportar o ambiente de Serverless Functions do Vercel).

Requisitos do Sistema:

Interface de Entrada de Dados: Um formulário simples e atrativo para adicionar novos gastos contendo:

Valor numérico.

Categoria (Dropdown com opções: Comida, Transporte, Lazer, Saúde, Contas, Outros).

Data.

Descrição do gasto.

Dashboard de Auditoria: Uma área de visualização em destaque contendo:

Um resumo do total de gastos.

Um gráfico interativo (ex: gráfico de rosca/pie ou barras) mostrando a proporção dos gastos separados por categoria.

Histórico de Gastos: Uma tabela ou lista visualmente agradável com os últimos registros inseridos.

UI/UX: O design deve ser minimalista, moderno e 100% responsivo (mobile-first), permitindo que o usuário acesse o site de um celular ou computador com a mesma qualidade de experiência.

Diretrizes de Arquitetura e Implementação para o Vercel:

Pense passo a passo. Antes de gerar o código, descreva a estrutura de pastas necessária para o Vercel reconhecer o backend em Python (ex: o frontend na raiz e o backend dentro de uma pasta /api, acompanhado do vercel.json se necessário).

Frontend: Gere os arquivos index.html, style.css e app.js. O JavaScript deve fazer requisições assíncronas (via fetch) para a API em Python.

Backend: Gere o código do servidor em Python (ex: api/index.py) com rotas simples para receber (POST) e enviar (GET) os dados dos gastos. Como não foi especificado um banco de dados, você pode simular o armazenamento em memória, em um arquivo JSON local temporário, ou propor uma integração simples (ex: SQLite).

Dependências: Gere rigorosamente o arquivo requirements.txt listando todos os pacotes Python necessários para que o sistema suba com sucesso no Vercel.

Forneça os códigos completos e prontos para uso.

> **Contexto e Papel:**
> Atue como um Engenheiro de Software Full-Stack Sênior. Sua missão é criar o código completo para um "Sistema de Auditoria Pessoal de Gastos", uma aplicação web responsiva projetada para gerenciar e visualizar finanças pessoais de qualquer dispositivo.
> 
> **Stack Tecnológico Exigido:**
> * Frontend: HTML5, CSS3 e JavaScript puro (Vanilla JS).
> * Visualização de Dados: Utilize a biblioteca Chart.js via CDN para o dashboard.
> * Backend: Python (utilize Flask ou FastAPI).
> * Hospedagem/Deploy: Vercel (O projeto deve ser estruturado para suportar o ambiente de Serverless Functions do Vercel).
> 
> **Requisitos do Sistema:**
> * Interface de Entrada de Dados: Um formulário simples e atrativo para adicionar novos gastos contendo: Valor numérico, Categoria (Dropdown com opções: Comida, Transporte, Lazer, Saúde, Contas, Outros), Data e Descrição do gasto.
> * Dashboard de Auditoria: Uma área de visualização em destaque contendo: Um resumo do total de gastos e Um gráfico interativo (ex: gráfico de rosca/pie ou barras) mostrando a proporção dos gastos separados por categoria.
> * Histórico de Gastos: Uma tabela ou lista visualmente agradável com os últimos registros inseridos.
> * UI/UX: O design deve ser minimalista, moderno e 100% responsivo (mobile-first), permitindo que o usuário acesse o site de um celular ou computador com a mesma qualidade de experiência.
> 
> **Diretrizes de Arquitetura e Implementação para o Vercel:**
> * Pense passo a passo. Antes de gerar o código, descreva a estrutura de pastas necessária para o Vercel reconhecer o backend em Python (ex: o frontend na raiz e o backend dentro de uma pasta /api, acompanhado do vercel.json se necessário).
> * Frontend: Gere os arquivos index.html, style.css e app.js. O JavaScript deve fazer requisições assíncronas (via fetch) para a API em Python.
> * Backend: Gere o código do servidor em Python (ex: api/index.py) com rotas simples para receber (POST) e enviar (GET) os dados dos gastos. Como não foi especificado um banco de dados, você pode simular o armazenamento em memória, em um arquivo JSON local temporário, ou propor uma integração simples (ex: SQLite).
> * Dependências: Gere rigorosamente o arquivo requirements.txt listando todos os pacotes Python necessários para que o sistema suba com sucesso no Vercel.
> * Forneça os códigos completos e prontos para uso.

## 3. A Técnica Aplicada e Por Que Foi Escolhida
A técnica principal aplicada no prompt definitivo foi a **Zero-Shot Chain of Thought** ("Pense passo a passo"), combinada com **Role Prompting** e **Constraint Setting**.

**Por que escolhemos e evidências:** 
* Escolhemos essa abordagem para forçar o raciocínio explícito da IA sobre a arquitetura antes da geração do código. 
* Como evidência, a diretriz de planejamento estruturado dividiu a tarefa em etapas de execução claras (backend, frontend, integração e deploy), garantindo que restrições explícitas de stack (Flask, Chart.js, Vercel) fossem respeitadas. Isso evitou decisões de arquitetura em aberto que ocorreram no prompt mais simples.

## 4. Teste de Curadoria de Contexto: Comparação de Prompts
Realizamos um teste comparando duas versões de contexto para analisar a qualidade da saída e o consumo de tokens:

* **Versão 1 (Trecho/Simples):** Precisamos de um sistema para auditoria pessoal sobre gerenciamento de gastos, aonde poderemos adicionar nossos gastos adicionar sobre quais categorias foram os gastos como
comida, transporte etc, crie uma tela com um dashboard apresentando esses gastos... deve ter um visual simples atrativo e responsivo para que possamos usar em qualquer lugar se trata de um site então pode utilizar tecnologias que condizem, gere os arquivos do sistema em Python como backend, html, Css e Java script como front e monte o arquivo com os requisitos que precisam ser baixados quando o sistema subir para o vercel. O requirements.txt.
* **Versão 2 (Arquivo Inteiro/Avançado):** O prompt detalhado (apresentado no item 2), fornecendo escopo rigoroso de UI/UX, infraestrutura (Serverless) e formatação de saída.

**Comparação e Evidências:**
* O **Prompt 1 (simples)** resultou em um sistema funcional, porém com um visual convencional e com as decisões de arquitetura deixadas em aberto, consumindo um total de **1.035.703 tokens**.
* O **Prompt 2 (avançado)** expandiu o contexto e entregou uma arquitetura direcionada, gerando um total de **1.682.674 tokens**.
* **Evidência:** Houve uma diferença registrada de **646.971 tokens a mais** na sessão avançada. Isso comprova que fornecer mais contexto e regras estritas aumenta o consumo de tokens, mas oferece um controle infinitamente superior sobre o resultado final gerado pela IA. 

## 5. Tabela de Chamadas e Custos

| Sessão / Prompt | Tokens de Entrada | Tokens de Saída | Total de Tokens da Sessão | Chamadas à API | Custo Estimado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Prompt 1 (Simples)** | 1.017.784 | 17.919 | 1.035.703 | - | - |
| **Prompt 2 (Avançado)** | 1.657.312 (Cache 95,01%) | 25.362 | 1.682.674 | 33 | ~US$ 9,05 (Hipotético) |

*Nota: No prompt avançado, o tempo total de processamento foi de 12min 13,953s, com 13,964s de latência para o primeiro token.*

## 6. Dashboard / Log de Comprovação
<img width="1334" height="714" alt="image" src="https://github.com/user-attachments/assets/ff0271e5-0293-4df7-a59f-3a40e7200e14" />
<img width="389" height="712" alt="image" src="https://github.com/user-attachments/assets/4bdda765-b09c-4a06-a142-c44f583f68f2" />
<img width="1270" height="683" alt="image" src="https://github.com/user-attachments/assets/0b5c96ca-ed40-4ef1-93b4-6326b2ac3692" />
<img width="1600" height="821" alt="image" src="https://github.com/user-attachments/assets/e8738811-c48c-489d-bee0-50b6127b3a37" />
<img width="1600" height="830" alt="image" src="https://github.com/user-attachments/assets/d571ce85-cc31-4ad6-9615-47309c215356" />



**Evidências extraídas dos logs:**
* A sessão avançada registrou um hit de cache altíssimo (95,01% na entrada).
* O custo de **~US$ 9,05** é referente a um cálculo hipotético da ferramenta baseada no volume de 1.682.674 tokens trafegados em 33 chamadas.

## 7. URL do Projeto Publicado
🔗 **Link Vercel:** `
Sistema do Prompt Simples
https://sistema-de-despesas-azure.vercel.app
github:
https://github.com/bialemesvsouza/Sistema-de-despesas.git


Sistema do Prompt Avançado
https://auditoria-pessoal-gastos.vercel.app/        

## 8. Equipe do Projeto (Nome e RA)
* Beatriz Lemes | 23113429-2
* Gabriel Andrade | 23271855-2
* Julia Batistella | 23059881-2
* Thiago Nunes | 23000383-2




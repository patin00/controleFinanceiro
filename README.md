# 💰 Controle Financeiro

Aplicação web para gerenciamento e acompanhamento de movimentações financeiras.

O projeto permite registrar receitas e despesas, organizar movimentações por categorias, realizar pesquisas e filtros e acompanhar a situação financeira através de uma dashboard com indicadores e gráficos.

---

## 📊 Dashboard Financeiro

A aplicação possui uma dashboard para facilitar a análise das informações financeiras.

### Indicadores

A dashboard apresenta:

- **Total de movimentações**
- **Maior despesa**
- **Categoria com maior volume de despesas**
- **Percentual de comprometimento da receita**

### Resumo financeiro

O resumo apresenta automaticamente:

- 🟢 Total de receitas
- 🔴 Total de despesas
- 🔵 Saldo

Os valores são atualizados conforme as movimentações e os filtros aplicados.

### Gráficos

A aplicação conta atualmente com três visualizações:

- **Receitas x Despesas**
- **Despesas por Categoria**
- **Evolução Financeira**

O gráfico de evolução apresenta o comportamento acumulado de receitas, despesas e saldo ao longo das datas cadastradas.

---

## ✨ Funcionalidades

### 💵 Gerenciamento de movimentações

É possível:

- Adicionar receitas
- Adicionar despesas
- Informar descrição da movimentação
- Informar valor
- Definir categoria
- Informar a data
- Editar movimentações
- Excluir movimentações

### 🔎 Pesquisa e filtros

A aplicação permite localizar e filtrar as movimentações através de:

- Busca por descrição
- Filtro por tipo
- Filtro por categoria
- Filtro por mês
- Limpeza dos filtros

Os indicadores e gráficos da dashboard acompanham os filtros selecionados.

---

## 🛠️ Tecnologias utilizadas

O projeto foi desenvolvido utilizando:

- **HTML5**
- **CSS3**
- **JavaScript**
- **Chart.js**

### Chart.js

A biblioteca [Chart.js](https://www.chartjs.org/) é utilizada para criação e atualização dos gráficos presentes na dashboard.

## 🚀 Como executar

1. Clone o repositório:

```bash
git clone https://github.com/patin00/controleFinanceiro.git
```

2. Acesse a pasta:

```bash
cd controleFinanceiro
```

3. Abra o arquivo `index.html` no navegador.
Objetivo do projeto

O projeto foi desenvolvido com o objetivo de criar uma ferramenta simples para controle financeiro pessoal, ao mesmo tempo em que permite aplicar conceitos importantes de desenvolvimento web e programação em JavaScript.

### Conceitos utilizados

- Manipulação do DOM
- Funções JavaScript
- Arrays e objetos
- Filtros e buscas
- Cálculos financeiros
- Manipulação de datas
- Atualização dinâmica da interface
- Visualização de dados
- Criação de dashboards
Autor: Rafael Alves da Silva
---

## 📁 Estrutura do projeto

```text
controleFinanceiro/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/

│   └── app.js
│
└── README.md

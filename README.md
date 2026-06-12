# 🎂 Registro de Aniversários

Aplicação web para cadastro e visualização de datas de aniversário, desenvolvida com **React 19**, **TypeScript** e **Vite**. O projeto é resultado de uma refatoração para arquitetura React, migrando a lógica para componentes reutilizáveis, tipagem estática e persistência via `localStorage`.

---

## 📋 Índice

- [🎂 Registro de Aniversários](#-registro-de-aniversários)
  - [📋 Índice](#-índice)
  - [Sobre o Projeto](#sobre-o-projeto)
  - [✨ Funcionalidades](#-funcionalidades)
  - [🛠 Tecnologias](#-tecnologias)
  - [📁 Estrutura de Pastas](#-estrutura-de-pastas)
  - [🚀 Como Executar](#-como-executar)
    - [Pré-requisitos](#pré-requisitos)
    - [Instalação e execução](#instalação-e-execução)
  - [📜 Scripts Disponíveis](#-scripts-disponíveis)
  - [🏗 Arquitetura](#-arquitetura)
    - [Fluxo de dados](#fluxo-de-dados)
    - [Camadas](#camadas)
  - [👨‍💻 Autor](#-autor)

---

## Sobre o Projeto

Este projeto é uma aplicação de administração simples para registrar nomes e datas de aniversário. Ele foi criado como exercício de **refatoração e migração para a arquitetura React**, aplicando boas práticas como separação de responsabilidades, tipagem com TypeScript e gerenciamento de estado com hooks nativos do React.

Os dados são persistidos localmente no navegador via `localStorage`, sem necessidade de backend.

---

## ✨ Funcionalidades

- ✅ Cadastrar pessoa com nome e data de aniversário
- ✅ Listar todas as pessoas cadastradas em uma tabela
- ✅ Limpar toda a lista de registros
- ✅ Validação de campos obrigatórios com alertas via SweetAlert2
- ✅ Persistência automática dos dados no `localStorage`
- ✅ Layout responsivo com cabeçalho, conteúdo principal e rodapé

---

## 🛠 Tecnologias

| Tecnologia | Versão | Papel |
|---|---|---|
| [React](https://react.dev/) | ^19.2.6 | Biblioteca de UI |
| [TypeScript](https://www.typescriptlang.org/) | ~6.0.2 | Tipagem estática |
| [Vite](https://vitejs.dev/) | ^8.0.12 | Bundler e servidor de desenvolvimento |
| [SweetAlert2](https://sweetalert2.github.io/) | ^11.26.25 | Alertas e modais |
| [React Compiler](https://react.dev/learn/react-compiler) | ^1.0.0 | Otimização automática de re-renders |
| [ESLint](https://eslint.org/) | ^10.3.0 | Linting de código |

---

## 📁 Estrutura de Pastas

```
src/
├── assets/
│   └── lixeira.png          # Ícone do botão de deletar
├── components/
│   ├── Header.tsx            # Cabeçalho da aplicação
│   ├── Main.tsx              # Componente raiz com estado e lógica principal
│   ├── Form.tsx              # Formulário de cadastro de pessoa
│   ├── PeopleRender.tsx      # Tabela de listagem de pessoas
│   ├── CardPerson.tsx        # Linha individual da tabela
│   └── footer.tsx            # Rodapé da aplicação
├── services/
│   └── localStorange.tsx     # Abstração de leitura/escrita no localStorage
├── styles/
│   ├── global.css            # Reset e estilos globais
│   └── app.css               # Estilos dos componentes
├── validators/
│   └── validator.tsx         # Tipos TypeScript (Person, PeopleProps)
├── App.tsx                   # Composição dos componentes de layout
└── main.tsx                  # Ponto de entrada da aplicação
```

---

## 🚀 Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [npm](https://www.npmjs.com/) ou outro gerenciador de pacotes

### Instalação e execução

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/simple-admin-refactor-migrate-to-react-architecture.git

# 2. Acesse a pasta do projeto
cd simple-admin-refactor-migrate-to-react-architecture

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação abrirá automaticamente no navegador em `http://localhost:5173`.

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com HMR e abre o navegador |
| `npm run build` | Compila o TypeScript e gera o build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente para inspeção |
| `npm run lint` | Executa o ESLint em todos os arquivos do projeto |

---

## 🏗 Arquitetura

### Fluxo de dados

```
App
└── Main  ←── estado: people[]  ←── localStorage (inicialização)
    ├── Form
    │   ├── onAddPerson()   ──→  adiciona à lista
    │   └── onDeletePeople() ──→ limpa a lista
    └── PeopleRender
        └── CardPerson (× n)
```

O componente `Main` é o único que detém estado (`useState`). Ele inicializa a lista de pessoas lendo o `localStorage` via função lazy do `useState`, e sincroniza as alterações de volta ao storage através de um `useEffect`.

### Camadas

| Camada | Responsabilidade |
|---|---|
| **Componentes** | Renderização e eventos de UI |
| **Services** (`localStorange`) | Leitura e escrita no `localStorage` |
| **Validators** | Definição de tipos compartilhados (`Person`, `PeopleProps`) |

---

## 👨‍💻 Autor

Desenvolvido por **Richard Henrique**.

---

> Projeto criado com fins de aprendizado e prática de arquitetura React com TypeScript.

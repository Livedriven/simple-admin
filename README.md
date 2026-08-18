# Simple Admin

Aplicação React para cadastrar pessoas e consultar suas datas de nascimento.
Os dados são validados com Zod e armazenados no navegador.

## Funcionalidades

- Cadastro com nome e data de nascimento.
- Normalização de nomes e validação de datas.
- Listagem, exclusão individual e limpeza completa.
- Migração transparente dos registros antigos que não possuem ID.
- Tratamento de dados inválidos ou indisponibilidade do `localStorage`.

## Arquitetura

```text
src/
├── components/
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── PeopleManager.tsx
│   ├── PeopleTable.tsx
│   ├── PersonForm.tsx
│   └── PersonRow.tsx
├── schemas/
│   └── person.ts
├── services/
│   └── peopleStorage.ts
├── styles/
│   ├── app.css
│   └── global.css
├── App.tsx
└── main.tsx
```

- `components`: apresentação e interação com o usuário.
- `schemas`: schemas Zod, tipos inferidos e regras do domínio.
- `services`: leitura e escrita no armazenamento do navegador.
- `styles`: estilos globais e dos componentes.

## Validação

- Nome normalizado em Unicode, sem espaços excedentes e com até 80 caracteres.
- Data civil válida, sem datas futuras e limitada a 130 anos.
- Até 200 pessoas.
- Duplicidade definida por nome normalizado e mesma data de nascimento.
- Dados carregados do navegador são sempre validados pelo schema.

## Execução

Pré-requisito: Node.js `^22.13.0` ou `>=24.0.0`.

```bash
npm ci
npm run dev
```

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run preview
```

Os registros ficam no `localStorage` do navegador e não são enviados para um
servidor.

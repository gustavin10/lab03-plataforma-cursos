# LAB03 — Plataforma de Cursos Online

Trabalho prático desenvolvido com **HTML5**, **Bootstrap 5** e **JavaScript ES6+**.

## Como executar

1. Clone o repositório:
```bash
git clone https://github.com/gustavin10/lab03-plataforma-cursos.git
cd lab03-plataforma-cursos
```

2. Abra o arquivo `index.html` diretamente no navegador (não precisa de servidor).

## Funcionalidades implementadas

### Módulo Acadêmico
- Cadastro de Categorias
- Cadastro de Cursos (com filtro por categoria)
- Cadastro de Módulos (com campo Ordem)
- Cadastro de Aulas (com campo Ordem e tipo de conteúdo)
- Trilhas de Conhecimento + vinculação de cursos (Trilhas_Cursos com Ordem)

### Módulo de Usuário e Progresso
- Cadastro de Usuários (com validação de e-mail)
- Matrículas em cursos ou assinatura de planos
- Controle de progresso de aulas (Status Concluído)
- Geração automática de Certificados com código de verificação

### Módulo de Interação
- Avaliações de cursos (Nota 1 a 5 + comentário)

### Módulo Financeiro
- Cadastro de Planos
- Fluxo de Checkout com escolha de método de pagamento
- Geração de ID de Transação automático
- Histórico de Pagamentos e Assinaturas

## Tecnologias
- HTML5 semântico
- Bootstrap 5.3 (Grid, Cards, Modais, Tabelas, Navbar, Badges)
- JavaScript ES6+ (Classes, Arrow Functions, Array Methods, DOM Events)
- Persistência em memória (sem banco de dados)

## Estrutura de arquivos
```
lab03-plataforma-cursos/
├── index.html       ← Estrutura HTML com todas as abas e modais
├── css/
│   └── style.css    ← Estilos customizados
├── js/
│   ├── models.js    ← Classes JS (entidades do modelo de dados)
│   └── app.js       ← Lógica de negócio, validações e eventos DOM
└── README.md
```

## Integrantes
- Gustavo Oliveira Milhomem

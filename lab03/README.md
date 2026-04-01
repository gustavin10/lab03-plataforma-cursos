# LAB03 — Plataforma de Cursos Online

Trabalho do LAB03 feito com HTML5, Bootstrap 5 e JavaScript puro.

## Como rodar

Clonar o repositório e abrir o `index.html` direto no navegador, não precisa de servidor.


git clone https://github.com/gustavin10/lab03-plataforma-cursos.git
cd lab03-plataforma-cursos


## O que foi implementado

**Cadastros básicos**
- Usuários (com validação de e-mail duplicado)
- Categorias
- Cursos (filtro por categoria na listagem)
- Módulos e Aulas (ambos com campo de ordem)

**Matrículas e progresso**
- Matrícula em curso individual ou via assinatura de plano
- Controle de progresso por aula
- Certificado gerado automaticamente quando todas as aulas são concluídas

**Trilhas**
- Cadastro de trilhas de conhecimento vinculadas a categorias
- Associação de cursos às trilhas com ordem definida

**Avaliações**
- Nota de 1 a 5 com comentário opcional
- Um usuário só pode avaliar um curso uma vez

**Financeiro**
- Cadastro de planos com preço e duração em meses
- Fluxo de checkout com geração automática de ID de transação
- Histórico de pagamentos e assinaturas ativas

## Estrutura

```
lab03-plataforma-cursos/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── models.js
│   └── app.js
└── README.md
```

## Tecnologias

- HTML5 + Bootstrap 5.3
- JavaScript ES6+ (classes, arrow functions, manipulação do DOM)
- Dados em memória (sem banco de dados)

## Integrante

- Gustavo Oliveira Milhomem
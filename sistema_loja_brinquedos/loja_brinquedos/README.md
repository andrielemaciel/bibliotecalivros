# Sistema de Loja de Brinquedos

Sistema simples para gerenciar brinquedos com nome, categoria, faixa etária, preço e imagem. Permite listar, cadastrar, editar, consultar por ID e excluir brinquedos.

## Tecnologias
- Front-end: HTML, CSS e JavaScript
- Back-end: Node.js e Express
- Banco de dados: MySQL

## 1. Criar o banco
Abra o MySQL Workbench (ou outro cliente MySQL) e execute todo o arquivo `sql/loja_brinquedos.sql`. Ele cria o banco `loja_brinquedos`, a tabela `brinquedos` e insere 10 exemplos de brinquedos.

Se o banco já existir, execute uma vez esta migração:
```sql
ALTER TABLE brinquedos ADD COLUMN imagem_url VARCHAR(2048) NULL;
```

## 2. Configurar a conexão
Na pasta `backend`, copie `.env.example` para um arquivo chamado `.env` e preencha `DB_USER` e `DB_PASSWORD` com o usuário e a senha do seu MySQL. Confira também host, porta e nome do banco.

## 3. Instalar e iniciar a API
Abra um terminal dentro de `backend` e execute:
```bash
npm install
npm start
```
A API ficará em `http://localhost:3000`. A rota inicial deve retornar uma mensagem de funcionamento.

No formulário, selecione uma imagem JPG, PNG, WEBP ou GIF de até 5 MB. Os arquivos são armazenados em `backend/uploads` e exibidos na lista de brinquedos.

## 4. Abrir o site
Abra `frontend/index.html` usando a extensão Live Server no VS Code. O CORS já permite a origem comum `http://127.0.0.1:5500` e `http://localhost:5500`.

## Rotas da API
- `GET /brinquedos` — lista todos
- `GET /brinquedos/:id` — consulta um brinquedo por ID
- `POST /brinquedos` — cadastra
- `PUT /brinquedos/:id` — atualiza
- `DELETE /brinquedos/:id` — exclui

### Exemplo de dados para cadastrar (JSON)
```json
{
  "nome": "Pista de carrinhos",
  "categoria": "Veículos",
  "faixa_etaria": "6 a 8 anos",
  "preco": 119.90
}
```

**Importante:** o arquivo `.env` contém a senha local do MySQL e não deve ser compartilhado. Use `.env.example` como modelo.

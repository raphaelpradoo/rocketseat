const express = require("express");

// Iniciando a aplicação
const server = express();

// Informando ao Express que ele dever ler JSON do Body da Requisição
server.use(express.json());

// Vetor com alguns usuários
const users = ["Diego", "Raphael", "Robson"];

// ************************ MIDDLEWARES ************************

// Middleware global
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url};`);
  next();
  console.timeEnd("Request");
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }
  req.user = user;
  return next();
}

// *************************************************************

// ************************** MÉTODOS **************************

// Rota para LISTAR todos os usuários
server.get("/users", (req, res) => {
  return res.json(users);
});

// Rota pra LISTAR um usuário por índice no vetor
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

// Rota para CRIAR um novo usuário
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.json(users);
});

// Rota para ALTERAR um usuário
server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.json(users);
});

// Rota para EXCLUIR um usuário
server.delete("/users/:indes", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.json(users);
});

// *************************************************************

// Informando qual porta que será ouvida - localhost:3000
server.listen(3000);

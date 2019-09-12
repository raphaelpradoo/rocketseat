const express = require("express");

// Iniciando a aplicação
const server = express();

// Informando ao Express que ele dever ler JSON do Body da Requisição
server.use(express.json());

// Numero de requisições
let numberOfRequests = 0;

// Vetor fixo com alguns Projetos
const projects = [
  { id: "1", title: "Projeto 01", tasks: [] },
  { id: "2", title: "Projeto 02", tasks: [{ title: "Tarefa do projeto 02" }] }
];

// ************************ MIDDLEWARES ************************

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

function logRequests(req, res, next) {
  numberOfRequests++;
  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

// *************************************************************

// *************************** ROTAS ***************************

// Rota para LISTAR todos os projetos e suas tarefas
server.get("/projects", logRequests, (req, res) => {
  return res.json(projects);
});

// Rota para CRIAR um novo projeto
server.post("/projects", logRequests, (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  const project = { id: id, title: title, tasks: [] };
  projects.push(project);

  return res.json(projects);
});

// Rota para ALTERAR apenas o titulo de um projeto
server.put("/projects/:id", logRequests, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects.find(p => p.id == id).title = title;

  return res.json(projects);
});

// Rota para EXCLUIR um projeto por id
server.delete("/projects/:id", logRequests, checkProjectExists, (req, res) => {
  const { id } = req.params;
  projects.splice({ id: id }, 1);

  return res.json(projects);
});

// Rota para CRIAR uma nova nova task para algum projeto
server.post(
  "/projects/:id/tasks",
  logRequests,
  checkProjectExists,
  (req, res) => {
    const { id } = req.params;
    const task = req.body;
    projects.find(p => p.id == id).tasks.push(task);

    return res.json(projects);
  }
);

// *************************************************************

// Informando qual porta que será ouvida - localhost:3000
server.listen(3000);

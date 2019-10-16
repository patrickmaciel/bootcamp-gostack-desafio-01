const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let reqCount = 0;

function requestCounter(req, res, next) {
  reqCount++;
  console.log('reqCount', reqCount);
  return next();
}

function storeRequest(req, res, next) {
  if (!req.body.id) {
    return res.status(400).json({ message: 'Invalid params' });
  }

  // const projectExists = projects.filter(function(project) {
  //   return project.id == req.body.id;
  // });
  const projectIndex = projects.find(p => p.id == req.body.id);
  if (projectIndex) {
    return res.status(400).json({ message: 'ID already in use' });
  }

  return next();
}

function updateRequest(req, res, next) {
  if (!req.params.id) {
    return res.status(400).json({ message: 'Invalid params' });
  }
  const { id } = req.params;

  // const projectExists = projects.filter(function(project) {
  //   return project.id === req.body.id;
  // });
  const projectIndex = projects.findIndex(p => p.id == id)
  if (projectIndex < 0) {
    return res.status(400).json({ message: 'Invalid Project' });
  }

  req.projectIndex = projectIndex;

  return next();
}

server.use(requestCounter);
server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', storeRequest, (req, res) => {
  const { id, title } = req.body;
  projects.push({ id, title, tasks: [] });
  return res.json(projects);
});

server.put('/projects/:id', updateRequest, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  // projects[req.projectIndex] = {
  //     id,
  //     title,
  //     tasks: projects[req.projectIndex].tasks
  // };
  const project = projects.find(p => p.id == id);
  project.title = title;
  return res.json(projects);
});

server.delete('/projects/:id', updateRequest, (req, res) => {
  const { id } = req.params;
  // projects.splice(req.projectIndex, 1);
  const projectIndex = project.findIndex(p => p.id == id);
  projects.splice(projectIndex, 1);
  return res.json({ message: 'Removed' });
});

server.post('/projects/:id/tasks', updateRequest, (req, res) => {
  const { title } = req.body;
  projects[req.projectIndex].tasks.push(title);
  return res.json(projects);
});

server.listen(3000);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TodoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', TodoSchema);

app.get('/todos', async (req, res) => res.json(await Todo.find()));
app.post('/todos', async (req, res) => {
  const newTodo = new Todo({ text: req.body.text, completed: false });
  res.json(await newTodo.save());
});
app.patch('/todos/:id', async (req, res) => {
  res.json(await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});
app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

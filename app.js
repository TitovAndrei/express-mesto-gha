const express = require("express");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/users");
const cardsRoutes = require("./routes/cards");
const bodyParser = require("body-parser");
const { createUser } = require("./controllers/users");
const { createCard } = require("./controllers/cards");
const NoteFoundsError = require("./errors/NoteFoundsError");

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "62a71662ec54beb2ebf2e943", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use("/", usersRoutes);
app.use("/", cardsRoutes);
app.post("/users", createUser);
app.post("/cards", createCard);
app.patch("/404", (req, res, next) => {
  next(new NoteFoundsError('Страница не найдена'));
});


app.listen(PORT, () => {
  console.log(`Огонь все фурычит на порте ${PORT}`);
});

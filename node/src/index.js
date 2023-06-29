const express = require(`express`);
const mysql = require(`mysql`);
const app = express();
const { Faker, pt_BR } = require('@faker-js/faker');

const port = 3000;
const config = {
  host: `database`,
  user: `root`,
  password: `root`,
  database: `node`
};

const faker = new Faker({
  locale: [pt_BR]
});

function initial(connection) {
  const initial = `create table if not exists people(
    id int not null primary key auto_increment,
    name varchar(255) not null
    )`;
  connection.query(initial);
}

app.get(`/`, (req, res) => {
  const connection = mysql.createConnection(config);

  initial(connection);

  const insert = `INSERT INTO people(name) values ('${faker.person.fullName()}')`;
  connection.query(insert);
  const select = `SELECT * FROM people`;

  connection.query(select, (err, rows) => {
    if (err) {
      res.status(500);
      return;
    }

    const people = rows;

    connection.end();

    res.send(
      `<h1>Full Cycle Rocks!</h1> <br> <ul>${people
        .map((value) => `<li>${value.name}</li>`)
        .join('')}</ul>`
    );
  });
});

app.listen(port, () => {
  console.log(`Rodando na porta ${port}`);
});

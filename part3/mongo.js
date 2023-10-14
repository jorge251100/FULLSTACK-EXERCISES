// mongo.js

const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];
const dbName = 'cluster0'; // Reemplaza con el nombre de tu base de datos
const url = `mongodb+srv://username:${password}@cluster.mongodb.net/${dbName}`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  // Si solo se proporciona la contraseña, muestra todos los registros
  console.log('phonebook:');
  Person.find({}).then((persons) => {
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  // Si se proporcionan 5 argumentos, agrega una nueva entrada
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('Invalid number of arguments. Please provide the password and, optionally, the name and number.');
  mongoose.connection.close();
}

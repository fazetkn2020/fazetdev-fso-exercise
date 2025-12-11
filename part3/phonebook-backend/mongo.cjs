const mongoose = require('mongoose');

function showUsage() {
  console.log('Usage: node mongo.cjs <password> [name number]');
  console.log('  - With just password: lists all entries');
  console.log('  - With name and number: adds a new entry');
  process.exit(1);
}

if (process.argv.length < 3) {
  console.log('Error: Missing password!');
  showUsage();
}

const password = process.argv[2];
const url = `mongodb+srv://fazetkn2020:${password}@cluster0.9gsyh1v.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url, { family: 4 }).catch(err => {
  console.error('Connection failed:', err.message);
  process.exit(1);
});

mongoose.set('strictQuery', false);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];
  if (!name || !number) showUsage();
  const person = new Person({ name, number });
  person.save()
    .then(saved => {
      console.log(`Added ${saved.name} number ${saved.number} to phonebook`);
      mongoose.connection.close();
    })
    .catch(err => {
      console.error('Save failed:', err.message);
      mongoose.connection.close();
    });
} else if (process.argv.length === 3) {
  console.log('phonebook:');
  Person.find({})
    .then(people => {
      if (people.length === 0) console.log('  (empty)');
      else people.forEach(p => console.log(p.name, p.number));
    })
    .finally(() => mongoose.connection.close());
} else {
  showUsage();
}

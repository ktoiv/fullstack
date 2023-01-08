const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the database password as an argument: node mongo.js <password>')
  process.exit(1)
}


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const password = process.argv[2]
const url = `mongodb+srv://fullstackuser:${password}@stallform.xlbh3.mongodb.net/?retryWrites=true&w=majority`


const saveNewAddress = () => {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    return person.save()
        .then((result) => {
            console.log(`added ${result.name} number ${result.number} to phonebook`)
        })
}


const displayAddresses = () => {
    return Person.find({}).then(queryResult => {
        console.log('phonebook:')
        queryResult.forEach(address => console.log(address.name, address.number))
    })
}


let databaseOperation

if (process.argv.length === 3) {
    databaseOperation = displayAddresses
} else if (process.argv.length === 5) {
    databaseOperation = saveNewAddress
} else {
    console.error('Invalid arguments')
    process.exit(1)
}

mongoose
    .connect(url)
    .then(() => {
        console.log('Connected to the database')

        return databaseOperation()
    })
    .catch(err => console.warn(err))
    .finally(() =>  mongoose.connection.close())
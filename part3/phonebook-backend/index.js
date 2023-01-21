require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()


morgan.token('body', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
})

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :body'))



app.get('/info', (_, response, next) => {
    Person.find({}).then(result => {
        const responseContent = `Phonebook has info for ${result.length} people\n ${new Date().toString()}`
        response.send(responseContent)
    }).catch(error => next(error))
})

app.get('/api/persons', (_, response, next) => {
    Person.find({}).then(result => {
        response.json(result)
    }).catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {

        if (person) {
            response.json(person)
        } else {
            response.status(404)
        }
    }).catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
    const person = new Person({
        name: request.body.name,
        number: request.body.number
    })

    console.log('saving')
    person.save()
        .then(savedPerson => response.json(savedPerson))
        .catch(error => {
            console.log('caught error')
            next(error)
        } )
})


app.put('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndUpdate(
        request.params.id,
        request.body,
        { new: true, runValidators: true, context: 'query' }
    )
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => response.status(204).end())
        .catch(error => next(error))
})


const errorHandler = (error, _request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
}
  
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



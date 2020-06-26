require('dotenv').config()
const express = require('express')
const { request } = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Contact = require('./models/contact')

//Middleware

app.use(express.json())

morgan.token('response-json', function(req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response-json'));

app.use(cors())

app.use(express.static('build'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 3
    }
]

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contacts => response.json(contacts))
})

app.get('/api/persons/:id', (request, response) => {
    Contact.findById(request.params.id).then(contact => {
        response.json(contact)
    })
})

app.get('/info', (request, response) => {
    response.write(`<p>Phonebook has info for ${persons.length} people</p>`)
    response.write(`${Date()}`)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const contact = new Contact({
        name: body.name,
        number: body.number
    })

    persons = persons.concat(contact)

    contact.save().then(savedContact => {
        response.json(savedContact)
    })
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter((contact) => contact.id !== id)

    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Running on Port")
})
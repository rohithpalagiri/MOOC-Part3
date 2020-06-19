const express = require('express')
const { request } = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

//Middleware

app.use(express.json())

morgan.token('response-json', function(req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response-json'));

app.use(cors())


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
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const contact = persons.find((person) => person.id === id);

    if (contact) {
        response.json(contact);
    } else {
        response.status(404).send("This person does not exist!").end()
    }
})

app.get('/info', (request, response) => {
    response.write(`<p>Phonebook has info for ${persons.length} people</p>`)
    response.write(`${Date()}`)
})

const generateId = () => {
    min = Math.ceil(5);
    max = Math.floor(10000);
    return Math.floor(Math.random() * (max - min)) + min;
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    const nameExists = persons.some((person) => person.name === body.name)

    console.log('value of nameexists', nameExists)
    

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    } else if (nameExists) {
        return response.status(400).json({
            error: "This name already exists"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Running on Port")
})
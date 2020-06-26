const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://rohithpalagiri:${password}@cluster0-hjlgz.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true })

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if(process.argv.length === 5){
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })

    contact.save().then((result) => {
        console.log(`added ${contact.name} number ${contact.number} to phonebook`)
        mongoose.connection.close()
    })
} else if(process.argv.length === 3){
    Contact.find({}).then((result) => {
        console.log('phonebook:')

        result.forEach(contact => console.log(contact))
        mongoose.connection.close()
    })
}
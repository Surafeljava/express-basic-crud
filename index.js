const express = require('express')
const app = express()

let persons = [{
    id: '1',
    name: 'Sam',
    age: '26',
    hobbies: []    
}] //This is your in memory database

app.set('db', persons)
//TODO: Implement crud of person

//middleware to valid post and put request body
const validateMiddleware = (req, res, next) => {
    const personPOSTSchema =  Joi.object().keys({
        id: Joi.string(),
        name: Joi.string().required(),
        age: Joi.number().required(),
        hobbies: Joi.array().required()
    })

    const {error} = personPOSTSchema.validate(req.body);
    const valid = (error==null);

    if(valid){
        next();
    }else{
        const {details} = error;
        const message = details.map(i => i.message).join(',');
        res.status(422).json({error:message});
    }
}

app.get('/person', (req, res) => {
    res.status(200).send(persons);
});

app.get('/person/:id', (req, res) => {
    const {id} = req.params;
    const filteredPersons = persons.filter((item) => item.id === id);
    res.status(200).send(filteredPersons);
});

app.post('/person', validateMiddleware, (req, res) => {
    let person = req.body;
    person = {id:uuid.v4(), ...person};
    persons.push(person);
    res.status(201).json({
        person: person,
        data: persons
    });
});

app.put('/person/:id', validateMiddleware, (req, res) => {
    const {id} = req.params;
    const body = req.body;

    for(let i=0; i<persons.length; i++){
        if(persons[i].id === id){
            persons[i] = {id:id, ...body};
            break;
        }
    }
    res.status(201).send({
        data: persons
    });
});

app.delete('/person/:id', (req, res) => {
    const {id} = req.params;

    for(let i=0; i<persons.length; i++){
        if(persons[i].id === id){
            persons.splice(i, 1);
            res.status(200).send({
                data: persons
            });
            return;
        }
    }
    res.status(400).send({
        message: "No person found with the given id"
    });
});

//Handling unknown routes
app.use(function(req,res){
    res.status(404).send('404 route not found');
});

if (require.main === module) {
    app.listen(3000)
}
module.exports = app;
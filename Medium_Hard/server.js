const Joi = require('joi');
const express = require('express');
const app = express();
const { response } = require('express')
const data = require('./employee-data.json');
const { funct } = require('joi')

app.use(express.json());  //parsing

app.get('/', (req, res) => {
    res.send(`Hello World, This is the medium and hard challenge in the node guided inquiry for Road to Hire.`)
});

//http://localhost:4000/employees
app.get('/employees', (req,res) => {
    if(!data) {
        res.status(404).send('Could not find information on all employees')
    } 
    res.send(data)
});

//http://localhost:4000/employees/<employeeID> 
app.get('/employees/:id', (req,res) => {
    const findEmployee = data.employees.find(function(employee){
        return parseInt(req.params.id) === employee.id
    })
    if(!findEmployee) {
        res.status(404).send('Could not find information for employee id.')
    } 
    res.send(findEmployee)
});

//http://localhost:4000/employees/        in postman
app.post('/employees', (req, res) => {
    //Validation using Joi
    const { error } = validateEmployee(req.body);//result.error equivalent
    if (error) return res.status(400).send(error.details[0].message);
    
    //POST
    const employee = {
        name: req.body.name,
        id: data.employees.length + 1,
        salary: req.body.salary,
        department: req.body.department
    }
    data.employees.push(employee);
    res.send(employee)
});

//Validation Requirements
function validateEmployee(employee) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        salary: Joi.number().integer().required(),
        department: Joi.string().min(3).required()
    });
    return schema.validate(employee)
};

//http://localhost:4000/employees/1
app.put('/employees/:id', (req, res) => {
    //If data not found for employee
    const findEmployee = data.employees.find(function(employee){
        return parseInt(req.params.id) === employee.id
    })

    if(!findEmployee) {
        res.status(404).send('Could not find information for employee id (PUT)')
    } 
    // res.send(findEmployee)  
    //Validation
    const { error } = validateEmployee(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Update employee
    findEmployee.name = req.body.name;
    findEmployee.salary = req.body.salary;
    findEmployee.department = req.body.department;
    res.send(findEmployee);
});    



//http://localhost:4000/employees/2
app.delete('/employees/:id', (req, res) => {
    const employeeIndex = data.employees.findIndex((employee) => {
        return parseInt(req.params.id) === employee.id
    });

    if (employeeIndex < 0) {
        res.status(404).send('Could not find information for employee id (DELETE)');
        return;
    };

    const employee = data.employees[employeeIndex];
    data.employees.splice(employeeIndex, 1);
    
    res.send(employee)
})



//export PORT=4000 in terminal, if different than this run different localhost
const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Medium/Hard Challenge listening on port ${port}...`));

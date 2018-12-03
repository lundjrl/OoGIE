// The API toolkit for making REST systems easily
const express = require('express');
// A good solution for handling JSON data in routes
const bodyParser = require('body-parser');
// Node JS modules for filesystem access
const fs = require('fs');
// Our database connection
// This will be a JSON object of our programmers
// and can be accessed as if it was any other javascript
// object
const database = require('./programmers.json');

const template = {
	"firstName": "",
	"lastName": "",
	"homeAddress": "",
	"SID": "",
	"goodSlave": "",
	"beatingsToDate":"" ,
	"family": {
		"wife": {},
		"husband": {},
		"children": []
	}
}

// Make an instance of our express application
const app = express();
// Specify our > 1024 port to run on
const port = 3000;

// Apply our middleware so our code can natively handle JSON easily
app.use(bodyParser.json());

// We must have our list of programmers to use
if (!fs.existsSync('./programmers.json')) {
	throw new Error('Could not find database of programmers!');
}

// Build our routes

app.get('/', (req, res) => {
	res.json(database);
});

app.get('/:id', (req, res) => {
	const { id } = req.params;
	const found = database.find(record => record.SID === id);
	if (found)
		res.json(found)
	else
		res.send(`id: ${id} is not here`);
});

app.put('/:id', (req, res) => {
	const id = req.params.id;
	let index;	
	const found = database.map((user, idx) => {
		if(user.SID === id){
			index = idx
		}
	});

	if (found){
		const updatedUser = {...database[index], ...req.body};

		database[index] = updatedUser; 
		res.json(updatedUser);
	}else{
		res.send(`id: ${id} is not here`);
	}

	res.send(`Fill me in to update values with ID: ${id}`);
});

app.post('/', (req, res) => {
	const body = req.body; // Hold your JSON in here!

	database.push(body); 
	res.json(body);
});

// IMPLEMENT A ROUTE TO HANDLE ALL OTHER ROUTES AND RETURN AN ERROR MESSAGE

app.all('*', (req, res) => res.json('Error! Invalid route'));

app.listen(port, () => {
	console.log(`She's alive on port ${port}`);
});



const express = require('express');
const https = require('https');
const { request } = require('http');
require('dotenv').config();

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;

	const data = {
		members: [
			{
				email_address: email,
				status: 'subscribed',
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	var jsonData = JSON.stringify(data);

	const url = process.env.MAILCHIMP_URI;

	const option = {
		method: 'POST',
		auth: process.env.MAILCHIMP_AUTH,
	};

	const request = https.request(url, option, (response) => {
		response.on('data', (data) => {
			const errorCount = JSON.parse(data).error_count;

			if (response.statusCode === 200 && errorCount === 0) {
				res.sendFile(__dirname + '/success.html');
			} else {
				res.sendFile(__dirname + '/failure.html');
			}
		});
	});

	request.write(jsonData);
	request.end();
});

app.post('/failure', (req, res) => {
	res.redirect('/');
});

app.listen(process.env.PORT || 3000, () =>
	console.log('Server running at port 3000'),
);

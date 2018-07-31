import { PassThrough } from 'stream';

var mysql = require ('mysql');
var inquirer = require ('inquirer');

var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user:"root",
    Password:"NotAnother1",
    database:"bamazon"

});

connection.connect(function(err) {
    if(err) throw err;
    console.log("connection succesfull")
})
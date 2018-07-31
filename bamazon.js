var mysql = require ('mysql');
var inquirer = require ('inquirer');

var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user:"root",
    Password:"",
    database:"bamazon"

});

connection.connect(function(err){
    if(err) throw err;
    console.log("connection succesfull!");
    makeTable();
})

var makeTable = function(){
    connection.query("SELECT * FROM products", function(err, res){
        for(var i=o; i<res.length; i++){
            console.log(res[i].itemid+" || "+res[i].productname+" || "+res[i.departmentname+" || "+res[i].price+" || "+res[i].stockquantity+"\n");
        }

        })
    
}
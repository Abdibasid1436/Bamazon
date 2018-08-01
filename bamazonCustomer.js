var mysql = require ('mysql');
var inquirer = require ('inquirer');

var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user:"root",
    password:"root",
    database:"bamazon"

});

connection.connect(function(err){
    if(err) throw err;
    console.log("connection succesfull!");
    makeTable();
})

var makeTable = function(){
    connection.query("SELECT * FROM products", function(err, res){
        for(var i=0; i<res.length; i++){
            console.log(res[i].itemid+" || "+res[i].productname+" || "+res[i].departmentname+" || "+res[i].price+" || "+res[i].stockquantity+"\n");
        }

        })
    
}

function buyItem() {
    inquirer.prompt([
        {
            "type"    : "input",
            "name"    : "item_id",
            "message" : "Enter the ID of the item that you want to buy:",
            "validate": value => (value !== "" && !isNaN(value) && items.includes(parseFloat(value)))
        },
        {
            "type"    : "input",
            "name"    : "buy_quantity",
            "message" : "Enter the quantity that you want to buy:",
            "validate": validateInput.isWholeNumber
        },
        {
            "type"   : "confirm",
            "name"   : "continue",
            "message": "Buy another item?",
            "default": true
        }

    ]).then(response => {
        const item_id      = parseInt(response.item_id);
        const buy_quantity = parseInt(response.buy_quantity);

        const sql_command =
            `UPDATE products
             SET product_sales  = IF(stock_quantity >= ${buy_quantity}, product_sales + ${buy_quantity} * price, product_sales),
                 stock_quantity = IF(stock_quantity >= ${buy_quantity}, stock_quantity - ${buy_quantity}, stock_quantity)
             WHERE item_id = ${item_id};
             SELECT product_name, price FROM products WHERE item_id = ${item_id};`;

        connection.query(sql_command, (error, results) => {
            const product_name = results[1][0].product_name;
            const price        = results[1][0].price;
            const subtotal     = buy_quantity * price;

            try {
                if (error) throw `Error: Updating item #${item_id} failed.\n`;

                if (results[0].changedRows === 1) {
                    receipt.push({product_name, buy_quantity, price, subtotal});

                    console.log("\nCongratulations, you bought ".white + `${buy_quantity} ${product_name}'s`.yellow.bold + "!".white);
                    console.log(`Subtotal: $${subtotal.toFixed(2)}\n`.white);

                } else if (buy_quantity > 0) {
                    console.log("\nSorry, we do not have ".white + `${buy_quantity} ${product_name}'s`.yellow.bold + " in stock.\n".white);

                } else {
                    console.log("\nThat's all right. No pressure to buy ".white + `${product_name}'s`.yellow.bold + " right now.\n".white);

                }

            } catch(error) {
                displayError(error);

            } finally {
                setTimeout((response.continue) ? menu_customer : exitProgram, 2000);

            }

        });

    });
}
function exitProgram() {
    clearScreen();

    displayTable(receipt, 10, {
        "product_name": undefined,
        "buy_quantity": 0,
        "price"       : 2,
        "subtotal"    : 2
    });

    // Display the total
    const total = receipt.reduce((sum, value) => sum + parseFloat(value.subtotal), 0);

    console.log("Total: ".white + `$${total.toFixed(2)}\n`.yellow.bold);

    console.log("Thank you for shopping with Bamazon!\n".white);

    connection.end();
}
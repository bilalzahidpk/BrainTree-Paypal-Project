Bonus Question
How would you handle security for saving credit cards?

Answer:

1. By complying with PCI DSS Standards. Also, obtaining PCI DSS certification to ensure security compliance of payment card infrastructure.
2. By implementing CSRF tokens to prevent card details from being stolen by an attacker. For the sake of simplicity, this was not implemented here.
3. By not storing card data in the database, if there is a need to store secure data in the database, properly encrypt the data as performed in the application by encrypting the payment gateway response using AES-256 and storing it in the database.
4. Using HTTPS, to ensure secure transmission of data from client to server.
5. Using the SDK provided by the payment gateway, this will ensure security is maintained at the payment gateway's end.

How to Run the App.

1. Run npm install to install the dependencies.
2. Run npm start to run the app.

How to Check Test Cases.

1. View the app.test.js file to see the cases.
2. Run npm test.

Validation has been performed on the front-end for different fields. Validation can be made complex by ensuring it on the server-side by using the express-validator library. However, for simplicity purposes validation was maintained on the front-end.

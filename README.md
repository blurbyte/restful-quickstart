#Welcome to RESTful Quickstart
RESTful Quickstart is complete *Node.js* API hooked to *Azure SQL database*. It's based on modern REST architecture and shows how to implement GET, POST, PUT and DELETE methods. It provides directory stucture, initial environment setup and complete real world example. Technologies used: __Express__, __MSSQL__, __ESLint__, __Nodemon__.

###Getting started!
To set project up:
  1. Install Node, preferably __5.0__ or greater
  2. Install __Git__
  3. Clone the repository `git clone https://github.com/blurbyte/restful-quickstart.git`
  4. Install two Chrome plugins: __Postman__ (very handy tool for API testing) and __JSON Formatter__ (makes JSON easy to read in browser)
  5. [Download](https://msdn.microsoft.com/en-us/library/mt238290.aspx) and install SQL Server Management Studio (__SSMS__) – very helpful Azure SQL database management tool
  5. Create and set up demo Azure SQL database (it will be list of console games worth playing 😜, [detailed description below](#azure-sql-database-setup))
  6. Enter project directory and install all required modules `npm install`
  7. Set up your Azure SQL *database connection string* – navigate to __routes/sqlConfig.js__ file and enter required credinals
  8. Start demo aplication `npm start -s`
  9. Point browser to __http://localhost:5000/api/games__
  10. Check [list of available demo API routes](#api-routes), test API with Postman ([short how-to guide below](#testing-restful-api-with-postman)), watch database changes in SSMS
  11. Take some time and review application code, first __app.js__ file, than __routes__ directory and finally __controllers__ folder
  12. Create your own database and hook your own API to it 👍

###Comprehensive modules overview
 Module | Description
 --- | ---
 __express__ | Node.js web application framework, handles routing, server requests and responses
 __body-parser__ | Requests body parsing middleware
 __mssql__ | MS SQL Server client, check out its [detailed documentation](https://github.com/patriksimek/node-mssql)
 __bluebird__ | Promise library
 __nodemon__ | Automatically restarts development server after changes
 __eslint__, eslint-watch | Reports JavaScript and React syntax errors
 __chalk__ | Cool text colors and backgrounds for Terminal
 __npm-run-all__ | Allows to run multiple npm scripts in parallel
 
###Directories structure explained
List of important files and directories:
  * *package.json* – list of all installed npm modules
  * *.npmrc* – tells npm to save the exact version of the module
  * *.eslintrc* – ESLint configuration file, list of ESLint rules
  * *.editorconfig* – enforces typing rules (via code editor plugin)
  * *.gitignore* – tells Git which files it should ignore
  * *app.js* – API application starting point, Node.js server and modules setup
  * *__routes__/sqlConfig.js* – database connection string setup
  * *__routes__/gameRouter.js* – demo API routes declarations
  * *__controllers__/gameController.js* – REST verbs implementation and logic

###Azure SQL database setup
  1. To created Azure SQL __logical server__ and __database__ for demo API follow closely steps described in [this short article](https://azure.microsoft.com/en-us/documentation/articles/sql-database-get-started/), don't forget to give database meaningful name such as *BestGames*
  2. Connect to recently created database via SQL Server Management Studio (__SSMS__), select it from list *Databases > BestGames* and open up new SQL Query window <kbd>Ctrl</kbd> + <kbd>N</kbd>
  3. To keep things simple create one new __table__ called *game* by executing query <kbd>F5</kbd> :
  
    ```sql
    create table game(
      id integer primary key identity(1,1) not null, -- auto-increment identifier
      title nvarchar(500) not null unique,
      rating tinyint not null check(rating <= 100),  -- value constraint
      genre nvarchar(100) not null,
      descr nvarchar(max)
    );
    ```
    
  4. Fill table with actual games data:
  
    ```sql
    insert into game(title, rating, genre, descr)
    values ('Dark Souls', 89, 'role-playing', 'Dark fantasy RPG...');
    ```
  5. Add as many records as you wish 😋

###API Routes
List of available demo API routes with associated REST verbs
  * http://localhost:5000/ – GET
  * http://localhost:5000/games – GET, POST
  * http://localhost:5000/games/:gameId – GET, PUT, DELETE

###Testing RESTful API with Postman
To test __GET__ method of our demo API (it reads records from database):
  1. Select __GET__ from drop-down and type required url into input box, in this case __http://localhost:5000/api/games/__
  2. Press *Send* and voilà – in the section below response *body* and *http status code* will be displayed
  <img src="http://eloriel.azureedge.net/restful-quickstrt/restful-quickstart-postman-get-example.png" alt="Testing GET method with Postman for multiple elements" width="600">
  3. Type __http://localhost:5000/api/games/1__ and check response for single item (response body and status code)  
  <img src="http://eloriel.azureedge.net/restful-quickstrt/restful-quickstart-postman-get-example2.png" alt="Testing GET method with Postman for single id" width="600">
  4. Do the same for *id* which doesn't exist, for example __http://localhost:5000/api/games/47__

To test __POST__ method (it creates new record in database):
  1. Select __POST__ and type __http://localhost:5000/api/games/__
  2. In section just below serch box select *Headers* tab and provide __Content-Type__ as a key and __application/json__ as a value
  <img src="http://eloriel.azureedge.net/restful-quickstrt/restful-quickstart-postman-post-header.png" alt="Setting up POST method Header in Postman" width="600">        
  3. Select *Body* tab and *raw* option
  4. Type all required info about game in a textbox in JSON format
  <img src="http://eloriel.azureedge.net/restful-quickstrt/restful-quickstart-postman-post-body.png" alt="Setting up POST method Header in Postman" width="600">
  5. After sending request check response body and status
  6. Try to send exacly same data again

To test __PUT__ method (it updates record in database)
  1. Select __PUT__ and type __http://localhost:5000/api/games/1__
  2. Further steps are exacly the same as in POST: set request header and body, check for response body and status
  3. Try again with similar request body but omit some keys and values

To test __DELETE__ method (it deletes record from database)
  1. Select __DELETE__ and type __http://localhost:5000/api/games/1__
  2. Send the request and check response status
  <img src="http://eloriel.azureedge.net/restful-quickstrt/restful-quickstart-postman-delete.png" alt="Testing DELETE with Postman" width="600">

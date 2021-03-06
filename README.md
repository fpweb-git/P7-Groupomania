# P7-Groupomania 

![](home-page.png)

## *Environment* 

#### *Backend :* 
Node JS / MySQL / Sequelize

Dependencies :

```
express
bcrypt
body-parser
jsonwebtoken
multer
mysql2
nodemon
sequelize-cli
```

#### *Frontend :* 
Vue JS / Element ui

Dependencies :

```
axios
core-js
element-ui
vue
vue-router
vuex
```

## *Run the project* 

#### *Backend :*

Requires MySQl Workbench (or any mysql manager) and nodeJS installed on your computer.

Edit config.json file inside backend/config

Change the development fields as your database setup(username, password,etc..)

Setup images folder :

create an 'images' folder at the root of the backend folder

in the 'images' folder create two other folders 'posts' and 'users'

Then on your terminal :

```
cd backend
npm i
nodemon run server
```

Tables and rows will be created automatically in your database after run the server.

#### *Frontend :*

Requires VueJS installed globally on your computer.

Then on your terminal :

```
cd frontend
npm i
npm run serve
```

The app will run on http://localhost:8080/.

## *Information :*

To setup admin user simply modify 'isAdmin' field to '1' on your database.
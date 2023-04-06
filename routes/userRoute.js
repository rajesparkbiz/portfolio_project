const express=require('express');
const UserController=require('../controller/userController.js');
const userAuth=require('../middlewares/user-midelware.js');

const routes=express.Router();


routes.get('/tic-tac-toe',UserController.ticTacToeGame);
routes.get('/figmaOne',UserController.figmaOne);
routes.get('/figmaTwo',UserController.figmaTwo);
routes.get('/dynamicTable',UserController.dynamicTable);
routes.get('/scrollableTable',UserController.scrollableTable);
routes.get('/simpleForm',UserController.simpleForm);
routes.get('/colorCube',UserController.colorCube);

module.exports=routes;
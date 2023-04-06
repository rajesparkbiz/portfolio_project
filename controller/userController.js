require('dotenv').config();

class UserController{
    static ticTacToeGame=async (req,res)=>{
        res.render('tic-tac-toe');
    }
    static figmaOne=async (req,res)=>{
        res.render('figma-one');
    }
    static figmaTwo=async (req,res)=>{
        res.render('figma-two');
    }
    static dynamicTable=async (req,res)=>{
        res.render('dynamic-table');
    }
    static scrollableTable=async (req,res)=>{
        res.render('scrollable-table');
    }
    static simpleForm=async (req,res)=>{
        res.render('simple-form');
    }
    static colorCube=async (req,res)=>{
        res.render('color-cube');
    }
}

module.exports=UserController;
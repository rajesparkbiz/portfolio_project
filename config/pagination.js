const express = require('express');
const ejs = require('ejs');
const bp = require('body-parser');
const conn = require("../database/dbconnect.js");
const bodyParser = require('body-parser');
const e = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));

let ids = ["id", "First_Name", "Last_Name", "Contact_No", "City", "Email", "University_id", "createdAt"];

//this request use for display all data in web using ejs based on entered page value
app.get('/page/:page', (req, res) => {
    let ids = ["id", "First_Name", "Last_Name", "Contact_No", "City", "Email", "University_id", "createdAt",];
    let page_id = req.params.page;
    conn.query(`select * from student_express limit 0,${page_id}`, (err, result, filed) => {
        res.render("page", { data: result, id: ids, page: 1 });
    });
});

//this get request use for paagination
app.get('/', (req, res) => {
    
    let total_records = 0;
    let page = req.query.page ?? 1;
    let limit = 10;
    let value = (page - 1) * limit;
    let sort=req.query.sort ?? 'ASC';
    let orderBy=req.query.orderBy;
    
    conn.query('select count(*) as count from student_express', (err, res, field) => {
        total_records = res[0]["count"];
    });
    

    conn.query(`select * from student_express order by ${req.query.orderBy ?? "id"} ${sort} limit ${value},${limit}`, (err, result, filed) => {
        //this code is use for display a some pages card-view for navigate directly in that page.

        //this code is use for perform next and prevous functionality
        if (page == 1) {
            prev = 0;
        }
        else {
            prev = parseInt(page) - 1;
        }
        if (page == parseInt(total_records / limit) || page == 0) {
            page = 1;
        } else {
            page++;
        }

        //use for toogle a sort functionality
        if(sort=='ASC' && orderBy=='id'){
            sort='DESC';
        }else  if(sort=='ASC' && orderBy=='First_Name'){
            sort='DESC';
        }
        else  if(sort=='ASC' && orderBy=='Last_Name'){
            sort='DESC';
        }
        else  if(sort=='ASC' && orderBy=='Contact_No'){
            sort='DESC';
        }
        else  if(sort=='ASC' && orderBy=='City'){
            sort='DESC';
        }
        else  if(sort=='ASC' && orderBy=='Email'){
            sort='DESC';
        }
        else  if(sort=='ASC' && orderBy=='University_id'){
            sort='DESC';
        }
        else  if(sort=='ASC' && orderBy=='createdAt'){
            sort='DESC';
        }
        else{
            sort='ASC';
        }

        res.json({result:result,page:page,prev:prev,total_pages:(total_records/limit),sort:sort});
    });
});

//this get request use for paagination
app.get('/home', (req, res) => {
    
    let total_records = 0;
    let page = req.query.page ?? 1;
    let limit = 10;
    let value = (page - 1) * limit;
    let sort=req.query.sort ?? 'ASC';
    let orderBy=req.query.orderBy;
    
    
    conn.query('select count(*) as count from student_express', (err, res, field) => {
        total_records = res[0]["count"];
    });
    

    conn.query(`select * from student_express order by ${req.query.orderBy ?? "id"} ${sort} limit ${value},${limit}`, (err, result, filed) => {
        //this code is use for display a some pages card-view for navigate directly in that page.

        //this code is use for perform next and prevous functionality
        if (page == 1) {
            prev = 0;
        }
        else {
            prev = parseInt(page) - 1;  
        }
        if (page == parseInt(total_records / limit) || page == 0) {
            page = 1;
        } else {
            page++;
        }

        //use for toogle a sort functionality
        if(sort=='ASC' && orderBy=='id'){
            sort='DESC';
        }else  if(sort=='ASC' && orderBy=='First_Name'){
            sort='DESC';
        }
        else  if(sort=='ASC' && orderBy=='Last_Name'){
            sort='DESC';
        }
        else  if(sort=='ASC' && orderBy=='Contact_No'){
            sort='DESC';
        }
        else  if(sort=='ASC' && orderBy=='City'){
            sort='DESC';
        }
        else  if(sort=='ASC' && orderBy=='Email'){
            sort='DESC';
        }
        else  if(sort=='ASC' && orderBy=='University_id'){
            sort='DESC';
        }
        else  if(sort=='ASC' && orderBy=='createdAt'){
            sort='DESC';
        }
        else{
            sort='ASC';
        }

        res.render("page", { data: result, id: ids, page: page, prev: prev, total_pages: (total_records/limit),sort:sort});
    });
});



// this get request use for serach record based on user query
app.post('/search', (req, res) => {
    let query = '%' + req.body.fname + '%';
    conn.query(`SELECT * FROM practice.student_express where student_express.First_Name like '${query}'`, (err, result, filed) => {
        if (err) {
            return console.log(err.message);
        } else {
            res.render("search",{data: result, id: ids, page: 10, prev: 1, total_pages: 12 });
        }
    })
});

app.get('/filter',(req,res)=>{
    conn.query(`select * from student_express order by student_express.${req.query.orderBy}`,(err,result,filed)=>{
        if(err){
            return console.log(err.message);
        }
        res.render("search",{data:result,id:ids});
    });
});

module.exports=app;
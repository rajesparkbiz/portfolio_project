const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mysql = require('mysql2');
const con = require('../database/dbconnect.js');
const { response } = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: false }));


let option_value;
let state_value;
let pref_value;
let department_value;
let courses_name;
let language_name;
let technology_name;
let city_values;


app.get('/',(req,res)=>{
  res.render("job-app-home")
})

app.get('/job-form', async (req, res) => {

  //this query use for get data for drop down menu
  let result1 = await queryExecutor('SELECT * FROM practice.option_master where option_id=1');
  option_value = result1;
  let result2 = await queryExecutor('SELECT * FROM practice.state_master;');
  state_value = result2;
  let result8 = await queryExecutor('SELECT * FROM practice.city_master where state_id=1;');
  city_values = result8;
  let result3 = await queryExecutor('SELECT * FROM practice.option_master where option_id=3');
  pref_value = result3;
  let result4 = await queryExecutor('SELECT * FROM practice.option_master where option_id=4');
  department_value = result4;
  let result5 = await queryExecutor('SELECT * FROM practice.option_master where option_id=5');
  language_name = result5;
  let result6 = await queryExecutor('SELECT * FROM practice.option_master where option_id=6');
  technology_name = result6;
  let result7 = await queryExecutor('SELECT * FROM practice.education_courses_master');
  courses_name = result7;

  res.render("sample", { option_menu: option_value, state_menu: state_value, pref_menu: pref_value, department_menu: department_value, courses: courses_name, languages: language_name, technologies: technology_name, city: city_values });
})

app.post('/insert', async (req, res) => {
  let id;
  const { fname, lname, designation, address1, address2, email, phone, city, gender, relationship, state, dob, zcode, department, expacted_ctc, notice_period, current_ctc, pref_location } = req.body

  const state_value = await queryExecutor(`SELECT * FROM state_master where state_id=${parseInt(state)}`);



  let basic_query = `INSERT INTO design.candidate_info (fname, lname, designation, dob, zcode, gender, perf_location, expacted_ctc, email, current_ctc, department, notice_peroid, address, city, createdAt, phone,state) VALUES ('${fname}', '${lname}', '${designation}', '${dob}', '${zcode}', '${gender}', '${pref_location}', '${expacted_ctc}', '${email}', '${current_ctc}', '${department}', '${notice_period}', '${address1 + " " + address2}', '${city}',CURRENT_TIMESTAMP, '${phone}','${state_value[0].state_name}');`;

  con.query(basic_query, (err, result1) => {

    id = result1.insertId;

    //education
    insertEduData(req.body.Course, req.body.institution, req.body.Percentage, req.body.Passing_Year, id);

    //experience
    insertExeData(req.body.exe_company_name, req.body.exe_designation, req.body.exe_from, req.body.exe_to, id)


    //refrence
    insertRefData(req.body.ref_name, req.body.ref_number, req.body.ref_relation, id);

    //language

    con.query(`SELECT * FROM practice.option_master where option_id=5;`, (err, result) => {
      var query_lan;
      for (let i = 0; i < result.length; i++) {

        var language_name = req.body[result[i].option_value];
        var read = req.body[result[i].option_value + "r"];
        var write = req.body[result[i].option_value + "w"];
        var speak = req.body[result[i].option_value + "s"];
        if (typeof (read) == "undefined") read = "No";
        if (typeof (write) == "undefined") write = "No";
        if (typeof (speak) == "undefined") speak = "No";

        if (typeof (language_name) == "string") {
          query_lan = `INSERT INTO design.language_info (language_name, language_read, language_speak, language_write, candidate_id) VALUES ('${language_name}','${read}','${speak}','${write}',${id})`;

          con.query(query_lan, (err, result) => {
            if (err) console.log(err.message);
            else {
              console.log(result, "successfully insert languages");
            }
          })
        }
      }
    })


    //technology
    con.query(`SELECT * FROM practice.option_master where option_id=6;`, (err, result) => {
      for (let i = 0; i < result.length; i++) {
        var tech = req.body[result[i].option_value]
        var a = req.body[result[i].option_value + 'a'];

        if (typeof (tech) == "string") {
          var query_tech = `INSERT INTO design.technology_info (technology_name, technology_level, candidate_id) VALUES ('${tech}','${a}',${id})`;

          con.query(query_tech, (err, result) => {
            if (err) console.log(err.message);
            else {
              res.redirect('/job-app/job-info')

            }
          })
        }
      }
    })

  })
});

app.get('/job-info', async (req, res) => {
  let ids = ['candidate_id', 'fname', 'lname', 'designation', 'dob', 'zcode', 'gender', 'perf_location', 'expacted_ctc', 'email', 'current_ctc', 'department', 'notice_peroid', 'address', 'city', 'createdAt', 'phone', 'state'];

  const info = await queryExecutor('SELECT * FROM design.candidate_info where isDeleted=0');
  res.render("basic_info", { data: info, id: ids });
});

app.get('/more', (req, res) => {
  let id = req.query.id;
  let key1 = ['candidate_id', 'course_name', 'education_board', 'education_year', 'education_grade'];
  let key2 = ['candidate_id', 'company_name', 'candidate_position', 'candidate_joining', 'candidate_leaving'];
  let key3 = ['candidate_id', 'language_name', 'language_read', 'language_speak', 'language_write'];
  let key4 = ['candidate_id', 'technology_name', 'technology_level'];
  let key5 = ['candidate_id', 'person_name', 'person_contact', 'person_relation'];
  let acadamic_query = `select * from design.acadamic_info where candidate_id=${Number.parseInt(id)}`;
  let experience_query = `select * from design.experience_info where candidate_id=${Number.parseInt(id)}`;
  let language_query = `select * from design.language_info where candidate_id=${Number.parseInt(id)}`;
  let technology_query = `select * from design.technology_info where candidate_id=${Number.parseInt(id)}`;
  let refrence_query = `select * from design.reference_info where candidate_id=${Number.parseInt(id)}`;
  con.query(acadamic_query, (err, result1, filed) => {
    con.query(experience_query, (err, result2, filed) => {
      con.query(language_query, (err, result3, filed) => {
        con.query(technology_query, (err, result4, filed) => {
          console.log(result4);
          con.query(refrence_query, (err, result5, filed) => {
            console.log(result5);
            res.render("more", { acadamic_data: result1, id: key1, experience_data: result2, id1: key2, language_data: result3, id2: key3, technology_data: result4, id3: key4, refrence_data: result5, id4: key5 });
          })
        })
      })
    })
  })
});

app.post('/search', (req, res) => {
  let search_query = req.body.search_query.trim();
  let wc = ['^', '&', '_', '~', '%', '$', '!'];
  let search = "";
  let operation_count = 0;
  let query = "select * from design.candidate_info where ";
  for (let i = 0; i < search_query.length; i++) {

    if (wc.includes(search_query[i])) {
      search += " " + search_query[i];
      operation_count++;
    } else {
      search += search_query[i];
    }
  }

  let values = search.split(" ").slice(1); //use for split an string and then remove first element
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] == '^') {
      operation_count--;
      if (operation_count) {
        query += `fname like '${values[i].slice(1)}%' and `;
      } else {
        query += `fname like '${values[i].slice(1)}%'`;
      }
    }
    if (values[i][0] == '&') {
      operation_count--;
      if (operation_count) {
        query += `lname like '${values[i].slice(1)}%' and `;
      } else {
        query += `lname like '${values[i].slice(1)}%'`;
      }
    }
    if (values[i][0] == '_') {
      operation_count--;
      if (operation_count) {
        query += `email like '${values[i].slice(1)}%' and `;
      } else {
        query += `email like '${values[i].slice(1)}%'`;
      }
    }
    if (values[i][0] == '~') {
      operation_count--;
      if (operation_count) {
        query += `phone like '${values[i].slice(1)}%' and `;
      } else {
        query += `phone like '${values[i].slice(1)}%'`;
      }
    }

    if (values[i][0] == '%') {
      operation_count--;
      if (operation_count) {
        query += `designation like '%${values[i].slice(1)}%' and `;
      } else {
        query += `designation like '%${values[i].slice(1)}%'`;
      }
    }
    if (values[i][0] == '$') {
      operation_count--;
      if (operation_count) {
        query += `city like '%${values[i].slice(1)}%' and `;
      } else {
        query += `city like '%${values[i].slice(1)}%'`;
      }
    }
    if (values[i][0] == '!') {
      operation_count--;
      if (operation_count) {
        query += `state like '%${values[i].slice(1)}%' and `;
      } else {
        query += `state like '%${values[i].slice(1)}%'`;
      }
    }
  }

  con.query(query, (err, result) => {
    let ids = ['candidate_id', 'fname', 'lname', 'designation', 'dob', 'zcode', 'gender', 'perf_location', 'expacted_ctc', 'email', 'current_ctc', 'department', 'notice_peroid', 'address', 'city', 'createdAt', 'phone', 'state'];
    res.render("basic_info", { data: result, id: ids });
  })
})

app.get('/edit', async (req, res) => {

  let candidate_data = await queryExecutor(`select * from design.candidate_info where candidate_id=${req.query.id}`);


  let acadamic_data = await queryExecutor(`select * from design.acadamic_info where candidate_id=${req.query.id}`);


  let experience_data = await queryExecutor(`select * from design.experience_info where candidate_id=${req.query.id}`);


  let language_data = await queryExecutor(`select * from design.language_info where candidate_id=${req.query.id}`);


  let reference_data = await queryExecutor(`select * from design.reference_info where candidate_id=${req.query.id}`);

  let technology_data = await queryExecutor(`select * from design.technology_info where candidate_id=${req.query.id}`);

  let state_res = await queryExecutor('SELECT * FROM practice.state_master;');


  let department_res = await queryExecutor('SELECT * FROM practice.option_master where option_id=4;');


  let prefered_res = await queryExecutor('SELECT * FROM practice.option_master where option_id=3;');


  let courses = await queryExecutor('SELECT * FROM practice.education_courses_master;');

  let technologies = await queryExecutor(`SELECT option_master.option_value FROM practice.option_master where option_id=6`);

  let languages = await queryExecutor(`SELECT option_master.option_value FROM practice.option_master where option_id=5`);

  let allTech = [];
  let userTech = [];

  let allLang = [];
  let userLang = [];

  for (let i = 0; i < technologies.length; i++) {
    allTech.push(technologies[i].option_value)
  }
  for (let i = 0; i < technology_data.length; i++) {
    userTech.push(technology_data[i].technology_name)
  }

  const remanningTech = allTech.filter(element => !userTech.includes(element)).concat((userTech.filter(element => !allTech.includes(element))));

  for (let i = 0; i < languages.length; i++) {
    allLang.push(languages[i].option_value)
  }
  for (let i = 0; i < language_data.length; i++) {
    userLang.push(language_data[i].language_name)
  }

  const remanningLang = allLang.filter(element => !userLang.includes(element)).concat((userLang.filter(element => !allLang.includes(element))));


  const state = candidate_data[0].state;
  var state_id;

  if (state == 'Gujarat') {
    state_id = 1;
  }

  if (state == 'Haryana') {
    state_id = 2;
  }
  if (state == 'Jharkhand') {
    state_id = 3;
  }
  if (state == 'Assam') {
    state_id = 4;
  }
  if (state == 'Bihar') {
    state_id = 5;
  }
  if (state == 'Goa') {
    state_id = 6;
  }

  let city_res = await queryExecutor(`SELECT * FROM practice.city_master where state_id=${state_id}`);

  res.render("test", { data: candidate_data, gender_type: ['Male', 'Female', 'Other'], state: state_res, acadamic: acadamic_data, experience: experience_data, reference: reference_data, laanguage: language_data, technology: technology_data, id: req.query.id, city: city_res, pref: prefered_res, department: department_res, courses: courses, remanningTech: remanningTech, remanningLang: remanningLang });
});

//use for dynamic drop down
app.get('/cities', async (req, res) => {
  const state_id = req.query.state_id;
  const city = await queryExecutor(`SELECT * FROM practice.city_master where  state_id=${state_id};`);
  res.send(city);
})

app.get('/delete', async (req, res) => {
  const record_id = req.query.id;
  const result = await queryExecutor(`update design.candidate_info set isDeleted=1 where candidate_info.candidate_id=${parseInt(record_id)};`);
})

app.get('/delete-multiple', async (req, res) => {
  const record_id = req.query.id;
  const ids = record_id.split(",");
  for (let i = 0; i < ids.length; i++) {
    let id = parseInt(ids[i]);
    const result = await queryExecutor(`update design.candidate_info set isDeleted=1 where candidate_info.candidate_id=${parseInt(id)};`);
  }
})

app.post('/insertEdu', (req, res) => {

  insertEduData(req.body.Course, req.body.institution, req.body.Percentage, req.body.Passing_Year, req.body.id);

  res.redirect(`/job-app/edit/?id=${parseInt(req.body.id)}`);
})


app.post('/insertExe', (req, res) => {

  insertExeData(req.body.exe_company_name, req.body.exe_designation, req.body.exe_from, req.body.exe_to, req.body.id)

  res.redirect(`/job-app/edit/?id=${parseInt(req.body.id)}`);
})

app.post('/insertRef', (req, res) => {


  insertRefData(req.body.ref_name, req.body.ref_number, req.body.ref_relation, req.body.id);

  res.redirect(`/job-app/edit/?id=${parseInt(req.body.id)}`);
})


app.post('/insertTech', async (req, res) => {

  let technology_data = await queryExecutor(`select * from design.technology_info where candidate_id=${parseInt(req.body.id)}`);

  let technologies = await queryExecutor(`SELECT option_master.option_value FROM practice.option_master where option_id=6`);


  let allTech = [];
  let userTech = [];

  for (let i = 0; i < technologies.length; i++) {
    allTech.push(technologies[i].option_value)
  }
  for (let i = 0; i < technology_data.length; i++) {
    userTech.push(technology_data[i].technology_name)
  }

  const remanningTech = allTech.filter(element => !userTech.includes(element)).concat((userTech.filter(element => !allTech.includes(element))));

  for (let i = 0; i < remanningTech.length; i++) {
    var tech = req.body[remanningTech[i]]
    var a = req.body[remanningTech[i] + 'a'];

    if (typeof (tech) == "string") {
      var query_tech = `INSERT INTO design.technology_info (technology_name, technology_level, candidate_id) VALUES ('${tech}','${a}',${req.body.id})`;
      const result = await queryExecutor(query_tech);
    }
  }


  res.redirect(`/job-app/edit/?id=${parseInt(req.body.id)}`);
})

app.post('/insertLang', async (req, res) => {

  let language_data = await queryExecutor(`select * from design.language_info where candidate_id=${parseInt(req.body.id)}`);

  let languages = await queryExecutor(`SELECT option_master.option_value FROM practice.option_master where option_id=5`);

  let allLang = [];
  let userLang = [];

  for (let i = 0; i < languages.length; i++) {
    allLang.push(languages[i].option_value)
  }
  for (let i = 0; i < language_data.length; i++) {
    userLang.push(language_data[i].language_name)
  }

  const remanningLang = allLang.filter(element => !userLang.includes(element)).concat((userLang.filter(element => !allLang.includes(element))));


  for (let i = 0; i < remanningLang.length; i++) {

    var language_name = req.body[remanningLang[i]];
    var read = req.body[remanningLang[i] + "r"];
    var write = req.body[remanningLang[i] + "w"];
    var speak = req.body[remanningLang[i] + "s"];
    if (typeof (read) == "undefined") read = "No";
    if (typeof (write) == "undefined") write = "No";
    if (typeof (speak) == "undefined") speak = "No";

    if (typeof (language_name) == "string") {
      query_lan = `INSERT INTO design.language_info (language_name, language_read, language_speak, language_write, candidate_id) VALUES ('${language_name}','${read}','${speak}','${write}',${parseInt(req.body.id)})`;
      
      const result=await queryExecutor(query_lan);

    }
  }


  res.redirect(`/job-app/edit/?id=${parseInt(req.body.id)}`);
})


app.post('/update-data', async (req, res) => {
  const data = req.body;
  let update_query = `
update design.candidate_info set 
candidate_info.fname='${data.fname}',
candidate_info.lname='${data.lname}',
candidate_info.designation='${data.designation}',
candidate_info.dob='${data.dob}',
candidate_info.zcode='${data.zcode}',
candidate_info.gender='${data.gender}',
candidate_info.perf_location='${data.pref_location}',
candidate_info.expacted_ctc='${data.expacted_ctc}',
candidate_info.email='${data.email}',
candidate_info.current_ctc='${data.current_ctc}',
candidate_info.department='${data.department}',
candidate_info.notice_peroid='${data.notice_peroid}',
candidate_info.address='${data.address}',
candidate_info.city='${data.city}',
candidate_info.phone='${data.phone}',
candidate_info.state='${data.state}' where candidate_info.candidate_id=${data.id};`;

  const result = await queryExecutor(update_query);
  res.redirect(`/job-app/edit/?id=${data.id}`);
})

app.post('/update-data/edu', (req, res) => {
  //education
  const { Course, institution, Percentage, Passing_Year, id, edu_id } = req.body

  if (typeof (Course, institution, Percentage, Passing_Year, edu_id) == "string") {
    var edu_query =
      `update design.acadamic_info set acadamic_info.course_name='${Course}',
      acadamic_info.education_board='${institution}',
      acadamic_info.education_year='${Passing_Year}',
      acadamic_info.education_grade='${Percentage}' where acadamic_info.acadamic_id=${parseInt(edu_id)};`;

    con.query(edu_query, (err, result2) => {
      if (err) return console.log(err.message);
      else {
        res.redirect(`/edit/?id=${id}`)
        console.log(result2, 'acadamic insert success');
      }

    })
  }
  else {
    for (let i = 0; i < Course.length; i++) {

      let edu_query = `update design.acadamic_info set acadamic_info.course_name='${Course[i]}',
      acadamic_info.education_board='${institution[i]}',
      acadamic_info.education_year='${Passing_Year[i]}',
      acadamic_info.education_grade='${Percentage[i]}' where acadamic_info.acadamic_id=${parseInt(edu_id[i])};`;

      console.log(edu_query);

      con.query(edu_query, (err, result2) => {
        if (err) return console.log(err.message);
        else {
          console.log(result2, 'acadamic insert success');
        }

      })

      res.redirect(`/job-app/edit/?id=${id}`)
    }
  }

})

app.post('/update-data/exe', async (req, res) => {
  //experience
  const { exe_company_name, exe_designation, exe_from, exe_to, exe_id, id } = req.body

  console.log(exe_company_name, exe_designation, exe_from, exe_to, exe_id);

  if (typeof (exe_company_name, exe_designation, exe_from, exe_to, exe_id) == "string") {
    let exe_query = `update design.experience_info set experience_info.company_name='${exe_company_name}',
    experience_info.candidate_position='${exe_designation}',
    experience_info.candidate_joining='${exe_from}',
    experience_info.candidate_leaving='${exe_to}' where experience_info.exprience_id=${exe_id};`;
    con.query(exe_query, (err, result3) => {
      if (err) return console.log(err.message);
      else {
        res.redirect(`/job-app/edit/?id=${id}`)
      }

    })
  }
  else {
    for (let i = 0; i < exe_company_name.length; i++) {

      let exe_query = `update design.experience_info set experience_info.company_name='${exe_company_name[i]}',
      experience_info.candidate_position='${exe_designation[i]}',
      experience_info.candidate_joining='${exe_from[i]}',
      experience_info.candidate_leaving='${exe_to[i]}' where experience_info.exprience_id=${exe_id[i]};`;
      con.query(exe_query, (err, result3) => {
        if (err) return console.log(err.message);
        else {
        }

      })

    }
    res.redirect(`/job-app/edit/?id=${id}`)
  }


})

app.post('/update-data/ref', async (req, res) => {

  const { ref_name, ref_number, ref_relation, ref_id, id } = req.body

  console.log(ref_name, ref_number, ref_relation, ref_id);


  if (typeof (ref_name, ref_number, ref_relation, ref_id) == "string") {
    var ref_query = `update design.reference_info set reference_info.person_name='${ref_name}',
    reference_info.person_contact='${ref_number}',
    reference_info.person_relation='${ref_relation}' where reference_info.reference_id=${ref_id}`;
    con.query(ref_query, (err, result4) => {
      if (err) return console.log(err.message);
      else {
        res.redirect(`/job-app/edit/?id=${id}`)
      }

    })
  }
  else {
    for (let i = 0; i < ref_name.length; i++) {

      var ref_query = `update design.reference_info set reference_info.person_name='${ref_name[i]}',
      reference_info.person_contact='${ref_number[i]}',
      reference_info.person_relation='${ref_relation[i]}' where reference_info.reference_id=${ref_id[i]}`;

      con.query(ref_query, (err, result4) => {
        if (err) return console.log(err.message);
        else {
        }

      })

    }
    res.redirect(`/job-app/edit/?id=${id}`)
  }


})

app.post('/update-data/language', (req, res) => {
  const id = req.body.id;
  console.log(req.body);
  const lang_id = req.body.lang_id;

  con.query(`SELECT * FROM design.language_info where candidate_id=${req.body.id};`, (err, result) => {
    var query_lan;

    for (let i = 0; i < result.length; i++) {
      var language_name = req.body[result[i].language_name];
      var read = req.body[result[i].language_name + "r"];
      var write = req.body[result[i].language_name + "w"];
      var speak = req.body[result[i].language_name + "s"];
      if (typeof (read) == "undefined") read = "No";
      if (typeof (write) == "undefined") write = "No";
      if (typeof (speak) == "undefined") speak = "No";
      console.log(language_name, read, speak, write);

      if (typeof (language_name) == "string") {
        query_lan = `update design.language_info set language_info.language_name='${language_name}',
      language_info.language_read='${read}',
      language_info.language_speak='${speak}',
      language_info.language_write='${write}' where language_info.language_id=${lang_id[i]}`;
        console.log(query_lan);

        con.query(query_lan, (err, result4) => {
          if (err) return console.log(err.message);
        })


      }

    }
    res.redirect(`/job-app/edit/?id=${id}`)
  })
})

app.post('/update-data/technology', (req, res) => {
  const techId = req.body.tech_id;
  const id = req.body.id;

  con.query(`select * from design.technology_info where candidate_id=${parseInt(req.body.id)}`, (err, result) => {
    console.log(result);
    for (let i = 0; i < result.length; i++) {
      var tech = req.body[result[i].technology_name]
      var level = req.body[result[i].technology_name + 'a'];

      if (typeof (tech) == "string") {
        var query_tech = `update design.technology_info set technology_info.technology_name='${tech}',
        technology_info.technology_level='${level}' where technology_info.tech_id=${techId[i]}`;
        console.log(query_tech);

        con.query(query_tech, (err, result) => {
          if (err) console.log(err.message);
        })
      }
    }
    res.redirect(`/job-app/edit/?id=${id}`)
  })
});
 

function insertEduData(Course, institution, Percentage, Passing_Year, id) {


  if (typeof (Course, institution, Percentage, Passing_Year) == "string") {
    var edu_query = `INSERT INTO design.acadamic_info (course_name, education_board, education_year, education_grade, candidate_id) values ('${Course}',
          '${institution}','${Passing_Year}','${Percentage}',${parseInt(id)})`;

    con.query(edu_query, (err, result2) => {
      if (err) return console.log(err.message);
      else {
        console.log(result2, 'acadamic insert success');
      }

    })
    console.log(edu_query)
  }
  else {
    for (let i = 0; i < Course.length; i++) {


      let edu_query = `INSERT INTO design.acadamic_info (course_name, education_board, education_year, education_grade, candidate_id) values ('${Course[i]}',
          '${institution[i]}','${Passing_Year[i]}','${Percentage[i]}',${parseInt(id)})`;

      console.log(edu_query);

      con.query(edu_query, (err, result2) => {
        if (err) return console.log(err.message);
        else {
          console.log(result2, 'acadamic insert success');
        }

      })

    }
  }

}

function insertExeData(exe_company_name, exe_designation, exe_from, exe_to, id) {

  if (typeof (exe_company_name, exe_designation, exe_from, exe_to) == "string") {
    let exe_query = `INSERT INTO design.experience_info (company_name, candidate_position, candidate_joining, candidate_leaving, candidate_id) values ('${exe_company_name}','${exe_designation}','${exe_from}','${exe_to}',${id})`;
    con.query(exe_query, (err, result3) => {
      if (err) return console.log(err.message);
      else {
        console.log(result3, 'exepernce insert success');
      }

    })
  }
  else {
    for (let i = 0; i < exe_company_name.length; i++) {

      let exe_query = `INSERT INTO design.experience_info (company_name, candidate_position, candidate_joining, candidate_leaving, candidate_id) values ('${exe_company_name[i]}','${exe_designation[i]}','${exe_from[i]}','${exe_to[i]}',${id})`;
      con.query(exe_query, (err, result3) => {
        if (err) return console.log(err.message);
        else {
          console.log(result3, 'technology insert success');
        }

      })

    }
  }
}

function insertRefData(ref_name, ref_number, ref_relation, id) {

  if (typeof (ref_name, ref_number, ref_relation) == "string") {
    var ref_query = `INSERT INTO design.reference_info (person_name, person_contact, person_relation, candidate_id) VALUES ('${ref_name}','${ref_number}','${ref_relation}',${id})`;
    con.query(ref_query, (err, result4) => {
      if (err) return console.log(err.message);
      else {
        console.log(result4, 'refernces insert success');
      }

    })
  }
  else {
    for (let i = 0; i < ref_name.length; i++) {

      var ref_query = `INSERT INTO design.reference_info (person_name, person_contact, person_relation, candidate_id) VALUES ('${ref_name[i]}','${ref_number[i]}','${ref_relation[i]}',${id})`;


      con.query(ref_query, (err, result4) => {
        if (err) return console.log(err.message);
        else {
          console.log(result4, 'refrence insert success');
        }

      })

    }
  }
}

const queryExecutor = (query) => {
  return new Promise((resolve, reject) => {
    con.query(query, (err, result) => {
      resolve(result)
      if (err) {
        reject(err);
      }
    })
  })
}

module.exports = app;

function validateData() {

    var name_value = document.getElementById("student_name").value;
    var email_value = document.getElementById("student_email").value;
    var number_value = document.getElementById("student_number").value;
    var college_value = document.getElementById("student_college").value;
    var gender_value = document.getElementById("student_gender");
    var location_value = document.getElementById("company_location").value;
    var description_value = document.getElementById("student_description").value;
    var developer_position_value = document.querySelectorAll('input[type="checkbox"]:checked');


    var nameError = document.getElementById("nameError");
    var emailError = document.getElementById("emailError");
    var numberError = document.getElementById("numberError");
    var collegeError = document.getElementById("collegeError");
    var genderError = document.getElementById("genderError");
    var locationError = document.getElementById("locationError");
    var positionError = document.getElementById("positionError");
    var descriptionError = document.getElementById("descriptionError");

    if (name_value == "" && name_value.length < 7) {
        nameError.innerHTML = "Please enter valid name";
        if (email_value == "") {
            emailError.innerHTML = "Please enter valid email";
            if (number_value == "") {
                numberError.innerHTML = "Please enter valid number";
                if (college_value == "") {
                    collegeError.innerHTML = "Please enter College name";
                    if (!gender_value.checked) {
                        genderError.innerHTML = "Please select gender";
                        if (!checkedValue()) {
                            positionError.innerHTML = "Please select position";
                            if (description_value == "") {
                                descriptionError.innerHTML = "please write something here.";
                            }
                        }
                    }

                }
            }
        }
    }
    else {
        console.log(`Name of student ${name_value}`);
        console.log(`student email ${email_value}`);
        console.log(`student number ${number_value}`);
        console.log(`student college ${college_value}`);
        console.log(`company location ${location_value}`);
        console.log(`gender ${gender_value.value}`);
        console.log(`description ${description_value}`);
        checkedValue();
        nameError.innerHTML = "";
        emailError.innerHTML = "";
        numberError.innerHTML = "";
        collegeError.innerHTML = "";
        genderError.innerHTML = "";
        locationError.innerHTML = "";
        positionError.innerHTML = "";
        descriptionError.innerHTML = "";
        return false;
    }

}


//fetch all check box choosed value
function checkedValue() {
    var allCheckBox = document.getElementsByClassName("position_type");
    var choosedCheckBoxValue = [];
    for (let i = 0; i < allCheckBox.length; i++) {
        if (allCheckBox[i].checked) {
            choosedCheckBoxValue[i] = allCheckBox[i].value;
        }
    }
    if (choosedCheckBoxValue.length > 0) {
        console.log(`postion ${choosedCheckBoxValue}`);
    }

}
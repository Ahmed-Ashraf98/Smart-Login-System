// * ======================== Get Elements =======================

var userName = document.getElementById("userName");
var userEmail = document.getElementById("userEmail");
var userPassword = document.getElementById("userPassword");

var signUpBtn = document.getElementById("signUpBtn");
var loginBtn = document.getElementById("loginBtn");


var lightBox = document.getElementById("lightBox");
var lightBoxItem = document.getElementById("lightBoxItem");
var lightBoxItemMessage = document.getElementById("lightBoxItemMessage");
var lightBoxItemHeader = document.getElementById("lightBoxItemHeader");

// * ======================= Initiate Settings Vars ==================

var usersKey = "users";
var LoggedInUserKey = "currentUser";
var currentLoggedInUser;
var formInputs = [userName, userEmail, userPassword];
var usersList = [];
var inputsRegex = {

    userName: {
        pattern: /^[A-Za-z0-9_-][\w\-\s]{2,15}$/,
        status: false,
    },

    userEmail: {
        pattern: /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/,
        status: false,
    },

    userPassword: {
        pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
        status: false,
    }
}

// * ============================ [ Start Section ] ===================================

if (localStorage.getItem(usersKey)) {
    // get all users from the local storage and add the data in the list
    usersList = getUsers();
}

if (localStorage.getItem(LoggedInUserKey)) {
    // get logged in user
    currentLoggedInUser = getLoggedInUser();
}


/* 
- If user is already logged in, then navigate automatically to the home page
- This condition prevents the logged-in user to access the login / signup pages without click on logout button 
*/ 

if( (window.location.pathname == "/"  || window.location.pathname == "/pages/signup.html" ) && currentLoggedInUser){
    alert("You are already logged-in, to sign-out click on sign out in the home page")
    goToHome();
}

//* =============================== [ Navigation ] ============================

function goToLogin(){
    var originUrl = window.location.origin;
    var newPath = "/";
    window.location.replace(originUrl+newPath);
}

function goToHome(){
    var originUrl = window.location.origin;
    var newPath = "/pages/home.html";
    window.location.replace(originUrl+newPath);
}

//* ============================== [ Control Form ] ======================

function isEmpty(element){
   // This function is to check if the filed is empty or not 
   return element.value == "";
}

function setInputValidaty(element,feedbackEle,newStatus,classToRmv,classToAdd,msg){
    // This function is used to :
    // - Update the input field status
    // - Mark the input as valid / in-valid
    // - Add messages in the feedback element
    inputsRegex[element.id].status = newStatus;
    classToRmv && element.classList.remove(classToRmv);
    classToAdd && element.classList.add(classToAdd);
    feedbackEle.innerHTML = msg;
}

function formIsSignUp(){
    // This function is used to check if the current form is signup or login
    // We used userEmail, because it's exits in both forms
    // With [data-form-type] custom attribute in the input field, we can check if the current form is signup or login
    if(userEmail.getAttribute("data-form-type") == "signup"){
       return true;
    }
    return false;
}

function validateInput(element) {
    var eleVal = element.value;
    // Get the feedback element, the div of feedback is next element of label
    // element.nextElementSibling => label element
    // element.nextElementSibling.nextElementSibling => div with class feedback
    var feedbackElement = element.nextElementSibling.nextElementSibling;

    // Check if the current form is login or signup
    var isSignUp = formIsSignUp();

    //& Notes for Login Page Validation:
    // - In the login page we don't need to check the input pattern
    // - In the login page we need to check if the input is empty or not
    // - Once it's not empty then in the Login Function we will check if the email exist and password is correct

    //& Notes for Sign-Up Page Validation:
    // - In the sign-up page we need to check the input pattern
    // - In the sign-up page we need to check if the input is empty or not

    if(isEmpty(element)){ // If empty, mark the field as required
      setInputValidaty(element,feedbackElement,false,null,"is-invalid","Field is required");
    }else{ 
        setInputValidaty(element,feedbackElement,true,"is-invalid",null,null);
    }
    
    if(isSignUp){ // In case the form noe is Signup, then do the following check
        
        // If empty, mark the field as required
        if(isEmpty(element)){ 
            setInputValidaty(element,feedbackElement,false,"is-valid","is-invalid","Field is required");
        }
        
        // If input value matched patern
        else if (inputsRegex[element.id].pattern.test(eleVal)) { 
        
            // Check if the current element is email, if yes add additional check to see if the email is already used or not
            if (element.id == "userEmail" && emailExists(eleVal) != undefined) {
                setInputValidaty(element,feedbackElement,false,"is-valid","is-invalid","Account is already available for this email address");
            } else {
                setInputValidaty(element,feedbackElement,true,"is-invalid","is-valid",null);
            }
    
        } else { // if input is valid, then remove the error message and mark it as valid
            var msg;
            switch (element.id) {
                case "userName": msg = "Inavlid User Name";
                    break;
                case "userEmail": msg = "Inavlid Email";
                    break;
                case "userPassword": msg = "Inavlid Password";
                    break;
            }
            setInputValidaty(element,feedbackElement,false,"is-valid","is-invalid",msg);
        }
    }

   
}

function validateAllInputs() {
    var isSignUp = formIsSignUp();
    // if not signup don't check name input [start from index 1 will skip input name]
    // Without doing this check, we will get an error becasue name field doesn't exists in the lgin page, so you trying to apply things on undefined
    var startIndex = isSignUp ? 0 : 1; 
    for (let i = startIndex; i < formInputs.length; i++) {
        validateInput(formInputs[i]);
    }
}

function allInputsAreValid() {
    // This function to check all inputs status if all are valid then return true otherwise false
    var isSignUp = formIsSignUp();
    // if not signup don't check name input status
    return isSignUp ?
        inputsRegex.userName.status && inputsRegex.userEmail.status && inputsRegex.userPassword.status
        : inputsRegex.userEmail.status && inputsRegex.userPassword.status;
}

function emailExists(email) {
    // This function is used in both [ Login / Signup] pages
    // return the index of the user if the email is exists, otherwise return undefined
    var index;
    for (let i = 0; i < usersList.length; i++) {
        if (usersList[i].email.toLocaleLowerCase() == email.toLocaleLowerCase()) {
            index = i;
        }
    }

    return index;
}

function passIsMatched(index,password) {
    // This function is mainly used in the login page, this to check if provided password in the input field matched the the user password in the DB
    return usersList[index].password == password ? true : false;
}

function resetValidation() {

    // This function is used to reset the [] input status, validation, error messages ]
    
    var isSignUp = formIsSignUp();
    inputsRegex.userName.status = false;
    inputsRegex.userEmail.status = false;
    inputsRegex.userPassword.status = false;

    // if not signup don't reset name input field
    // if not signup don't reset name input [start from index 1 will skip input name]
    // Without doing this check, we will get an error becasue name field doesn't exists in the lgin page, so you trying to apply things on undefined
    var stratVal = isSignUp ? 0 : 1; 

    for (var i = stratVal; i < formInputs.length; i++) {
        var element = formInputs[i];
        element.classList.remove("is-invalid");
        element.classList.remove("is-valid");
        var feedbackElement = element.nextElementSibling.nextElementSibling;
        feedbackElement.innerHTML = null;
    }


}

function clear() {
    // This function to clear the inputs after successful signup / login

    // if not signup don't clear name input field
    // Without doing this check, we will get an error becasue name field doesn't exists in the lgin page, so you trying to apply things on undefined

    var isSignUp = formIsSignUp();
    userEmail.value = null;
    userPassword.value = null;
    if (isSignUp) userName.value = null;

    // call reset validation to reset the fields status 
    resetValidation();
}


// * ================= [ Custom Modal ] =======================

function wrongPopupMsg(title,msg) {
    // This function take title and message of the error pop-up and add these data in our custom pop-up
    lightBoxItemHeader.classList.remove("bg-success", "justify-content-center");
    lightBoxItemHeader.classList.add("bg-danger", "justify-content-end");
    lightBoxItemHeader.innerHTML = `
    <i id="closeBoxBtn" onclick="closePopupMsg()" class="fa-regular fa-circle-xmark m-2 fs-5 text-white"></i>           
    `;
    lightBoxItemMessage.innerHTML = `<h3 class="mt-5">${title}</h3><p class="fs-5">${msg}</p>`;
}

function successPopupMsg(title,msg) {
    // This function take title and message of the success pop-up and add these data in our custom pop-up
    lightBoxItemHeader.classList.add("bg-success", "justify-content-center");
    lightBoxItemHeader.classList.remove("bg-danger", "justify-content-end");
    lightBoxItemHeader.innerHTML = `<i class="fa-solid fa-circle-check fs-1 text-white p-3"></i>`;
    lightBoxItemMessage.innerHTML = `<h3 class="mt-5">${title}</h3><p class="fs-5">${msg}</p>`;
}


function openPopupMsg() {
    // this method to trigger the pop-up
    lightBox.classList.replace("d-none", "d-flex");
}

function closePopupMsg() {
    // this method to close the pop-up
    lightBox.classList.replace("d-flex", "d-none");
}

//* ===================== [ SignUp Page ] ==============================

function createUser() {

    var msgTitle;
    var message;

    // Validate pattern for all inputs as final check
    validateAllInputs();

    
    var emailIsUsed = emailExists(userEmail.value);
    // Throw error if email already exists
    if(emailIsUsed != undefined){
        msgTitle =`<span class="text-danger">Can't </span>Create Account`;
        message = "An account is already available for this email address..., kindly provide another email account and try again";
        wrongPopupMsg(msgTitle,message);
        openPopupMsg();
        return;
    }

    // Throw error if inputs are not valid
    if (!allInputsAreValid()) {

        msgTitle = `<span class="text-danger">Can't </span>Create Account`;
        message = `
        <p>Kindly check the following rules to create an account</p>
        <ul class="list-unstyled d-flex flex-column align-items-start">
          <li class="ps-sm-2 mb-2"><i class="fa-regular fa-circle-right text-danger"></i> User Name must contain at least 3 characters and NO special character</li>
          <li class="ps-sm-2 mb-2"><i class="fa-regular fa-circle-right text-danger"></i> User Email must be a valid email</li>
          <li class="ps-sm-2"><i class="fa-regular fa-circle-right text-danger"></i> User Password must have:
            <ul class="mt-1">
              <li>Minimum eight characters</li>
              <li>At least one upper case English letter</li>
              <li>One lower case English letter</li>
              <li>One number and one special character</li>
            </ul>
          </li>
        </ul>`;

        // Display Pop-up
        wrongPopupMsg(msgTitle,message);
        openPopupMsg();
        return;
    }


    // Start create the user 

    var user = {
        id: usersList.length,
        name: userName.value,
        email: userEmail.value,
        password: userPassword.value
    };

    usersList.push(user); // add the user into the list
    clear(); // clear form inputs
    setUsers(usersList); // add the user in the local storage


    msgTitle =`<span class="text-success">Congratulations!</span> your account has been created`;
    message=`We will redirect you to the login page automatically after 3 seconds`;
    successPopupMsg(msgTitle,message); // set ssignup successful message
    openPopupMsg(); // Dispaly the popup

    // Automatically redirct the user to the login page after 3s
    setTimeout(function(){ 
       goToLogin();
    }, 3000);
}



//* ===================== [ Login Page ] ==============================

function loginUser() {
    // Verify if user exists and the credintial is correct
    // Otherwise raise error, this error should be shown after clicking on login button
    
    // Validate if all inputs are not empty
    validateAllInputs();

    // If one of the fields is empty, then throw an error
    if(!allInputsAreValid()){
        wrongPopupMsg(`<span class="text-danger">Can't </span>Login`,"All Fields Are Required");
        openPopupMsg();
        return;
    }

    // If all fields are filled,then check if the email is in the storage or not
    var userIndex = emailExists(userEmail.value);

    // if there is no user with this email, then throw an error
    if(userIndex == undefined){
        wrongPopupMsg(`<span class="text-danger">Can't </span>Login`,"User email doesn't exists");
        openPopupMsg();
        return;
    }

    // if there is a user with this email, then check the password
    var passIsCorrect = passIsMatched(userIndex,userPassword.value)

    // if the provided password not matched the password in the storage, then throw an error
    if(!passIsCorrect){
        wrongPopupMsg(`<span class="text-danger">Can't </span>Login`,"The password for this account is not correct , please try again");
        openPopupMsg();
        return;
    }

    /*
    - If email is correct and the password as well, then go to home page
    */

    var userObj = usersList[userIndex]; // get the user details
    setLoggedInUser(userObj); // set the current logged-in user 
    clear(); // clear the form after successful login

    goToHome(); // navigate to home page automatically 
}


//* ================= [ Local Storage ] ======================

function setUsers(list) {
    localStorage.setItem(usersKey, JSON.stringify(list));
}

function getUsers() {
    var users = localStorage.getItem(usersKey);
    return JSON.parse(users)
}

function setLoggedInUser(user) {
    localStorage.setItem(LoggedInUserKey, JSON.stringify(user));
}

function getLoggedInUser() {
    var user = localStorage.getItem(LoggedInUserKey);
    return JSON.parse(user)
}

//* ================= [ Events Settings ] ======================

//& Notes:
/* 
 - We used < ? > because the elements will not be exists in all pages and without < ? >,
 the console will throw an error because you are trying to add event for undefined.

 -We used input event in case the user try copy-and-paste, and tor trck the changes

*/

userName?.addEventListener("keydown", function (event) {
    validateInput(event.target);
})

userName?.addEventListener("input", function (event) {
    validateInput(event.target);
})

userEmail?.addEventListener("keydown", function (event) {
    validateInput(event.target);
})

userEmail?.addEventListener("input", function (event) {
    validateInput(event.target);
})

userPassword?.addEventListener("keydown", function (event) {
    validateInput(event.target);
})

userPassword?.addEventListener("input", function (event) {
    validateInput(event.target);
})

signUpBtn?.addEventListener("click", createUser);

loginBtn?.addEventListener("click",loginUser);

lightBoxItem?.addEventListener("click", function (event) {
    event.stopPropagation();
});

lightBox?.addEventListener("click", closePopupMsg);
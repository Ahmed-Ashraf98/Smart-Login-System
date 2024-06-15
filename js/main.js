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
    usersList = getUsers();
}

if (localStorage.getItem(LoggedInUserKey)) {
    currentLoggedInUser = getLoggedInUser();
}

// console.log(window.location)

if( (window.location.pathname == "/"  || window.location.pathname == "/pages/signup.html" ) && currentLoggedInUser){
    alert("You already logged in, going to home, to sign-out click on sign ou in the home page")
    window.location.pathname = "/pages/home.html";
}

//* ============================== [ Control Form ] ======================

function isEmpty(element){
   return element.value == "";
}

function setInputValidaty(element,feedbackEle,newStatus,classToRmv,classToAdd,msg){
    inputsRegex[element.id].status = newStatus;
    classToRmv && element.classList.remove(classToRmv);
    classToAdd && element.classList.add(classToAdd);
    feedbackEle.innerHTML = msg;
}

function validateInput(element) {
    var eleVal = element.value;
    // get the div of feedback, the div of feedback is next element of label
    var feedbackElement = element.nextElementSibling.nextElementSibling;
    var isSignUp = formIsSignUp();

    //& Notes for Login Page Validation:
    // - In the login page we don't need to check the input pattern
    // - In the login page we need to check if the input is empty or not
    // - Once it's not empty then in the Login Function we will check if the email exist and password is correct

    //& Notes for Sign-Up Page Validation:
    // - In the sign-up page we need to check the input pattern
    // - In the sign-up page we need to check if the input is empty or not

    if(isEmpty(element)){
      setInputValidaty(element,feedbackElement,false,null,"is-invalid","Field is required");
    }else{
        setInputValidaty(element,feedbackElement,true,"is-invalid",null,null);
    }
    
    if(isSignUp){

        if(isEmpty(element)){
            setInputValidaty(element,feedbackElement,false,"is-valid","is-invalid","Field is required");
        }

        else if (inputsRegex[element.id].pattern.test(eleVal)) {
        
            if (element.id == "userEmail" && emailExists(eleVal) != undefined) {
                setInputValidaty(element,feedbackElement,false,"is-valid","is-invalid","Account is already available for this email address");
            } else {
                setInputValidaty(element,feedbackElement,true,"is-invalid","is-valid",null);
            }
    
        } else {
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
    var startIndex = isSignUp ? 0 : 1; // if not signup don't check name input
    for (let i = startIndex; i < formInputs.length; i++) {
        validateInput(formInputs[i]);
    }
}

function formIsSignUp(){
    if(userEmail.getAttribute("data-form-type") == "signup"){
       return true;
    }
    return false;
}

function allInputsAreValid() {
    
    var isSignUp = formIsSignUp();
    return isSignUp ?
        inputsRegex.userName.status && inputsRegex.userEmail.status && inputsRegex.userPassword.status
        : inputsRegex.userEmail.status && inputsRegex.userPassword.status;
}

function emailExists(email) {
    // return the index of the user if the email is exists , otherwise return undefined
    var index;
    for (let i = 0; i < usersList.length; i++) {
        if (usersList[i].email.toLocaleLowerCase() == email.toLocaleLowerCase()) {
            index = i;
        }
    }

    return index;
}

function passIsMatched(index,password) {
    return usersList[index].password == password ? true : false;
}

function resetValidation() {
    var isSignUp = formIsSignUp();
    inputsRegex.userName.status = false;
    inputsRegex.userEmail.status = false;
    inputsRegex.userPassword.status = false;

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
    var isSignUp = formIsSignUp();
    userEmail.value = null;
    userPassword.value = null;
    if (isSignUp) userName.value = null;
    resetValidation();
}

function wrongInputMsg(title,msg) {

    lightBoxItemHeader.classList.remove("bg-success", "justify-content-center");
    lightBoxItemHeader.classList.add("bg-danger", "justify-content-end");
    lightBoxItemHeader.innerHTML = `
    <i id="closeBoxBtn" onclick="closePopupMsg()" class="fa-regular fa-circle-xmark m-2 fs-4 text-white"></i>           
    `;
    lightBoxItemMessage.innerHTML = `<h3 class="mt-5">${title}</h3>
    <p>${msg}</p>`
}

function successMsg(title,msg) {

    lightBoxItemHeader.classList.add("bg-success", "justify-content-center");
    lightBoxItemHeader.classList.remove("bg-danger", "justify-content-end");
    lightBoxItemHeader.innerHTML = `<i class="fa-solid fa-circle-check fs-1 text-white p-3"></i>`;
    lightBoxItemMessage.innerHTML = `<h3 class="mt-5"><span class="text-success">Congratulations!</span> your account has been created</h3>
            <p>We will redirect you to the login page automatically after 3 seconds</p>`;
}

// * ================= [ Custom Modal ] =======================

function openPopupMsg() {
    lightBox.classList.replace("d-none", "d-flex");
}

function closePopupMsg() {
    lightBox.classList.replace("d-flex", "d-none");
}

//* ===================== [ SignUp Page ] ==============================

function createUser() {


    // Validate pattern for all inputs
    validateAllInputs();

    // Throw error if inputs are not valid OR email already exists
    var emailIsUsed = emailExists(userEmail.value);

    if(emailIsUsed != undefined){
        var title =`<span class="text-danger">Can't </span>Create Account`;
        var message = "An account is already available for this email address..., kindly provide another email account and try again";
        wrongInputMsg(title,message);
        openPopupMsg();
        return;
    }

    if (!allInputsAreValid()) {

        var title = `<span class="text-danger">Can't </span>Create Account`;

        var message = `
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
        wrongInputMsg(title,message);
        openPopupMsg();
        return;
    }

    

    // Start create 

    var user = {
        id: usersList.length,
        name: userName.value,
        email: userEmail.value,
        password: userPassword.value
    };

    usersList.push(user);
    clear();
    setUsers(usersList);
    successMsg();
    openPopupMsg();

    setTimeout(function(){
        window.location.pathname = "/";
    }, 3000);
}



//* ===================== [ Login Page ] ==============================

function loginUser() {
    // Verify if user exists and the credintial is correct
    // Otherwise raise error, this error should be shown after clicking on login button
    
    // Validate if all inputs not empty
    validateAllInputs();

    // TODO: make the user mandatory to enter the required fields
    console.log(inputsRegex)
    if(!allInputsAreValid()){
        wrongInputMsg(`<span class="text-danger">Can't </span>Login`,"All Fields Are Required");
        openPopupMsg();
        return;
    }

    /*
    - If email is correct and the password as well, then go to home page
    */



    var userIndex = emailExists(userEmail.value);

    if(userIndex == undefined){
        wrongInputMsg(`<span class="text-danger">Can't </span>Login`,"User email doesn't exists");
        openPopupMsg();
        return;
    }

    var passIsCorrect = passIsMatched(userIndex,userPassword.value)
    if(!passIsCorrect){
        wrongInputMsg(`<span class="text-danger">Can't </span>Login`,"The password for this account is not correct , please try again");
        openPopupMsg();
        return;
    }

    var userObj = usersList[userIndex];
    
    // Todo:
    // 1- Get the user obj fro DB 
    // 2- Add the user Obj in the login storage
    // 3- Clear the form
    // 4- Go to home page directly

    setLoggedInUser(userObj);
    clear();
    window.location.pathname = "/pages/home.html";
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
//* ========================= Get Elements ============================

var userData = document.getElementById("userData");
var loguotBtn = document.getElementById("loguotBtn");

//* ================== [ Setup vars ] ============================

var LoggedInUserKey = "currentUser";

//* ================= [ Start Section ] ============================

// This condition to check if the user try to access the home page without loggin
// If the user not logged-in, display an alert, and send him to the login page once click on ok button on the alert 

if(!localStorage.getItem(LoggedInUserKey)){
    alert("You need to logged in first to be able to see home page , you will be redirected to login page once you click ok")
    goToLogin();
}

//* ================= [ Navigation ] ============================

function goToLogin(){
    var originUrl = window.location.origin;
    var newPath = "/";
    window.location.replace(originUrl+newPath);
}

//* ================= [ Display User Data ] ============================

// if the user is logged-in then, display the his data automatically in the home page

(function (){
    userObj = getLoggedInUser();
    userData.innerHTML = `
        <h1>Hello ${userObj.name} <i class="fa-solid fa-face-smile"></i></h1>
        <p class="h4 mt-5">Yor email is : ${userObj.email} </p>
    `;
})()

//* ================= [ Logout ] ============================

function logoutUser(){
    // This function for logout the user, this will be called once the user click on logout button
    removeLoggedInUser();
    // Go to login page after loggout automatically   
    goToLogin();
}

//* ================= [ Local Storage ] ======================

function getLoggedInUser() {
    var user = localStorage.getItem(LoggedInUserKey);
    return JSON.parse(user)
}

function removeLoggedInUser(){
    // Remove the user from the logged-In storage
    localStorage.removeItem(LoggedInUserKey);
}

//* ================= [ Events Settings ] ======================

loguotBtn?.addEventListener("click",logoutUser)
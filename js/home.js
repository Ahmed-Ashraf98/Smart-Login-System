//* ========================= Get Elements ============================

var userData = document.getElementById("userData");
var loguotBtn = document.getElementById("loguotBtn");

//* ================== [ Setup vars ] ============================

var LoggedInUserKey = "currentUser";

//* ================= [ Start Section ] ============================

if(!localStorage.getItem(LoggedInUserKey)){
    alert("You need to logged in first to be able to see home page , you will be redirected to login page once you click ok")
    window.location.pathname = "/";
}

//* ================= [ Display User Data ] ============================

(function (){
    userObj = getLoggedInUser();
    userData.innerHTML = `
        <h1>Hello ${userObj.name} <i class="fa-solid fa-face-smile"></i></h1>
        <p class="h4">Yor email is : ${userObj.email} </p>
    `;
})()

//* ================= [ Logout ] ============================

function logoutUser(){
    removeLoggedInUser();
    // go to login page    
    window.location.pathname = "/";
}

//* ================= [ Local Storage ] ======================

function getLoggedInUser() {
    var user = localStorage.getItem(LoggedInUserKey);
    return JSON.parse(user)
}

function removeLoggedInUser(){
    localStorage.removeItem(LoggedInUserKey);
}

//* ================= [ Events Settings ] ======================

loguotBtn?.addEventListener("click",logoutUser)
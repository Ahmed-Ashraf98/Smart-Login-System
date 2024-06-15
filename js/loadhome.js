
//* ================== [ Setup vars ] ============================

var LoggedInUserKey = "currentUser";

//* ================= [ Start Section ] ============================


//& >>>>>>>>>>>>>>>>>>>>>>>        Important NOTES [ About Navigation ]    <<<<<<<<<<<<<<<<<<<<<<<< : 
/*
- In case the application run on local machien, then the path name of window location will << NOT >> include the repo name
- In case the application run on local machien, then the path name of window location will include the repo name
*/

// This condition to check if the user try to access the home page without loggin
// If the user not logged-in, display an alert, and send him to the login page once click on ok button on the alert 

if(!localStorage.getItem(LoggedInUserKey)){
    alert("You need to logged in first to be able to see home page , you will be redirected to login page once you click ok")
    goToLogin();
}

//* ================= [ Navigation ] ============================

function goToLogin(){
    var originUrl = window.location.origin;
    var runOnCloud = window.location.port == "" ? true : false;
    var newPath = runOnCloud ? "/Smart-Login-System/"  : "/";
    window.location.replace(originUrl+newPath);
}

//* ================= [ Local Storage ] ======================

function getLoggedInUser() {
    var user = localStorage.getItem(LoggedInUserKey);
    return JSON.parse(user)
}

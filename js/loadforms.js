//* ================== [ Setup vars ] ============================

var LoggedInUserKey = "currentUser";
var currentLoggedInUser;
// * ============================ [ Start Section ] ===================================

if (localStorage.getItem(LoggedInUserKey)) {
    // get logged in user
    currentLoggedInUser = getLoggedInUser();
}


//& >>>>>>>>>>>>>>>>>>>>>>>        Important NOTES [ About Navigation ]    <<<<<<<<<<<<<<<<<<<<<<<< : 
/*
- In case the application run on local machien, then the path name of window location will << NOT >> include the repo name
- In case the application run on local machien, then the path name of window location will include the repo name
*/

/* 
- If user is already logged in, then navigate automatically to the home page
- This condition prevents the logged-in user to access the login / signup pages without click on logout button 
*/

if( 
    (window.location.pathname == "/Smart-Login-System/" ||
     window.location.pathname == "/" ||
     window.location.pathname == "/Smart-Login-System/index.html" ||
     window.location.pathname == "/index.html" ||
     window.location.pathname == "/Smart-Login-System/pages/signup.html"|| 
     window.location.pathname == "/pages/signup.html"
    )
    && currentLoggedInUser)
    {
        
    alert("You are already logged-in, to sign-out click on sign out in the home page")
    goToHome();
}


//* =============================== [ Navigation ] ============================

function goToLogin(){
    var originUrl = window.location.origin;
    var runOnCloud = window.location.port == "" ? true : false;
    var newPath = runOnCloud ? "/Smart-Login-System/"  : "/";
    window.location.replace(originUrl+newPath);
}

function goToHome(){
    var originUrl = window.location.origin;
    var runOnCloud = window.location.port == "" ? true : false;
    var newPath = runOnCloud ? "/Smart-Login-System/pages/home.html"  : "/pages/home.html";
    window.location.replace(originUrl+newPath);
}


//* ================= [ Local Storage ] ======================

function getLoggedInUser() {
    var user = localStorage.getItem(LoggedInUserKey);
    return JSON.parse(user)
}

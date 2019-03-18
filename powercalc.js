$(document).ready(function () {
    $("#go").click(function() {
    console.log("clicky");
    var base = $("#url").val() !== undefined ? $("#url").val() : "https://pschool.aaps.k12.mi.us/";
    var username = $("#username").val();
    var password = $("#password").val();
    console.log(base, username, password)
    try {
        getStudentData(base, username, password);
    catch (err) {
        console.log(err);
    }
})
})
function getStudentData(url, username, password) {
    
}

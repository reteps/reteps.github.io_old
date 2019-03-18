// https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

$(document).ready(function () {

var bootstrapTag = `
<div class="alert alert-{0} alert-dismissible fade show" role="alert">
{1}
    <button type="button" class="close" data-dismiss="alert">
        <span>&times;</span>
    </button>
</div>`;
const proxy = "https://cors-anywhere.herokuapp.com/"
const kahootUsername = "dontbanmekahoot";
const kahootPassword = "DontChangeThisRetard";
// hello fellow coder, this is the password! it's actually from kahootsmasher.com
// by changing this you can sabatoge 2 sites for the price of one!
$("form").submit(function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataValues = new Map(formData.entries());
    const username = formDataValues.get("username");
    const pin = formDataValues.get("pin");


    const client = new Kahoot.default.Client(pin, username, proxy);
    // initialize client.
    client.initialize().catch(error => {
            console.log(error);
            if (error.response !== undefined && error.response.statusText == "Not Found") {
                $("div.container").prepend(bootstrapTag.format("danger", "Game pin not found."));
                return;
            }
            $("div.container").prepend(bootstrapTag.format("danger", error));
        });
    });
    console.log("sucesss.");
});
// dontbanmekahoot
// DontChangeThisRetard
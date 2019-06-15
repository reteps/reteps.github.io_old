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

$(document).ready(() => {
    console.log("ready");
    var bootstrapTag = `
<div class="alert alert-{0} alert-dismissible fade show" role="alert">{1}
    <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
</div>`;
    const proxy = "https://cors-anywhere.herokuapp.com/"
    const kahootUsername = "dontbanmekahoot";
    const kahootPassword = "DontChangeThisRetard";
    let automatic = false;
    function formSubmitted(form) {
        // Parse Form and Handle client
        form.preventDefault();
        const formData = new FormData(form.target);
        const formDataValues = new Map(formData.entries());
        const username = formDataValues.get("username");
        const pin = formDataValues.get("pin");
        const helper = new Kahoot.default.Helpers
        const client = new Kahoot.default.Client(pin, username, proxy);
        const info = new Kahoot.default.Information();
        let quizAnswers = null;

        client.initialize().catch(error => {
            console.log(error);
            if (error.response !== undefined && error.response.statusText == "Not Found") {
                $("div.container").prepend(bootstrapTag.format("danger", "Game pin not found."));
                return;
            }
            $("div.container").prepend(bootstrapTag.format("danger", error));
        }).then(() => {
            $("div.container").prepend(bootstrapTag.format("success", "Client Created"));

            // Connect to Game
            if (client.twoFactor) {
                client.bruteForceTwoFactor();
            }
            client.doLogin();
            $("div.container").prepend(bootstrapTag.format("success", "User Connected"));

            // Authenticate to create.kahoot.it
            info.authenticate(kahootUsername, kahootPassword).catch((error) => {
                console.log(error);
                $("div.container").prepend(bootstrapTag.format("danger", error));
                return;
            }).then(() => {
                $("div.container").prepend(bootstrapTag.format("success", "Authenticated to Kahoot."));
            })

            $("div.login").hide();
            $("div.game").show();

            // Grab Quiz Name when game is started
            client.onMessageType(client.eventTypes.startQuiz).catch(error => {
                console.log(error);
                $("div.container").prepend(bootstrapTag.format("danger", error));
                return;
            }).then(json => {
                $("div.container").prepend(bootstrapTag.format("success", "Quiz Found."));
                return client.search(json.quizName), json.quizName;
            }).catch(e => {
                console.log(error);
                $("div.container").prepend(bootstrapTag.format("danger", error));
            }).then((results, quizName) => {
                results.each((_, result) => {
                    if (result.title == quizName) {
                        return result;
                    }
                })
            }).then(quiz => {
                let answerDict = {};
                quiz.questions.each((i, question) => {
                    question.choices.each((j, choice) => {
                        if (choice.correct) {
                            answerDict[i] = j;
                            return false;
                        }
                    })
                })
                quizAnswers = answerDict;
                $("div.container").prepend(bootstrapTag.format("success", "Answers Found!"));
                $("#auto").removeClass("disabled");
            })

            client.onMessageType(client.eventTypes.questionReceived).then(answers => {
                if (automatic && quizAnswers != null) {
                    const qNum = client.questionNum;
                    const choice = answers[qNum];
                    client.sendGameAnswer(choice);
                    $("div.container").prepend(bootstrapTag.format("success", `Sent ${choice} for ${qNum}`));
                }
            })
        })
        $('#auto').on("click", (event) => {
            automatic = event.currentTarget.checked;
            $(".manual > button").each((_, element) => {
                element.disabled = automatic;
            })
        });
        $(".manual > button").on("click", (event) => {
            console.log(event);
            const choice = event.currentTarget.id;
            client.sendGameAnswer(event.currentTarget.id);
            $("div.container").prepend(bootstrapTag.format("success", `Sent ${choice} for ${client.questionNum}`));
        })
    };
    $("form").submit(formSubmitted);
});
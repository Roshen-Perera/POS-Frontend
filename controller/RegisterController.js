$('#reg-btn').click(function(e) {
    e.preventDefault();
    var username = $('#reg-custom-user').val();
    var emailAddress = $('#reg-custom-email').val();
    var password = $('#reg-custom-pw').val();

    if (username === "" && emailAddress === "" && password === "") {
        alert("Please enter Details");
        console.log("Empty fields detected");
        return false;
    }

    let user = {
        name: username,
        email: emailAddress,
        password: password
    }

    const userJSON = JSON.stringify(user)
    console.log(userJSON);
    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/register",
        type: "POST",
        data : userJSON,
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            console.log(JSON.stringify(res));
            alert("User added successfully")
        },
        error: (res) => {
            console.error(res);
            alert("User not added successfully")
        }
    });
});
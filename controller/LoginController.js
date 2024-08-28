$('#login-btn').click(function(e) {
    e.preventDefault();

    var loginUsername = $('#login-custom-user').val();
    var loginPassword = $('#login-custom-pw').val();

    console.log("Username:", loginUsername);
    console.log("Password:", loginPassword);

    if ($('#login-custom-user').val() === "" && $('#login-custom-pw').val() === "") {
        alert("Please enter username and password");
        console.log("Empty fields detected");
        return false;
    }

    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/login?name="+loginUsername+"&password="+loginPassword,
        type: "POST",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            console.log(JSON.stringify(res));
            alert('Login successful');
            $("#navigation").css({ display: "block" });
            $("#login-page").css({ display: "none" });
            $("#register-page").css({ display: "none" });
            $("#dashboard-page").css({ display: "block" });
            $("#customer-page").css({ display: "none" });
            $("#product-page").css({ display: "none" });
            $("#order-page").css({ display: "none" });
            $("#neworder-page").css({ display: "none" });
        },
        error: (res) => {
            console.error(res);
            alert('Invalid username or password');
        }
    });
});

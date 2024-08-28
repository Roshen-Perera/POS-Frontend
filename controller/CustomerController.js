import CustomerModel from "/model/CustomerModel.js"
import {customers, products} from "/db/DB.js";

var recordIndex = undefined;

loadTableCustomer();

$("#customerIdCheck").hide();
let isError = true;

$("#customerUserCheck").hide();
let usernameError = true;

$("#customerAddressCheck").hide();
let addressError = true;

$("#customerMobileCheck").hide();
let mobileError = true;

function validateID(){
    if ($('#cus-custom-id').val() === "") {
        $("#cus-custom-id").css({"border-color": "red"});
        $("#idCheck").show();
        isError = false;
        return false;
    } else {
        $("#cus-custom-id").css({"border-color": "#32008E"});
        $("#idCheck").hide();
        isError = true;
    }
}

function validateName(){
    var isValidCustomerName = new RegExp("\\b[A-Z][a-z]*( [A-Z][a-z]*)*\\b");
    if ($('#cus-custom-user').val() === "") {
        $("#cus-custom-user").css({"border-color": "red"});
        $("#userCheck").show()
        alert("Customer Name Missing");
        return false;
    } else if (!isValidCustomerName.test($('#cus-custom-user').val())) {
        $("#cus-custom-user").css({"border-color": "red"});
        alert("Customer Name Invalid");
        usernameError = false;
        return false;
    } else {
        $("#cus-custom-user").css({"border-color": "#32008E"});
        $("#userCheck").hide();
        usernameError = true;
    }
}

function validateAddress(){
    var isValidCustomerAddress = new RegExp("^[A-Za-z0-9'\\/\\.,\\s]{5,}$");
    if ($("#cus-custom-address").val() === "") {
        $("#cus-custom-address").css({"border-color": "red"});
        alert("Customer Address Missing");
        addressError = false;
        return false;
    } else if (!isValidCustomerAddress.test($("#cus-custom-address").val())) {
        $("#cus-custom-address").css({"border-color": "red"});
        alert("Customer Address Invalid");
        addressError = false;
        return false;
    } else {
        $("#cus-custom-address").css({"border-color": "#32008E"});
        $("#addressCheck").hide();
        addressError = true;
    }
}

function validateMobile(){
    var isValidPhoneNumber = new RegExp("^(?:0|94|\\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\\d)\\d{6}$");
    if ($("#cus-custom-mobile").val() === "") {
        $("#cus-custom-mobile").css({"border-color": "red"});
        alert("Customer Mobile Missing");
        mobileError = false;
        return false;
    } else if (!isValidPhoneNumber.test($("#cus-custom-mobile").val())) {
        $("#cus-custom-mobile").css({"border-color": "red"});
        alert("Customer Mobile Invalid");
        mobileError = false;
        return false;
    } else {
        $("#cus-custom-mobile").css({"border-color": "#32008E"});
        $("#mobileCheck").hide();
        mobileError = true;
    }
}

/*
$("#cus-custom-user").keyup(function () {
    validateName();
});
$("#cus-custom-address").keyup(function () {
    validateAddress();
});
$("#cus-custom-mobile").keyup(function () {
    validateMobile();
})

*/

export function loadTableCustomer() {
    $('#customer-table').empty();
    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/customer",
        method: "GET",
        success: function (results) {
            $('#customer-table').empty();
            results.forEach(function (post) {
                var record = `<tr>
                                <td>${post.id}</td>     
                                <td>${post.name}</td>
                                <td>${post.address}</td>     
                                <td>${post.phone}</td>
                            </tr>`;
                $('#customer-table').append(record);
            });
        },
        error: function (error) {
            console.log(error);
            alert("An error occurred while fetching the posts.");
        }
    });
}

$('#btnSearchCustomer').on('click', () => {
    let cusId = $('#cus-custom-id').val();
    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/customer?id="+cusId,
        type: "GET",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            console.log(JSON.stringify(res));
            $('#cus-custom-user').val(res.name);
            $('#cus-custom-address').val(res.address);
            $('#cus-custom-mobile').val(res.phone);
        },
        error: (res) => {
            console.error(res);
        }
    });
    console.log('Selected product ID:', cusId);
    // Find the selected product object
    // const selectedProduct = customers.find(customer => customer.cusId === cusId);
    // console.log('Selected product:', selectedProduct);
});

$('#customer-add-btn').on('click', () => {
    validateID();
    validateName();
    validateAddress();
    validateMobile();
    if (isError === true && usernameError === true && addressError === true && mobileError === true) {
        console.log(isError);
        console.log(usernameError);
        console.log(addressError);
        console.log(mobileError);
        let customerId = $('#cus-custom-id').val();
        let customerName = $('#cus-custom-user').val();
        let customerAddress = $('#cus-custom-address').val();
        let customerMobile = $('#cus-custom-mobile').val();

        // var record = `<tr>
        //                     <td class="cus_id" scope="row">${customerId}</td>
        //                     <td class="cus_name">${customerName}</td>
        //                     <td class="cus_address">${customerAddress}</td>
        //                     <td class="cus_mobile">${customerMobile}</td>
        //                 </tr>`
        // $('#customer-table').append(record);
        //
        // let customer = new CustomerModel(customerId, customerName, customerAddress, customerMobile);

        let customer = {
            id: customerId,
            name: customerName,
            address: customerAddress,
            phone: customerMobile
        }
        const customerJSON = JSON.stringify(customer)
        console.log(customerJSON);
        $.ajax({
            url: "http://localhost:8081/POS_BackEnd/customer",
            type: "POST",
            data : customerJSON,
            headers: {"Content-Type": "application/json"},
            success: (res) => {
                console.log(JSON.stringify(res));
                loadTableCustomer();
            },
            error: (res) => {
                console.error(res);
            }
        });

        //customers.push(customer)

        //totalCustomers();
        console.log(customer);
        clearFields();
    } else {
        return false;
    }
});

/*$("#customer-table").on('click', 'tr', function () {
    // console.log("Adoo");
    recordIndex = $(this).index();

    console.log(recordIndex);

    let customerId = $(this).find("id").text();
    let customerName = $(this).find("name").text();
    let customerAddress = $(this).find("address").text();
    let customerMobile = $(this).find("phone").text();

    $("#cus-custom-id").val(customerId);
    $("#cus-custom-user").val(customerName);
    $("#cus-custom-address").val(customerAddress);
    $("#cus-custom-mobile").val(customerMobile);

    // console.log(id);
    // console.log(fName);
    // console.log(lName);
    // console.log(address);
});*/

$("#customer-update-btn").on('click', () => {
    validateID();
    validateName();
    validateAddress();
    validateMobile();
    if (isError === true && usernameError === true && addressError === true && mobileError === true) {
        var customerId = $('#cus-custom-id').val();
        var customerName = $('#cus-custom-user').val();
        var customerAddress = $('#cus-custom-address').val();
        var customerMobile = $('#cus-custom-mobile').val();

        let customer = {
            id: customerId,
            name: customerName,
            address: customerAddress,
            phone: customerMobile
        }
        const customerJSON = JSON.stringify(customer)
        console.log(customerJSON);
        $.ajax({
            url: "http://localhost:8081/POS_BackEnd/customer",
            type: "PUT",
            data : customerJSON,
            headers: {"Content-Type": "application/json"},
            success: (res) => {
                console.log(JSON.stringify(res));
                loadTableCustomer();
            },
            error: (res) => {
                console.error(res);
            }
            // data: JSON.stringify({
            //     "id": 3,
            //     "name": "Hulk",
            //     "address": "NYC",
            //     "phone": "0760199035"
            // }),
        });



        clearFields();
    } else {
        return false;
    }
});

$('#customer-delete-btn').on('click', () => {
    // customers.splice(recordIndex, 1);

    let customerId = $('#cus-custom-id').val();

    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/customer?id="+customerId,
        type: "DELETE",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            console.log(JSON.stringify(res));
            loadTableCustomer();
        },
        error: (res) => {
            console.error(res);
        }
    });
    totalCustomers();

    clearFields();
});

$('#customer-clear-btn').on('click', () => {
    clearFields();
});

$('#btnGetAllCustomer').on('click', () => {
    loadTableCustomer();
});

function clearFields() {
    $('#cus-custom-id').val('');
    $('#cus-custom-user').val('');
    $('#cus-custom-address').val('');
    $('#cus-custom-mobile').val('');
}

function totalCustomers() {
    let totalCustomer = customers.length
    console.log("Customer Count: "+totalCustomer);
    $('#customerCount').text(totalCustomer);
}
loadTableProduct();

var recordIndex = undefined;

let isIDError = true;
let isNameError = true;
let isTypeError = true;
let isQtyError = true;
let isPriceError = true;

function validateID(){
    if ($('#pro-custom-id').val() === "") {
        $("#pro-custom-id").css({"border-color": "red"});
        alert("ID Missing");
        isIDError = false;
        return false;
    } else {
        $("#pro-custom-id").css({"border-color": "#32008E"});
        isIDError = true;
    }
}
function validateName(){
    var isValidName = new RegExp("\\b[A-Z][a-z]*( [A-Z][a-z]*)*\\b");
    if ($('#pro-custom-name').val() === "") {
        $("#pro-custom-name").css({"border-color": "red"});
        alert("Product Name Missing");
        isNameError = false;
        return false;
    } else if (!isValidName.test($("#pro-custom-name").val())) {
        $("#pro-custom-name").css({"border-color": "red"});
        alert("Product Name Invalid");
        isNameError = false;
        return false;
    } else {
        $("#pro-custom-name").css({"border-color": "#32008E"});
        isNameError = true;
    }
}
function validateType(){
    var isValidType = new RegExp("\\b[A-Z][a-z]*( [A-Z][a-z]*)*\\b");
    if ($('#pro-custom-type').val() === "") {
        $("#pro-custom-type").css({"border-color": "red"});
        alert("Product Type Missing");
        isTypeError = false;
        return false;
    } else if (!isValidType.test($("#pro-custom-type").val())) {
        $("#pro-custom-type").css({"border-color": "red"});
        alert("Product Type Invalid");
        isTypeError = false;
        return false;
    } else {
        $("#pro-custom-type").css({"border-color": "#32008E"});
        isTypeError = true;
    }
}
function validateQty(){
    var isValidQTY = new RegExp("^[0-9]+\\.?[0-9]*$");
    if ($('#pro-custom-qty').val() === "") {
        $("#pro-custom-qty").css({"border-color": "red"});
        alert("Product QTY Missing");
        isQtyError = false;
        return false;
    } else if (!isValidQTY.test($("#pro-custom-qty").val())) {
        $("#pro-custom-qty").css({"border-color": "red"});
        alert("Product QTY Invalid");
        isQtyError = false;
        return false;
    } else {
        $("#pro-custom-qty").css({"border-color": "#32008E"});
        isQtyError = true;
    }
}
function validatePrice(){
    var isValidPrice = new RegExp("^[0-9]+\\.?[0-9]*$");
    if ($('#pro-custom-price').val() === "") {
        $("#pro-custom-price").css({"border-color": "red"});
        alert("Product Price Missing");
        isPriceError = false;
        return false;
    } else if (!isValidPrice.test($("#pro-custom-price").val())) {
        $("#pro-custom-price").css({"border-color": "red"});
        alert("Product Price Invalid");
        isPriceError = false;
        return false;
    } else {
        $("#pro-custom-price").css({"border-color": "#32008E"});
        isPriceError = true;
    }
}

 export function loadTableProduct(){
    $('#product-table').empty();
    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/product",
        method: "GET",
        success: function (results) {
            $('#product-table').empty();
            results.forEach(function (post) {
                var record = `<tr>
                                <td>${post.id}</td>     
                                <td>${post.name}</td>
                                <td>${post.type}</td>     
                                <td>${post.qty}</td>
                                <td>${post.price}</td>
                            </tr>`;
                $('#product-table').append(record);
            });
            $('#productCount').text(results.length);
        },
        error: function (error) {
            console.log(error);
            alert("An error occurred while fetching the posts.");
        }
    });
}

$('#btnSearchProduct').on('click', () => {
    let proId = $('#pro-custom-id').val();
    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/product?id="+proId,
        type: "GET",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            console.log(JSON.stringify(res));
            $('#pro-custom-name').val(res.name);
            $('#pro-custom-type').val(res.type);
            $('#pro-custom-qty').val(res.qty);
            $('#pro-custom-price').val(res.price);
        },
        error: (res) => {
            console.error(res);
        }
    });

    console.log('Selected product ID:', proId);

    // Find the selected product object
    // const res = products.find(product => product.proId === prodId);
    // console.log('Selected product:', res);
});

$('#product-add-btn').on('click', () => {
    validateID();
    validateName();
    validateType();
    validatePrice();
    validateQty();

    if (isIDError === true && isNameError === true && isTypeError === true && isPriceError === true && isQtyError === true) {
        var productId = $('#pro-custom-id').val();
        var productName = $('#pro-custom-name').val();
        var productType = $('#pro-custom-type').val();
        var productQty = $('#pro-custom-qty').val();
        var productPrice = $('#pro-custom-price').val();

        let product = {
            id: productId,
            name: productName,
            type: productType,
            qty: productQty,
            price: productPrice
        }

        const productJSON = JSON.stringify(product)
        console.log(productJSON);
        $.ajax({
            url: "http://localhost:8081/POS_BackEnd/product",
            type: "POST",
            data : productJSON,
            headers: {"Content-Type": "application/json"},
            success: (res) => {
                console.log(JSON.stringify(res));
                loadTableProduct();
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

        totalProducts();
        clearFields();
    } else {
        return false;
    }
});


$("#product-table").on('click', 'tr',function()  {
    // console.log("Adoo");
    recordIndex = $(this).index();
    console.log(recordIndex);

    let productId = $(this).find(".pro_id").text();
    let productName = $(this).find(".pro_name").text();
    let productType = $(this).find(".pro_type").text();
    let productQty = $(this).find(".pro_qty").text();
    let productPrice = $(this).find(".pro_price").text();

    $("#pro-custom-id").val(productId);
    $("#pro-custom-name").val(productName);
    $("#pro-custom-type").val(productType);
    $("#pro-custom-qty").val(productQty);
    $("#pro-custom-price").val(productPrice);
});

$("#product-update-btn").on('click', () => {
    var productId = $('#pro-custom-id').val();
    var productName = $('#pro-custom-name').val();
    var productType = $('#pro-custom-type').val();
    var productQty = $('#pro-custom-qty').val();
    var productPrice = $('#pro-custom-price').val();

    let product = {
        id: productId,
        name: productName,
        type: productType,
        qty: productQty,
        price: productPrice
    }

    const productJSON = JSON.stringify(product)
    console.log(productJSON);
    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/product",
        type: "PUT",
        data : productJSON,
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            console.log(JSON.stringify(res));
            loadTableProduct();
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
});

$('#product-delete-btn').on('click', () => {
    // products.splice(recordIndex, 1);
    let productId = $('#pro-custom-id').val();

    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/product?id="+productId,
        type: "DELETE",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            console.log(JSON.stringify(res));
            loadTableProduct();
        },
        error: (res) => {
            console.error(res);
        }
    });

    totalProducts();
    clearFields();
});

$('#product-clear-btn').on('click', () => {
    clearFields();
});

$('#btnGetAllProducts').on('click', () => {
    loadTableProduct();
});

function clearFields() {
    $('#pro-custom-id').val("");
    $('#pro-custom-name').val("");
    $('#pro-custom-type').val("");
    $('#pro-custom-qty').val("");
    $('#pro-custom-price').val("");
}



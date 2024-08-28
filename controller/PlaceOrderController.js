//import {customers, products, orderDetails, orders} from "/db/DB.js";
//import OrderDetailModel from "/model/OrderDetailModel.js"
import {loadTableProduct} from "./ProductController.js";
import {loadTableCustomer} from "./CustomerController.js";


let cusId = null;

const date = new Date();

let recordIndex = undefined;
let orderDate = date.getFullYear()+"/"+date.getMonth()+"/"+date.getDate();

loadTableCart()

$('#orderDate').text(orderDate);

function updateCustomerIDs() {
    $('#customerSelectID').empty();

    // Create and append default option
    const defaultOption = document.createElement("option");
    defaultOption.text = "Select customer ID";
    defaultOption.value = ""; // Set an empty value for the default option
    $('#customerSelectID').append(defaultOption);

    // Fetch customer data from the server
    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/customer",
        type: "GET",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            // Assuming `res` is an array of customer objects
            res.forEach(customer => {
                const option = document.createElement("option");
                option.value = customer.id; // Set value to customer ID
                option.text = customer.id; // Display customer ID in dropdown
                $('#customerSelectID').append(option);
            });
        },
        error: (res) => {
            console.error('Error fetching customer data:', res);
        }
    });
}

$('#customerSelectID').on('focus', () => {
    updateCustomerIDs();
});

$('#customerSelectID').on('change', function() {
    const cusId = $('#customerSelectID').val(); // Get selected customer ID

    console.log('Selected Customer ID:', cusId);

    // Fetch customer data from the server to find the selected customer
    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/customer?id="+cusId,
        type: "GET",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            console.log('Selected Customer:', res);
            // Update the input element with the customer's name
            $('#customerName').val(res.name);
        },
        error: (res) => {
            console.error('Error fetching selected customer data:', res);
            $('#customerName').val("Error fetching customer data");
        }
    });
});

    
function updateProductIDs() {
    $('#productSelectID').empty();

    const defaultOption = document.createElement("option");
    defaultOption.text = "Select product ID";
    defaultOption.value = ""; // Set an empty value for the default option
    $('#productSelectID').append(defaultOption);

    // Fetch customer data from the server
    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/product",
        type: "GET",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            // Assuming `res` is an array of customer objects
            res.forEach(product => {
                const option = document.createElement("option");
                option.value = product.id; // Set value to customer ID
                option.text = product.id; // Display customer ID in dropdown
                $('#productSelectID').append(option);
            });
        },
        error: (res) => {
            console.error('Error fetching product data:', res);
        }
    });
}

$('#productSelectID').on('focus', () => {
    updateProductIDs();
});

$('#productSelectID').on('change', function() {
    let prodId = $('#productSelectID option:selected').text();

    console.log('Selected product ID:', prodId);

    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/product?id="+prodId,
        type: "GET",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            console.log('Selected Customer:', res);
            // Update the input element with the customer's name
            $('#productName').val(res.name);
            $('#productType').val(res.type);
            $('#productQTY').val(res.qty);
            $('#productPrice').val(res.price);
        },
        error: (res) => {
            console.error('Error fetching selected product data:', res);
            $('#customerName').val("Error fetching product data");
        }
    });

});

function loadTableCart() {
    $('#cart-table').empty();
    $('#order-table').empty();
    $('#dash-table').empty();
    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/orders",
        method: "GET",
        success: function (results) {
            $('#cart-table').empty();
            $('#order-table').empty();
            $('#dash-table').empty();
            results.forEach(function (post) {
                let record = `<tr>
                                <td class="order_id" scope="row">${post.orderId}</td>
                                <td class="pro_name">${post.customerName}</td>
                                <td class="pro_type">${post.productType}</td>
                                <td class="pro_qty">${post.productQTYNeeded}</td>
                                <td class="pro_price">${post.productPrice}</td>
                                <td class="pro_total">${post.productTotal}</td>
                            </tr>`
                $('#cart-table').append(record);
                $('#order-table').append(record);
                $('#dash-table').append(record);
            });
        },
        error: function (error) {
            console.log(error);
            alert("An error occurred while fetching the posts.");
        }
    });
}

function clearFields(){
    $('#productSelectID option:selected').text("");
    $('#productName').val("");
    $('#productType').val("");
    $('#productQTY').val("");
    $('#productQtyNeeded').val("");
    $('#productPrice').val("");
}

$('#clear').on('click', () => {
    clearFields();
    loadTableCustomer();
    loadTableProduct();
    loadTableCart();
});

$("#cart-table").on('click', 'tr', function () {
    recordIndex = $(this).index();
    console.log(recordIndex);

    let productName = $(this).find(".proName").text();
    let productType = $(this).find(".proType").text();
    let productQTYNeeded = $(this).find(".proQty").text();
    let productPrice = $(this).find(".proPrice").text();

    $('#productName').val(productName);
    $('#productType').val(productType);
    $('#productQTY').val(productQTYNeeded);
    $('#productPrice').val(productPrice);
});



$('#addToCart').on('click', () => {
    // if ($('#productQty').val() <= $('#productQtyNeeded').val()) {
    //     alert("Blah")
    // } else {
        let orderId = $('#orderId').val();
        let customerId = $('#customerSelectID option:selected').text();
        let customerName = $('#customerName').val();
        let productId = $('#productSelectID option:selected').text();
        let productName = $('#productName').val();
        let productType = $('#productType').val();
        let productQTYNeeded = $('#productQtyNeeded').val();
        let productPrice = $('#productPrice').val();
        let productTotal = productQTYNeeded*productPrice;

    console.log('Order ID:', orderId);
    console.log('Customer ID:', customerId);
    console.log('Customer Name:', customerName);
    console.log('Product ID:', productId);
    console.log('Product Name:', productName);
    console.log('Product Type:', productType);
    console.log('Quantity Needed:', productQTYNeeded);
    console.log('Product Price:', productPrice);
    console.log('Product Total:', productTotal);

    let order = {
        orderId :orderId,
        customerId: customerId,
        customerName: customerName,
        productId: productId,
        productName: productName,
        productType: productType,
        productQTYNeeded: productQTYNeeded,
        productPrice: productPrice,
        productTotal: productTotal
    }

    const orderJSON = JSON.stringify(order)
    console.log(orderJSON);
    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/orders",
        type: "POST",
        data : orderJSON,
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            console.log(JSON.stringify(res));
            loadTableCustomer();
            loadTableProduct();
            loadTableCart();
        },
        error: (res) => {
            console.error(res);
        }
    });
        // let orderDetail = new OrderDetailModel(orderId, customerId, customerName, productId, productName, productType, productQTYNeeded, productPrice, productTotal);
        //
        // const selectedProduct = products.find(product => product.proId === productId)
        // selectedProduct.proQty = selectedProduct.proQty - $('#productQtyNeeded').val();
        // console.log("Product Qty: "+selectedProduct.proQty);
        //
        // orderDetails.push(orderDetail);

        //totalOrders();
        //console.log(orderDetails);
        clearFields();
    console.log(orderId);
});

$('#removeFromCart').on('click', () => {
    let orderId = $('#orderId').val();
    $.ajax({
        url: "http://localhost:8081/POS_BackEnd/orders?id="+orderId,
        type: "DELETE",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            console.log(JSON.stringify(res));
            loadTableCart();
        },
        error: (res) => {
            console.error(res);
        }
    });
});

function totalOrders() {
    //let totalOrder = orders.length
    console.log("Customer Count: "+totalOrder);
    $('#orderCount').text(totalOrder);
}
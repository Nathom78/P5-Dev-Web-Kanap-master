let orderId = new URL(window.location.href).searchParams;
let id = orderId.get('orderId');


const displayOrderId = document.getElementById("orderId");
displayOrderId.innerText = id;
localStorage.clear();




let priceUnitary = [];
let products = []; /* Tableaux d'Id pour le POST final */
let contact = {  /* objet à envoyer dans le POST final */
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: ""
};

/* calcul et affichage du total articles et prix */
function printQuantityAndPrice () {    
    
    let totalQuantityItem = 0;
    let priceTotal = 0;
    
    if (localStorage.length === 0)  {
        document.getElementById('cart__items').insertAdjacentHTML('beforeend', `<p>Votre panier est vide.</p>`);
        document.getElementById('cart__items').style.textAlign = "center";
        document.getElementById("totalPrice").innerText = 0;
        document.getElementById("totalQuantity").innerText = 0;
        products = [];
        return;
    }  

    for (let numberOfArticle = 0; numberOfArticle < localStorage.length ; numberOfArticle++) {        
        let nameItem = localStorage.key(numberOfArticle);
        let objItem = localStorage.getItem(nameItem);
        let objItemJson = JSON.parse(objItem); /* récuperation de l'id de l'article depuis le localStorage et quantité*/
        
        totalQuantityItem += Number(objItemJson.quantity); /* incrémentation du total quantity */
        priceTotal += priceUnitary[numberOfArticle] * Number(objItemJson.quantity); /* incrémentation du prix total*/                        
    }

    document.getElementById("totalPrice").innerText = priceTotal; /* affichage du prix total*/
    document.getElementById("totalQuantity").innerText = totalQuantityItem; /* Affichage de la quantité total */
}

/* Fonction qui permet d'ajouter un enfant dans le html, en ajoutant ue class ou non, par le lien du parent, et le type de l'enfant - pour un gain de place dans le programme*/
function createByClass (classAdd, parentLien, typeCreate, numberOfTheArticle) {
    
    let elt = document.createElement(typeCreate);
    let eltPutIn = document.getElementsByClassName(parentLien);    
    if (classAdd !== '') { 
        elt.classList.add(String(classAdd));
    }
    eltPutIn[numberOfTheArticle].appendChild(elt);     
}

/* fonction de mise à jour de la quantité dans le html et le localStorage */
function updateValue (el,objKeyJson,nomKeyObj) {   
    
    let quantityMaxInput = Number(el.max);
    let quantityMinInput = Number(el.min);       
    
    if (el.value < quantityMinInput) {
        el.value = quantityMinInput;
        alert ("Quantité minimum de "+quantityMinInput+" articles");
    }
    if (el.value > quantityMaxInput ) { 
        el.value = quantityMaxInput;
        alert ("Quantité maximum de "+quantityMaxInput+" articles");
    }
    /* mise à jour du localstorage */
    objKeyJson.quantity = el.value;
    let ObjModify = JSON.stringify(objKeyJson);
    localStorage.setItem(nomKeyObj, ObjModify);
    printQuantityAndPrice ();              
}

// Enléve un article depuis le html et du localstorage
function buttonDeleteArticle (articleToDelete, numKeyLocalStorage, nomKeyObj) {

    document.getElementById("cart__items").removeChild(articleToDelete);
    localStorage.removeItem(nomKeyObj);         
    priceUnitary.splice(numKeyLocalStorage,1);
    products.splice(numKeyLocalStorage,1);
    printQuantityAndPrice ();    
}    

// Affichage des articles 
function displayBasket () {
    for (let numKeyLocalStorage = 0; numKeyLocalStorage < localStorage.length; numKeyLocalStorage++) {    
    
        // Récupération des données de l'objet du localStorage ( la paire key/valeurs )    
    
        let nomKeyObj = localStorage.key(numKeyLocalStorage); /* récupération du nom de l'article ( key )*/
        let objKey = localStorage.getItem(nomKeyObj);
        let objKeyJson = JSON.parse(objKey); // récuperation pour les keys les valeurs id, color, et quantity.    
        
        // 1ér début de la boucle pour la création (insertion) dans le html de l'article
    
        let sectionCartItem = document.getElementById('cart__items');
        let article = document.createElement ('article');
        article.classList.add('cart__item');
        article.setAttribute("data-id", objKeyJson.id);
        article.setAttribute("data-color", objKeyJson.color);
        sectionCartItem.appendChild(article);  /* Création de l'article */        
        
        createByClass ("cart__item__img", "cart__item", "div", numKeyLocalStorage);   /* ajoute un élement enfant html avec une class, le nom de la class (unique) du parent, et le type de l'élement */
        createByClass ('cart__item__content', 'cart__item', 'div', numKeyLocalStorage);    
        createByClass ('cart__item__content__description', 'cart__item__content', 'div', numKeyLocalStorage); 
        createByClass ('', 'cart__item__content__description', 'h2', numKeyLocalStorage);  /* sans class ajouté */
        createByClass ('', 'cart__item__content__description', 'p', numKeyLocalStorage);                                            
        createByClass ('itemPrice', 'cart__item__content__description', 'p', numKeyLocalStorage);                                            
        createByClass ('cart__item__content__settings', 'cart__item__content', 'div', numKeyLocalStorage);                      
        createByClass ('cart__item__content__settings__quantity', 'cart__item__content__settings', 'div', numKeyLocalStorage);      
        createByClass ('', 'cart__item__content__settings__quantity', 'p', numKeyLocalStorage);                                         
        
        let pointingForInput = document.getElementsByClassName('cart__item__content__settings__quantity');      
        pointingForInput[numKeyLocalStorage].firstChild.innerText = "Qté";
        let quantityInput = document.createElement('input');
        quantityInput.classList.add('itemQuantity');
        quantityInput.setAttribute('name', 'itemQuantity');
        quantityInput.setAttribute('type', 'number');
        quantityInput.setAttribute('min', 1);
        quantityInput.setAttribute('max', 100);
        quantityInput.setAttribute("value", objKeyJson.quantity);  /* Affichage de la quantity depuis le localStorage */
        
        pointingForInput[numKeyLocalStorage].appendChild(quantityInput).addEventListener('change', function(e) {
            updateValue(this,objKeyJson,nomKeyObj);
        });// Création de l'évenement changement de la valeur Input        
                        
        createByClass ('cart__item__content__settings__delete', 'cart__item__content__settings', 'div', numKeyLocalStorage);        
        let divItemDelete = document.getElementsByClassName('cart__item__content__settings__delete');
        let pDelete = document.createElement('p');
        pDelete.textContent = 'Supprimer';
        pDelete.classList.add('deleteItem');
        let articleToDelete = divItemDelete[numKeyLocalStorage].closest('article');
        
        divItemDelete[numKeyLocalStorage].appendChild(pDelete).addEventListener('click', function () {
            buttonDeleteArticle (articleToDelete, numKeyLocalStorage, nomKeyObj)
        });/* Affichage "bt" delete avec évenement click */
                
        
        // 2éme étapes - récuperation des informations du produit dans l'API et affichage des differentes valeurs (nom, prix, couleur) dans la div content description 
    
        let urlProduct = "http://localhost:3000/api/products/" + objKeyJson.id;        
    
        fetch (urlProduct)
            .then (function(res) {
                if (res.ok) {
                return res.json();        
                }    
            })
            .then (function(kanap) {             
                let imgApi = document.querySelector("article[data-id='"+objKeyJson.id+"'][data-color='"+objKeyJson.color+"'] div.cart__item__img"); /* Affichage de l'image dans le HTML */
                let image = document.createElement('img');
                image.alt = kanap.altTxt; 
                image.src = kanap.imageUrl;
                imgApi.appendChild(image);
    
                document.querySelector("article[data-id='"+objKeyJson.id+"'][data-color='"+objKeyJson.color+"'] h2").innerHTML = kanap.name; /* Affichage du nom */
    
                document.querySelector("article[data-id='"+objKeyJson.id+"'][data-color='"+objKeyJson.color+"'] div.cart__item__content__description > p + p").innerHTML = "Prix unitaire: " + kanap.price + " €"; /* Affichage du prix */
    
                document.querySelector("article[data-id='"+objKeyJson.id+"'][data-color='"+objKeyJson.color+"'] div.cart__item__content__description > p").innerHTML = "Couleur choisie: " + objKeyJson.color; /* Affichage de la couleur depuis le localstorage*/
                
                priceUnitary[numKeyLocalStorage] = Number(kanap.price);
                printQuantityAndPrice ();        
            })          
    
            .catch(function(err) {
                console.log("Il y a eu un problème avec l\'opération fetch:" + err.message );
        });    
        
        products[numKeyLocalStorage] = String(objKeyJson.id); /* stockage de la variable products à envoyer à l'API, pour la commande, ici juste l'id */
    }    
}
// **************************
// ***  Corp du programme ***

if (localStorage.length > 0) displayBasket ();
printQuantityAndPrice ();

//
/* 3éme étape remplir les champs des formulaires */ 
//

/* function qui change la première lettre en majuscule */
function strUcFirst(a){return (a+'').charAt(0).toUpperCase()+a.substr(1);}


/* Champ Prénom */
let formFirstName = document.getElementById("firstName");
formFirstName.addEventListener('change', validateFirstName);

function validateFirstName (e){
    let eltForPrint = document.getElementById("firstNameErrorMsg");
    let contentForm = e.target.value;
    let maskLetter = /[^A-Za-z-]/g; // exclusion de tout sauf des lettres et -

    if (contentForm.match(maskLetter) != null) {        
        eltForPrint.innerText = "Veuillez entrer un prénom valide";
    } else {
        eltForPrint.innerText = "";
        newText = strUcFirst(contentForm);
        e.target.value = newText;
        contact.firstName = String(newText); /* création de la clé prénom de l'objet contact */
    }
}
/* champ Nom */
let formLastName = document.getElementById("lastName");
formLastName.addEventListener('change', validateLastName)

function validateLastName (e){
    let eltForPrint = document.getElementById("lastNameErrorMsg");
    let contentForm = e.target.value;
    let maskLetter = /[^A-Za-z]/g; // exclusion de tout sauf des lettres

    if (contentForm.match(maskLetter) != null) {        
        eltForPrint.innerText = "Veuillez entrer un nom valide";
    } else {
        eltForPrint.innerText = "";
        newText = strUcFirst(contentForm);
        e.target.value = newText;
        contact.lastName = String(newText); /* création de la clé nom de l'objet contact */
    }
}

/* champ Adresse  */
let formAddress = document.getElementById("address");
formAddress.addEventListener('change', validateAddress)

function validateAddress (e){
    let eltForPrint = document.getElementById("addressErrorMsg");
    let contentForm = e.target.value;
    let maskLetter = /[^0-9A-Za-z ]/g; // exclusion de tout sauf des lettres et des chiffres (et espace)

    if (contentForm.match(maskLetter) != null) {        
        eltForPrint.innerText = "Veuillez entrer une adresse valide";
    } else {
        eltForPrint.innerText = "";
        contact.address = String(e.target.value); /* création de la clé adress de l'objet contact */
    }
}

/* champ Ville  */
let formCity = document.getElementById("city");
formCity.addEventListener('change', validateCity)

function validateCity (e){
    let eltForPrint = document.getElementById("cityErrorMsg");
    let contentForm = e.target.value;
    let maskLetter = /[^A-Za-z-]/g; // exclusion de tout sauf des lettres et -

    if (contentForm.match(maskLetter) != null) {        
        eltForPrint.innerText = "Veuillez entrer une ville et code postal valide";
    } else {
        eltForPrint.innerText = "";
        contact.city = String(e.target.value); /* création de la clé city de l'objet contact */
    }
}

/* champ Email  */
let formEmail = document.getElementById("email");
formEmail.addEventListener('change', validateemail)

function validateemail (e){
    let eltForPrint = document.getElementById("emailErrorMsg");
    let contentForm = e.target.value;
    let maskLetter = /^[a-z0-9\-_\.]+@[a-z0-9]+\.[a-z]{2,5}$/;  
    let valid = maskLetter.test(contentForm);

    if (!valid) {        
        eltForPrint.innerText = "Veuillez entrer un Email valide";        
    } else {
        eltForPrint.innerText = "";
        contact.email = String(e.target.value); /* création de la clé email de l'objet contact */
    }
}

/* Bouton Commande!!*/
let buttonSubmit = document.getElementById("order");
buttonSubmit.addEventListener('click', onClickSend)

function onClickSend (e) {
    e.preventDefault();
    /* test qu'il y ai tous les champs et au moins un produit dans le panier */
    if (products.length == 0) {
        alert("Vous devez avoir au moins un article !");
        return;
    }
    if (!(contact.firstName != "" 
        && contact.lastName != ""
        && contact.address != "" 
        && contact.city != ""
        && contact.email != "")) { 
            
        alert("Vous devez renseigner tous les champs !");           
        return;            
    }          
    /* POST à l'API avec envoie de l'objet order( contact + products ) avec récupération de la réponse orderId*/             
    let order = {contact,products};
    let orderJSON = JSON.stringify(order);        

    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {        
        'Content-Type': 'application/json'
        },
        body: orderJSON
    })
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(value) {        
        document.location.href = 'confirmation.html?orderId=' + value.orderId /* ouverture de la page confirmation */
    });                    
}
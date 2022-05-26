
let priceTotal = 0 ;
let priceUnitary = [];
let totalQuantityItem = 0;
let quantityItem = [];
let products = [];
let contact = {
       firstName: "",
       lastName: "",
       address: "",
       city: "",
       email: ""
};

function printQuantityAndPrice () {
    totalQuantityItem = 0;
    priceTotal = 0;
    //let allQuantityElement = document.getElementsByClassName("itemQuantity");
    //let allpriceUnitary = document.getElementsByClassName("itemPrice");
            
    for (let numberOfArticle = 0; numberOfArticle < localStorage.length ; numberOfArticle++) {
        
        //let quantityOfOne = allQuantityElement[numberOfArticle].value;         
        
        totalQuantityItem += quantityItem [numberOfArticle];
        //priceTotal += priceOfOne * quantityOfOne;
        priceTotal += priceUnitary[numberOfArticle] * quantityItem[numberOfArticle];
    }

       
    document.getElementById("totalQuantity").innerText = totalQuantityItem;
    document.getElementById("totalPrice").innerText = priceTotal;  
   
}
/* Affichage des articles du panier */
// 1er récupération des informations d'un produit par ordre du localStorage (id, couleur, quantité)
// Avec Création des articles (affichage)
// 2éme récupération des information dans l'API ( prix, image, nom)

/* Boucle en fonction du nombre d'articles stocké dans le localStorage */
for (let keyLocalStorage = 0; keyLocalStorage < localStorage.length; keyLocalStorage++) {
    
    
    // Récupération des données de l'objet du localStorage ( la paire key/valeurs )
    // avec déclaration des variables globale de la boucle et functions

    let nomKeyObj = localStorage.key(keyLocalStorage);
    let objKey = localStorage.getItem(nomKeyObj);
    let objKeyJson = JSON.parse(objKey); // pour les keys id, color, et quantity.
    quantityItem[keyLocalStorage]  = Number(objKeyJson.quantity);
    
    

    function createByClass (classAdd, parentLien, typeCreate) {
    
    let elt = document.createElement(typeCreate);
    let eltPutIn = document.getElementsByClassName(parentLien);    
    if (classAdd !== '') { 
        elt.classList.add(String(classAdd));
    }
    eltPutIn[keyLocalStorage].appendChild(elt);     
    }
    
    // début de la boucle pour la création (insertion) dans le html de l'article
    let sectionCartItem = document.getElementById('cart__items');
    let article = document.createElement ('article');
    article.classList.add('cart__item');
    article.setAttribute("data-id", objKeyJson.id);
    article.setAttribute("data-color", objKeyJson.color);
    sectionCartItem.appendChild(article);  /* Création de l'article */
    
    /* Création de la 1ére div enfant pour l'image */
    createByClass ("cart__item__img", "cart__item", "div");   /* ajoute un élement enfant html avec une class, le nom de la class (unique) du parent, et le type de l'élement 
    /* Création de la 2éme div enfant pour le contenue */    
    createByClass ('cart__item__content', 'cart__item', 'div');    
    /* description */
    createByClass ('cart__item__content__description', 'cart__item__content', 'div'); 
    /* Nom du produit */
    createByClass ('', 'cart__item__content__description', 'h2');  /* sans class ajouté */
    /* couleur */
    createByClass ('', 'cart__item__content__description', 'p');                                            
    /* prix unitaire */
    createByClass ('itemPrice', 'cart__item__content__description', 'p');                                            
    /* settings */
    createByClass ('cart__item__content__settings', 'cart__item__content', 'div');                      
    /*  div setting quantity */
    createByClass ('cart__item__content__settings__quantity', 'cart__item__content__settings', 'div');      
    /* Affichage de la qty */
    createByClass ('', 'cart__item__content__settings__quantity', 'p');                                         
    /* input itemquantity avec ces attributs*/
    let pointingForInput = document.getElementsByClassName('cart__item__content__settings__quantity');      
    let quantityInput = document.createElement('input');
    quantityInput.classList.add('itemQuantity');
    quantityInput.setAttribute('name', 'itemQuantity');
    quantityInput.setAttribute('type', 'number');
    quantityInput.setAttribute('min', 1);
    quantityInput.setAttribute('max', 100);
    quantityInput.setAttribute("value", objKeyJson.quantity);  /* Affichage de la quantity depuis le localStorage */
    pointingForInput[keyLocalStorage].appendChild(quantityInput);  
    /*  div delete */ 
    createByClass ('cart__item__content__settings__delete', 'cart__item__content__settings', 'div');        
    let divItemDelete = document.getElementsByClassName('cart__item__content__settings__delete');
    let pDelete = document.createElement('p');
    pDelete.textContent = 'Supprimer';
    pDelete.classList.add('deleteItem');
    divItemDelete[keyLocalStorage].appendChild(pDelete);                                                     /* Affichage "bt" delete */

    // 2éme récuperation des informations du produit dans l'API et affichage des differentes valeurs

    let urlProduct = "http://localhost:3000/api/products/" + objKeyJson.id;
    
    fetch (urlProduct)
        .then (function(res) {
            if (res.ok) {
            return res.json();        
            }    
        })

        .then (function(value) { 
            
            let imgApi = document.querySelector("article[data-id='"+objKeyJson.id+"'][data-color='"+objKeyJson.color+"'] div.cart__item__img"); /* Affichage de l'image dans le HTML */
            let image = document.createElement('img');
            

            image.alt = value.altTxt; 
            image.src = value.imageUrl;
            imgApi.appendChild(image);

            document.querySelector("article[data-id='"+objKeyJson.id+"'][data-color='"+objKeyJson.color+"'] h2").innerHTML = value.name; /* Affichage du nom */

            document.querySelector("article[data-id='"+objKeyJson.id+"'][data-color='"+objKeyJson.color+"'] div.cart__item__content__description > p + p").innerHTML = "Prix unitaire: " + value.price + " €"; /* Affichage du prix */

            document.querySelector("article[data-id='"+objKeyJson.id+"'][data-color='"+objKeyJson.color+"'] div.cart__item__content__description > p").innerHTML = "Couleur choisie: " + objKeyJson.color; /* Affichage de la couleur depuis le localstorage*/
            
            priceUnitary[keyLocalStorage] = Number(value.price);
            
            printQuantityAndPrice ();
            })          
             

        .catch(function(err) {
            console.log("Il y a eu un problème avec l\'opération fetch:" + err.message );
        });

    
    // 3éme étape - Modification de la quantity

    let inputChange = document.querySelector("article[data-id='"+objKeyJson.id+"'][data-color='"+objKeyJson.color+"'] input[name='itemQuantity']");
    let quantityMaxInput = Number(inputChange.max);
    let quantityMinInput = Number(inputChange.min);
    inputChange.addEventListener('change', updateValue);

    function updateValue () {
                        
        if (inputChange.value < quantityMinInput) {
            inputChange.value = quantityMinInput;
            alert ("Quantité minimum de "+quantityMinInput+" articles");
        }
        if (inputChange.value > quantityMaxInput ) { 
            inputChange.value = quantityMaxInput;
            alert ("Quantité maximum de "+quantityMaxInput+" articles");
        }
        /* mise à jour du localstorage */
        objKeyJson.quantity = inputChange.value;
        let ObjModify = JSON.stringify(objKeyJson);
        localStorage.setItem(nomKeyObj, ObjModify);

        quantityItem[keyLocalStorage]  = Number(objKeyJson.quantity); /* Mise à jour de la quantity affiché */
        printQuantityAndPrice ();         
    }

    // 3bis - delete un article
    let boutonToDelete = document.querySelector("article[data-id='"+objKeyJson.id+"'][data-color='"+objKeyJson.color+"'] p.deleteItem");
    boutonToDelete.addEventListener('click', deleteArticle);

    function deleteArticle () {
        let articleToDelete = document.querySelector("article[data-id='"+objKeyJson.id+"'][data-color='"+objKeyJson.color+"']");
        document.getElementById("cart__items").removeChild(articleToDelete);
        localStorage.removeItem(nomKeyObj);
        quantityItem.splice(keyLocalStorage,1);        
        priceUnitary.splice(keyLocalStorage,1);
        
        printQuantityAndPrice ();     
    }    

    products[keyLocalStorage] = String(objKeyJson.id); /* stockage de la variable products a envoyer à l'API */

}
//
/* 4éme étape remplir les champs des formulaires */ 
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

let buttonSubmit = document.getElementById("order");
buttonSubmit.addEventListener('click', onClickSend)

function onClickSend (e) {
    e.preventDefault();
    /* test qu'il y ai tous les champs et au moins un produit dans le panier */
    if (contact.firstName != "" 
        && contact.lastName != ""
        && contact.address != "" 
        && contact.city != ""
        && contact.email != ""
        && products.length !== 0
        ) {
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
            console.log(value);
            document.location.href = 'confirmation.html?orderId=' + value.orderId /* ouverture de la page confirmation */
        });
    } else {
        
        if (products.length !== 0) {
            alert("Vous devez renseigner tous les champs !");
        } else {
            alert("Vous devez avoir au moins un article !");
        }                   
    }          
}





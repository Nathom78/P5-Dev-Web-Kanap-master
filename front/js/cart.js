/*  <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
<div class="cart__item__img">
  <img src="../images/product01.jpg" alt="Photographie d'un canapé">
</div>
<div class="cart__item__content">
  <div class="cart__item__content__description">
    <h2>Nom du produit</h2>
    <p>Vert</p>
    <p>42,00 €</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
    </div>
    <div class="cart__item__content__settings__delete">
      <p class="deleteItem">Supprimer</p>
    </div>
  </div>
</div>
</article> */

/* Affichage des articles du panier */
// 1er récupération des informations d'un produit par ordre du localStorage (id, couleur, quantité)
// Avec Création des articles (affichage)
// 2éme récupération des information dans l'API ( prix, image, nom)


let priceTotal = 0 ;
let priceUnitary = new Array;
let totalQuantityItem = 0;
let quantityItem = [];

function printQuantityAndPrice () {
    totalQuantityItem = 0;
    priceTotal = 0;
    let allQuantityElement = document.getElementsByClassName("itemQuantity");
    console.log(priceUnitary);
    

    /* lecture des élements du dom (de la page HTML) */
    for (let numberOfArticle = 0; numberOfArticle < localStorage.length ; numberOfArticle++) {

        let quantityOfOne = allQuantityElement[numberOfArticle].value;
        totalQuantityItem += Number(quantityOfOne);      
        priceTotal += (Number (priceUnitary[numberOfArticle]) * Number(quantityOfOne));  
    }

       
    document.getElementById("totalQuantity").innerText = totalQuantityItem;
    document.getElementById("totalPrice").innerText = priceTotal;  
   
}

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
    sectionCartItem.appendChild(article);                                                 /* Création de l'article */
    

    createByClass ("cart__item__img", "cart__item", "div");                                         /* Création de la 1ére div enfant pour l'image */
     
    createByClass ('cart__item__content', 'cart__item', 'div');                                     /* Création de la 2éme div enfant pour le contenue */
    
    createByClass ('cart__item__content__description', 'cart__item__content', 'div');                   /* description */

    createByClass ('', 'cart__item__content__description', 'h2');                                           /* Nom du produit */
    
    createByClass ('', 'cart__item__content__description', 'p');                                            /* couleur */

    createByClass ('', 'cart__item__content__description', 'p');                                            /* prix unitaire */
    
    createByClass ('cart__item__content__settings', 'cart__item__content', 'div');                      /* settings */

    createByClass ('cart__item__content__settings__quantity', 'cart__item__content__settings', 'div');      /*  div setting quantity */

    createByClass ('', 'cart__item__content__settings__quantity', 'p');                                         /* Affichage de la qty */

    let pointingForInput = document.getElementsByClassName('cart__item__content__settings__quantity');      
    let quantityInput = document.createElement('input');
    quantityInput.classList.add('itemQuantity');
    quantityInput.setAttribute('name', 'itemQuantity');
    quantityInput.setAttribute('type', 'number');
    quantityInput.setAttribute('min', 1);
    quantityInput.setAttribute('max', 100);
    quantityInput.setAttribute("value", objKeyJson.quantity);                                      /* Affichage de la quantity depuis le localStorage */
    pointingForInput[keyLocalStorage].appendChild(quantityInput);                                               /* Changer la qty */

    createByClass ('cart__item__content__settings__delete', 'cart__item__content__settings', 'div');        /*  div delete */ 
        
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
            
            priceUnitary.push(value.price);
            
            })          
             

        .catch(function(err) {
            console.log("Il y a eu un problème avec l\'opération fetch:" + err.message );
        });

    // 3éme étape - Modification de la quantity

    let inputChange = document.querySelector("article[data-id='"+objKeyJson.id+"'][data-color='"+objKeyJson.color+"'] input[name='itemQuantity']");
    inputChange.addEventListener('change', updateValue);

    function updateValue () {
        /* mise à jour du localstorage */
        if (inputChange.value > 100 ) { inputChange.value = 100};
        objKeyJson.quantity = inputChange.value;
        let ObjModify = JSON.stringify(objKeyJson);
        localStorage.setItem(nomKeyObj, ObjModify);
        quantityItem[keyLocalStorage]  = Number(objKeyJson.quantity);
        printQuantityAndPrice (); /* Mise à jour de la quantity affiché */
        
    }

    // 3bis - delete un article
    let boutonToDelete = document.querySelector("article[data-id='"+objKeyJson.id+"'][data-color='"+objKeyJson.color+"'] p.deleteItem");
    boutonToDelete.addEventListener('click', deleteArticle);

    function deleteArticle () {
        let articleToDelete = document.querySelector("article[data-id='"+objKeyJson.id+"'][data-color='"+objKeyJson.color+"']");
        document.getElementById("cart__items").removeChild(articleToDelete);
        localStorage.removeItem(nomKeyObj);
        quantityItem.pop();
        priceUnitary.pop();
        printQuantityAndPrice ();     
    }
}
printQuantityAndPrice ();




   



// 4éme Total /* soit récuperer les élements depuis le document, soit depuis LocalStorage et API




/* for (let keyLocalStorage = 0; keyLocalStorage < localStorage.length; keyLocalStorage++) {


} */
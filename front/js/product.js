let quantityMaxInput = Number(document.getElementById("quantity").max);
let quantityMinInput = Number(document.getElementById("quantity").min);

// 1ére étape Récupération de l'Id dans l'url 

let urlParam = new URLSearchParams(document.location.search);
let idUrl = urlParam.get("id");

// 2éme étape récuperation des informations du produit dans l'API

let urlProduct = "http://localhost:3000/api/products/" + idUrl;

fetch (urlProduct)
    .then (function(res) {
        if (res.ok) {
        return res.json();        
        }    
    })

    .then (function(value) { 
        
        let imgApi = document.querySelector("article div.item__img"); /* Affichage de l'image dans le HTML */
        let image = document.createElement('img');
        image.alt = value.altTxt; 
        image.src = value.imageUrl;
        imgApi.appendChild(image);

        document.getElementById("title").textContent = value.name; /* Affichage du nom */

        document.getElementById("price").textContent = value.price; /* Affichage du prix */

        document.getElementById("description").textContent = value.description; /* Affichage de la description */

        let colorOption = document.getElementById("colors"); /* Mise en liste des différentes couleurs en stock */ 
        for  (let color of value.colors) {
            colorOption.options[colorOption.options.length] = new Option (color);
        }
        })

    .catch(function(err) {
        console.log("Il y a eu un problème avec l\'opération fetch:" + err.message );
    });

// 3éme étape vérifier si la quantité entré dans l'input est dans la fourchette

document.getElementById("quantity").addEventListener("input", function() {
    let v = parseInt(this.value);
    if (v < quantityMinInput) {
        this.value = quantityMinInput;
        alert ("Quantité minimum de "+quantityMinInput+" articles");
    }
    if (v > quantityMaxInput) {
        this.value = quantityMaxInput;
        alert ("Quantité maximum de "+quantityMaxInput+" articles");    
    }    
  });

// 4éme étape Ajouter au panier au moment du click SI UNE COULEUR a été choisie



let boutonAddToCart = document.getElementById("addToCart");
boutonAddToCart.addEventListener('click', onClickStorage);
 

// Fonction enregistrement dans le localStorage 
function onClickStorage (e) {
    let colorObjKanap = document.getElementById("colors").value;  /* récuperation de la couleur et du nom sur la page */ 
    let nomObjKanap = document.getElementById("title").textContent + " " + colorObjKanap;    // Création du nom du produit (nom du canap + couleur) afin de différencier les produits de la même famille
    let objInLocalStorage = localStorage.getItem(nomObjKanap);      
    let objArticle = {
        id : "",
        quantity : document.getElementById("quantity").value,
        color : ""
     }
    
    if (colorObjKanap == "") alert ("Choisisser une couleur");
    if (objArticle.quantity == 0) {
        alert ("Ajouter une quantité");
        e.preventDefault();
        document.getElementById("quantity").focus();
    }
    if (colorObjKanap != "" && objArticle.quantity <= quantityMaxInput && objArticle.quantity >= quantityMinInput) {
    
        if (objInLocalStorage === null) { /* test afin de savoir si le produit existe déja dans le panier */
            
            objArticle.id = idUrl;            
            objArticle.quantity = document.getElementById("quantity").value; // création d'un objet avec un id, une quantité, et une couleur            
            objArticle.color = colorObjKanap;
            let ObjToStock = JSON.stringify(objArticle); // Stockage dans le localStorage
            localStorage.setItem ( nomObjKanap, ObjToStock);            

        } else { /* Sinon on vient lire les données dans le panier afin d'ajouter une quantité */        
                
            objInLocalStorageJSON = JSON.parse(objInLocalStorage); /* Lecture du produit déja enregistré */

            if (objInLocalStorageJSON.color == colorObjKanap) {             

                objArticle.quantity = Number(document.getElementById("quantity").value ) + Number(objInLocalStorageJSON.quantity);
                if (objArticle.quantity > quantityMaxInput) {
                    objArticle.quantity = quantityMaxInput;
                    alert("Quantité maximum atteinte");
                }
                objArticle.id = idUrl;
                objArticle.color = colorObjKanap;

                let ObjToStock = JSON.stringify(objArticle);
                localStorage.setItem (nomObjKanap, ObjToStock);            
            }        
        }
        /* message de confirmation d'ajout */
        if (window.confirm(objArticle.quantity + " " + nomObjKanap + " dans votre panier :\nOK pour consulter votre panier, ANNULER pour continuer vos achats")) {
                    window.location.href = 'cart.html';
        
                } /*else {
                    window.location.href = 'index.html';        
                }*/

    }

    console.table(localStorage);    
}



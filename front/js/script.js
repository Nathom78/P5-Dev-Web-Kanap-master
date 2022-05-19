
// 1ére étape  faire une demande à l'API afin de récuperer les données du produit
fetch ("http://localhost:3000/api/products")
  .then (function(res) {
      if (res.ok) {
        return res.json();        
      }    
  })
  .then (function(value) {
    let apiProducts = value;
    
    // 2 éme étape affichage au bon endroit
    for (let acceuilKanap of apiProducts) {
      let sectionItem = document.getElementById('items'); /* point de départ dans le HTML */

      let a = document.createElement('a');
      a.href = "./product.html?id=" + acceuilKanap._id; 
      sectionItem.appendChild(a); /* Création du lien <ancre> du produit avec son _id */

      let article = document.createElement('article');
      a.appendChild(article); /* Création de l'article */

      let image = document.createElement('img'); 
      image.alt = acceuilKanap.altTxt;
      image.src = acceuilKanap.imageUrl;
      article.append(image); /* Création de l'image du produit */

      titreH3 = document.createElement('h3');      
      titreH3.textContent = acceuilKanap.name;
      titreH3.classList.add("productName");
      article.append(titreH3); /* Création du nom du produit */

      let newP = document.createElement('p');
      newP.classList.add("productDescription");
      newP.textContent = acceuilKanap.description;
      article.append(newP); /* Mise en place de la présentation */
    }   
  })
  .catch(function(err) {
    console.log("Il y a eu un problème avec l\'opération fetch:" + err.message );
  }); 
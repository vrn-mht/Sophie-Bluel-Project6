// Fonction pour vérifier l'état de connexion et mettre à jour l'interface en conséquence ///
function checkLoginStatus() {
  const token = localStorage.getItem("token");
  const modeEditionElement = document.getElementById("mode-edition");
  const filtersElement = document.querySelector(".filters");
  const spanElement = document.querySelector(".title-button span");

  if (modeEditionElement && filtersElement && spanElement) {
    const buttonElement = filtersElement.querySelector("button");

    if (token) {
      modeEditionElement.classList.remove("hidden");
      modeEditionElement.classList.add("edition-mode");

      // Masquer l'élément avec la classe "filters"
      filtersElement.classList.add("hidden");

      // Ajouter une classe à l'élément button
      buttonElement.classList.add("hidden");

      // Retirer la classe "hidden" de l'élément <span>
      spanElement.classList.remove("hidden");
    } else {
      modeEditionElement.classList.add("hidden");
      modeEditionElement.classList.remove("edition-mode");

      // Afficher l'élément avec la classe "filters"
      filtersElement.classList.remove("hidden");

      // Retirer la classe de l'élément button
      buttonElement.classList.remove("hidden");

      // Ajouter la classe "hidden" à l'élément <span>
      spanElement.classList.add("hidden");
    }
  }
}

// Gestionnaire d'événements pageshow
window.addEventListener("pageshow", function (event) {
  // Vérifier l'état de connexion lorsque la page est chargée à partir du cache de session
  checkLoginStatus();
});

// Création de la fonction de connexion
async function envoyerIdentifiants() {
  const formulaireIdentifiants = document.querySelector(".login-form");

  if (formulaireIdentifiants) {
    formulaireIdentifiants.addEventListener("submit", async function (event) {
      event.preventDefault();

      // Réinitialisation du message d'erreur
      const passwordErr = document.querySelector(".passwordErr");
      if (passwordErr) {
        passwordErr.textContent = "";
      }

      // Récupération des valeurs du formulaire d'identification
      const email = document.querySelector("#email").value;
      const motDePasse = document.querySelector("#password").value;

      const user = {
        email: email,
        password: motDePasse,
      };

      try {
        // Appel de la fonction fetch avec toutes les informations nécessaires
        const response = await fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        // Vérification de la réponse
        if (response.status === 404) {
          // Affichage du message d'erreur en cas d'identifiants incorrects
          const passwordErr = document.querySelector(".passwordErr");
          if (passwordErr) {
            passwordErr.textContent =
              "Erreur dans l’identifiant ou le mot de passe.";
          }
        }

        // Si la réponse est réussie, extraction des données en JSON
        const result = await response.json();

        // Vérification du token
        if (result && result.token) {
          // Stockage du token dans le local storage
          localStorage.setItem("token", result.token);

          // Redirection vers la page d'accueil
          window.location.href = "./index.html";
        }
      } catch (error) {
        // Message en cas d'erreurs de requête ou de connexion
        console.error("Erreur lors de la requête d'authentification:", error);
      } finally {
        // Vérifiez l'état de connexion une fois la requête terminée
        checkLoginStatus();
      }
    });
  }
}

// Appeler la fonction de déconnexion après le chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  deconnexion();
  envoyerIdentifiants();
});

// Création de la fonction de déconnexion
function deconnexion() {
  const loginLink = document.querySelector(".logout");

  if (loginLink) {
    // Vérification si le token est déjà stocké dans le local storage
    if (localStorage.getItem("token")) {
      loginLink.textContent = "logout";

      loginLink.addEventListener("click", function (event) {
        event.preventDefault();

        // Suppression du token du local storage
        localStorage.removeItem("token");

        // Redirection vers la page d'identification
        window.location.href = "./login.html";
      });
    } else {
      // Si l'utilisateur n'est pas connecté, le texte sera "login"
      loginLink.textContent = "login";
    }
  }
}

// Appeler la fonction de déconnexion après le chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  deconnexion();
  envoyerIdentifiants();
});

// Ajouter un gestionnaire pour l'événement popstate
window.addEventListener("popstate", function (event) {
  // Vérifier l'état de connexion lorsque l'utilisateur utilise le bouton "retour" du navigateur
  checkLoginStatus();
});

/////// Modale JS /////////

const modifyElements = document.querySelectorAll("i");
const modalContainer = document.querySelector(".modalContainer");
const xmark = document.querySelector(".modalContainer .fa-xmark");
const imageBank = document.querySelector(".imgGallery");

modifyElements.forEach((element) => {
  element.addEventListener("click", () => {
    modalContainer.style.display = "flex";
  });
});

xmark.addEventListener("click", () => {
  modalContainer.style.display = "none";
});

modalContainer.addEventListener("click", (e) => {
  if (e.target.className == "modalContainer") {
    modalContainer.style.display = "none";
  }
});

//// Affichage des images dans la galerie ////

async function imgDisplay() {
  imageBank.innerHTML = "";
  const everyimages = await getWorks();
  everyimages.forEach((works) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = works.id;
    img.src = works.imageUrl;
    span.appendChild(trash);
    figure.appendChild(span);
    figure.appendChild(img);
    imageBank.appendChild(figure);
  });
  deleteImages();
}
imgDisplay();





//Faire aparaitre la deuxieme modale un fois son html fini
const btnAddModal = document.querySelector(".imagesModal button");
const modalAddImages = document.querySelector(".modalAddImages");
const imagesModal = document.querySelector(".imagesModal");
const arrowleft = document.querySelector(".modalAddImages .fa-arrow-left");
const markAdd = document.querySelector(".modalAddImages .fa-xmark");

function displayAddModal() {
  btnAddModal.addEventListener("click", () => {
    modalAddImages.style.display = "flex";
    imagesModal.style.display = "none";
     
  
  });
  arrowleft.addEventListener("click", () => {
    modalAddImages.style.display = "none";
    imagesModal.style.display = "flex";
    // Effacer les champs du formulaire
    form.reset();
  });
  markAdd.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });
}
displayAddModal();

// faire la prévisualisation
const previewImg = document.querySelector(".containerFile img");
const inputFile = document.querySelector(".containerFile input");
const labelFile = document.querySelector(".containerFile label");
const iconFile = document.querySelector(".containerFile .fa-image");
const pFile = document.querySelector(".containerFile p");
//Ecouter les changement sur l'input file
inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];
  console.log(file);
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "flex";
      labelFile.style.display = "none";
      iconFile.style.display = "none";
      pFile.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// Faire la requête GET à l'API pour récupérer les catégories
fetch("http://localhost:5678/api/categories")
  .then((response) => response.json()) // Convertir la réponse en JSON
  .then((data) => {
    // Récupérer le menu déroulant des catégories
    const categorySelect = document.getElementById("category");

    // Parcourir les données (les catégories)
    data.forEach((category) => {
      // Créer un nouvel élément d'option
      const option = document.createElement("option");
      // Définir la valeur et le texte de l'option avec les données de la catégorie
      option.value = category.id;
      option.textContent = category.name;
      // Ajouter cette option au menu déroulant des catégories
      categorySelect.appendChild(option);
    });
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération des catégories:", error);
  });

const form = document.querySelector(".form2ndModal");
const title = document.querySelector("#title");
const category = document.querySelector("#category");
const imageInput = document.querySelector("#file");
const modalButton = document.querySelector(".modalButton");
const gallerynd = document.querySelector(".gallery");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Vérification du  fichier image,  titre et une catégorie sont sélectionnés
  if (!imageInput.files[0] || !title.value || !category.value) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  // Création un objet FormData et ajoutez les données du formulaire
  const formData = new FormData();
  formData.append("image", imageInput.files[0]);
  formData.append("title", title.value);
  formData.append("category", category.value);

  try {
    // Récuperation le token d'authentification depuis le localStorage
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      e.preventDefault();
      const responseData = await response.json();

      // Récuperation l'URL de l'image depuis la réponse JSON
      const imageUrl = responseData.imageUrl;

      const newImage = document.createElement("img");
      const lienImg = document.getElementById("file")
      newImage.src = imageUrl;
      newImage.alt = "Aperçu de l'image ajoutée";

      gallery.appendChild(newImage);

     
      lienImg.src= ""

      // Fermer la modale
      modalContainer.style.display = "none";

      if (response.status === 201) {
        e.preventDefault();
        const container = document.querySelector(".containerFile");
        container.style.background = "";
      }

      //  Si l'image s'ajoute bien
      alert("Image ajoutée avec succès !");

      imgDisplay();
    } else {
      // Pour gérer les erreurs de la requête
      alert("Une erreur est survenue lors de l'envoi de l'image.");
    }
  } catch (error) {
    // Pour gérer erreurs liées à l'envoi de la requête
    console.error("Erreur lors de l'envoi de la requête :", error);
    alert("Une erreur est survenue lors de l'envoi de l'image.");
  }
});

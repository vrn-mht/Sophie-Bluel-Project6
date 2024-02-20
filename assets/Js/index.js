const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
}

// Affichage des works dans le DOM //
 async function affichageWorks(worksArray) {
    gallery.innerHTML = ""; // Vider la galerie avant d'ajouter de nouveaux éléments
    worksArray.forEach((works) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        img.src = works.imageUrl;
        figcaption.textContent = works.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// Affichage des boutons par catégories //

// Récupération du tableau des catégories //
async function getCategorys() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
}

async function displayButtonsCategorys() {
    const categorys = await getCategorys();
    categorys.forEach(category => {
        const btn = document.createElement("button")
        btn.textContent = category.name.toUpperCase();
        btn.id = category.id;
        filters.appendChild(btn);
    });
}

// Filtrage au clic sur le bouton par catégories //

async function filterCategory() {
    const images = await getWorks();
    console.log(images);
    const buttons = document.querySelectorAll(".filters button")
    buttons.forEach(button => {
        button.addEventListener("click", (e) => {
            const btnId = e.target.id;
            if (btnId !== "0") {
                const buttonsTriCategory = images.filter((caption) => {
                    return caption.categoryId == btnId
                });
                affichageWorks(buttonsTriCategory);
            } else {
                affichageWorks(images);
            }
            console.log(btnId);
        })
    });
}

// Appeler les fonctions après le chargement de la page
document.addEventListener("DOMContentLoaded", async () => {
    await displayButtonsCategorys();
    await affichageWorks(await getWorks()); // Afficher toutes les œuvres par défaut
    await filterCategory();
});
   




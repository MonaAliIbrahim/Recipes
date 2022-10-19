$(document).ready(function() {
  // Handle Loading Screen
  $('.loading').css({'animation': 'loadingHide 2s'}).fadeOut(2000, function() {
      $('body').css('overflow', 'visible');
  });
}); 

let navItems = document.querySelectorAll('#homeNavbar .nav-link'),
queryParam = 'steak';

getRecipe(queryParam);

for(var i = 0; i < navItems.length; i++) {
  navItems[i].addEventListener('click', function(e) {
    // Update Active Nav Link
    for(var j = 0; j < navItems.length; j++) {
      if(navItems[j] !== e.target) {
        navItems[j].classList.remove('active');
      }else {
        navItems[j].classList.add('active');
      }
    }
    // Call Request
    queryParam = e.target.innerHTML;
    getRecipe(queryParam);
  });
}

function getRecipe(searchText) {
  var httpRequest = new XMLHttpRequest();
  recipes = [];
  httpRequest.open('GET',`https://forkify-api.herokuapp.com/api/search?q=${searchText}`);
  httpRequest.send();
  httpRequest.addEventListener('readystatechange', function() {
    if(httpRequest.readyState === 4 && httpRequest.status === 200) {
      recipes = JSON.parse(httpRequest.response).recipes;
      displayCards();
    }
  });
}

function displayCards() {
  var recepiesContainer = document.getElementById('recepies'),
    title = document.getElementsByClassName('section-title')[0];
    cards = '';
  for(var i = 0; i < recipes.length; i++) {
  cards += 
    `<div class="col-sm-6 col-md-4">
      <div class="card text-center h-100" id="${recipes[i].recipe_id}">
        <div class="img-container">
          <img src="${recipes[i].image_url}" class="card-img-top" alt="Recipe Image">
        </div>
        <div class="card-body my-3">
          <h5 class="card-title mb-3">${recipes[i].title}</h5>
          <a href="${recipes[i].source_url}" target="_blank" class="btn btn-primary m-1">Source</a>
          <button class="btn btn-danger m-1" data-bs-toggle="modal" 
                  onclick="getRecepieDetails(${recipes[i].recipe_id})" data-bs-target="#detailsModal">Details</button>
        </div>
      </div>
    </div>`
  }
  title.innerHTML = `${queryParam} recepies`;
  recepiesContainer.innerHTML = cards;
}

function getRecepieDetails(id) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.open('GET',`https://forkify-api.herokuapp.com/api/get?rId=${id}`);
  httpRequest.send();
  httpRequest.addEventListener('readystatechange', function() {
    if(httpRequest.readyState === 4 && httpRequest.status === 200) {
      recipeDetails = JSON.parse(httpRequest.response).recipe;
      displayDetailsModal(recipeDetails);
    }
  });
}

function displayDetailsModal(recipe) {
  let ingredients = '',
  modalContent = `
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="modalLabel">${recipe.title}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <img src="${recipe.image_url}" alt="${recipe.title} Image" class="img-fluid d-block m-auto mb-3" height="150px"/>
        <h6>Ingredients:</h6>
        <ul id="ingredients"></ul>
        <h6>Publisher: 
          <a href="${recipe.publisher_url}" target="_blank">
            ${recipe.publisher}
          </a>
        </h6>
        <h6>Socila Rank: 
          ${String(recipe.social_rank).substring(0,5)}
        </h6>
      </div>
    </div>`;

  for(let i = 0; i < recipe.ingredients.length; i++) {
    ingredients += `<li>${recipe.ingredients[i]}</li>`;
  }

  document.querySelector('#detailsModal > div').innerHTML = modalContent;
  document.querySelector('#ingredients').innerHTML = ingredients;
}
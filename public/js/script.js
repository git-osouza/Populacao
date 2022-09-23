// Estado da aplicação (state)
let tabCountries = null;
let tabFavorites = null;

let allCountries = [];
let favotiteCountries = [];

let countCountries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites = 0;

let numberFormat = null;

window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');
  countCountries = document.querySelector('#countCountries');
  countFavorites = document.querySelector('#countFavorites');
  totalPopulationList = document.querySelector('#totalPopulationList');
  totalPopulationFavorites = document.querySelector('#totalPopulationFavorites');

  numberFormat = Intl.NumberFormat('pt-BR');
  fetchCountries();

});

//Chamando a API Countries
async function fetchCountries() {
  const res = await fetch('https://restcountries.com/v2/all');
  const json = await res.json();

  //Montando um novo objeto com map e trazendo apenas os itens que preciso.
  allCountries = json.map(country => {
    const { numericCode, translations, population, flag } = country;
    
    return {
      id: numericCode,
      name: translations.pt,
      population,
      formattedPopulation: formatNumber(population),
      flag
    };
  });
  

  render();
}

function render () {
  renderCountryList();
  renderFavorites();
  renderSummary();
  handleCountryButtons();
}

function renderCountryList(){
  let countriesHTML = '<div>';

  allCountries.forEach(country => {
    const { name, flag, id, population, formattedPopulation } = country;

    const countryHTML =  `
        <div class='country'>
          <div>
            <a id= "${id}" class="waves-effect waves-light btn">+</a>
          </div>
          <div>
            <img src="${flag}" alt="${name}">
          </div>
          <div>
            <ul>
              <li>${name}</li> 
              <li>${formattedPopulation}</li> 
            </ul>
          </div>
        </div>
    `;

    countriesHTML += countryHTML;
  });

  countriesHTML += '</div>';

  tabCountries.innerHTML = countriesHTML;
}

function renderFavorites(){
  let favoritesHTML = '<div>'

  favotiteCountries.forEach(country =>{
    const { name, id, population, flag , formattedPopulation} = country;

    const favoriteCountryHTML = `
        <div class='country'>
          <div>
            <a id= "${id}" class="waves-effect waves-light btn red darken-4">-</a>
          </div>
          <div>
            <img src="${flag}" alt="${name}">
          </div>
          <div>
            <ul>
              <li>${name}</li> 
              <li>${formattedPopulation}</li> 
            </ul>
          </div>
        </div>
    `;
    favoritesHTML += favoriteCountryHTML;
  });
    
  favoritesHTML += '</div>';
  tabFavorites.innerHTML = favoritesHTML;
}

function renderSummary(){
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favotiteCountries.length;

  const totalPopulatiion = allCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);
  totalPopulationList.textContent = formatNumber(totalPopulatiion);

  const totalFavorites = favotiteCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);
  totalPopulationFavorites.textContent = formatNumber(totalFavorites);  
}

function handleCountryButtons(){
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoritesButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

  countryButtons.forEach(button => {
    button.addEventListener('click', () => addToFavorites(button.id));
  })

  favoritesButtons.forEach(button => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  })
}
function addToFavorites(id){
  const countryToAdd = allCountries.find(country => country.id === id);
  favotiteCountries = [...favotiteCountries, countryToAdd];

  favotiteCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  allCountries = allCountries.filter(country => country.id !== id);

  render();
}
function removeFromFavorites(id){
  const countryToRemove = favotiteCountries.find(country => country.id === id);
  allCountries = [...allCountries, countryToRemove];

  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  favotiteCountries = favotiteCountries.filter(country => country.id !== id);
  render();
}

function formatNumber(number){
  return numberFormat.format(number);
}
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries} from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputSeach: document.querySelector("#seach-box"),
    countryList: document.querySelector(".country-list"),
    countryInfo: document.querySelector(".country-info"),
   
};
refs.input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(event) {
    event.preventDefault();
    const searchQuery = event.target.value.trim();
  
    if (searchQuery) {
      fetchCountries(searchQuery)
        .then(response => procesResponse(response))
        .catch(() => Notify.failure('Oops, there is no country with that name'));
    } else {
      cleanMarkup();
    }
  }
  function procesResponse(response) {
    response.length < 2 && createCartInfo(response);
    response.length < 11 && response.length > 1 && createList(response);
    response.length > 10 &&
      Notify.info('Too many matches found. Please enter a more specific name.');
  }
  
  function createList(response) {
    cleanMarkup();
    let markup = response.map(({ name, flags: { svg } }) => {
      return `
        <li class="country-list__item">
          <img class="country-list__flag" src="${svg}" alt="Flag of mp${name}"/>
          <p class="country-list__name">${name}</p>
        </li>`;
    });
    refs.countryList.insertAdjacentHTML('beforeend', markup.join(''));
  }
  
  function createCartInfo(response) {
    cleanMarkup();
    let markup = response.map(
      ({ name, capital, population, flags: { svg }, languages }) => {
        return `
          <ul class="country-info__list">
            <li class="country-info__item">
              <img class="country-info__flag" src='${svg}' alt='flag' />
              <span class="country-info__name">${name}</span>
            </li>
            <li class="country-info__item">
              <h2 class="country-info__title">Capital:</h2><p class="country-info__text">${capital}</p>
            </li>
            <li class="country-info__item">
              <h2 class="country-info__title">Population:</h2><p class="country-info__text">${population}</p>
            </li>
            <li class="country-info__item">
              <h2 class="country-info__title">Languages:</h2><p class="country-info__text">${languages.map(
                language => {
                  return language.name;
                }
              )}</p>
            </li>
          </ul>`;
      }
    );
    refs.countryInfo.innerHTML = markup;
  }
  
  function cleanMarkup() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
  }
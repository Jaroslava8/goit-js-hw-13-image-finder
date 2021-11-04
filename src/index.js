import ApiService from './apiService.js';
import cardTmpl from './template.hbs';
// import * as _ from "lodash";
import './styles.css';
import * as PNotify from '@pnotify/core';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/core/dist/BrightTheme.css';
const inputNotice = new PNotify.Stack({
  dir1: 'up',
});

const container = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('[data-action="load-more"]');

const apiService = new ApiService();

window.addEventListener('keyup', onInput);
loadMoreBtn.addEventListener('click', onLoadMore);

function onInput(e) {
  if (e.which > 12) {
    e.preventDefault();
    apiService.query = e.target.value;
    if (apiService.query === '') {
      return;
    }
    apiService.resetPage();
    apiService
      .fetchPictures()
      .then(data => {
        clearContainer();
        container.insertAdjacentHTML('beforeend', cardTmpl(data));
        loadMoreBtn.disabled = false;
        if (data.length === 0) {
          PNotify.notice({
            text: 'Unfortunately no matches have been found. Please try again',
            stack: inputNotice,
            modules: new Map([...PNotify.defaultModules, [PNotifyMobile, {}]]),
          });
        }
      })
      .catch(onTheError);
  }
}
function onTheError(typeInfo, text) {
  container.innerHTML = '';
  PNotify.notice({
    text: 'No matches found!',
    delay: 2000,
    color: 'red',
  });
}

function onLoadMore() {
  apiService.fetchPictures().then(data => {
    container.insertAdjacentHTML('beforeend', cardTmpl(data));
    scroll();
  });
}

function clearContainer() {
  container.innerHTML = '';
  inputNotice.close(true);
}

function scroll() {
  let scrollPhotos = document.querySelectorAll('.galleryList');

  scrollPhotos[scrollPhotos.length - (apiService.perPage - 1)].scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

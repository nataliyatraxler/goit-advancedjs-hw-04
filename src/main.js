import { fetchImages } from './js/pixabay-api.js'; // Імпорт функції з оновленим axios
import { displayImages, clearGallery } from './js/render-functions.js'; // Імпорт функцій для рендерингу та очищення галереї
import iziToast from 'izitoast'; // Імпорт iziToast для повідомлень
import 'izitoast/dist/css/iziToast.min.css'; // Підключення стилів iziToast
import SimpleLightbox from 'simplelightbox';

let currentPage = 1;
let currentQuery = '';
let totalHits = 0; // Для збереження загальної кількості результатів
let loadedHits = 0; // Для відстеження кількості завантажених результатів
let lightbox;

const loadMoreButton = document.createElement('button');
loadMoreButton.textContent = 'Load more';
loadMoreButton.style.display = 'none';
loadMoreButton.classList.add('load-more-btn');
document.body.appendChild(loadMoreButton);

loadMoreButton.addEventListener('click', async function () {
  currentPage += 1;
  const { images } = await fetchImages(currentQuery, currentPage);

  if (images.length > 0) {
    displayImages(images);
    loadedHits += images.length; // Оновлюємо кількість завантажених результатів
    lightbox.refresh();

    if (loadedHits >= totalHits) { // Якщо всі результати завантажені
      loadMoreButton.style.display = 'none'; // Приховуємо кнопку
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  }
});

const loader = document.createElement('div');
loader.classList.add('loader');
loader.innerHTML = '<div class="lds-dual-ring"></div>';
document.body.appendChild(loader);
loader.style.display = 'none';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('search-form');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const queryInput = document.getElementById('search-input');
    const query = queryInput.value.trim();

    if (query === '') {
      iziToast.error({
        title: 'Error',
        message: 'Please enter a valid search query!',
      });
      return;
    }

    clearGallery();
    currentPage = 1;
    currentQuery = query;
    loader.style.display = 'block';

    try {
      const { images, totalHits: hits } = await fetchImages(query, currentPage); // Отримуємо загальну кількість результатів
      totalHits = hits; // Зберігаємо загальну кількість результатів
      loadedHits = images.length; // Встановлюємо кількість завантажених результатів

      if (images.length > 0) {
        displayImages(images);
        lightbox = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionDelay: 250,
        });

        if (loadedHits < totalHits) { // Якщо є ще результати для завантаження
          loadMoreButton.style.display = 'block';
        } else {
          loadMoreButton.style.display = 'none'; // Якщо всі результати завантажені
          iziToast.info({
            title: 'Info',
            message: "We're sorry, but you've reached the end of search results.",
          });
        }
      } else {
        iziToast.error({
          title: 'Error',
          message: 'Sorry, no images matching your search query. Please try again!',
        });
        loadMoreButton.style.display = 'none';
      }
    } catch (error) {
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong. Please try again later.',
      });
      console.error('Error:', error);
    } finally {
      loader.style.display = 'none';
      queryInput.value = '';
    }
  });
});

loadMoreButton.addEventListener('click', async function () {
  currentPage += 1;
  const { images } = await fetchImages(currentQuery, currentPage);

  if (images.length > 0) {
    const gallery = document.querySelector('.gallery');
    
    // Отримуємо висоту однієї картки перед тим, як додати нові зображення
    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();

    displayImages(images); // Додаємо нові зображення
    loadedHits += images.length;
    lightbox.refresh(); // Оновлюємо SimpleLightbox

    // Плавне прокручування на дві висоти картки галереї
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth', // Плавна прокрутка
    });

    if (loadedHits >= totalHits) {
      loadMoreButton.style.display = 'none';
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  }
});


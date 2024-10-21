import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export function displayImages(images) {
  const gallery = document.getElementById('image-gallery');

  // Використання map() для генерації HTML для всіх нових зображень
  const newImagesHTML = images.map(image => `
      <a href="${image.largeImageURL}" class="gallery-item">
        <img src="${image.webformatURL}" alt="${image.tags}">
        <div class="image-info">
          <p><strong>Downloads:</strong> ${image.downloads}</p>
          <p><strong>Likes:</strong> ${image.likes}</p>
          <p><strong>Views:</strong> ${image.views}</p>
        </div>
      </a>
    `).join(''); // Об'єднуємо всі результати в один рядок HTML

  // Вставляємо всю розмітку за один раз у галерею, додаючи до вже існуючих зображень
  gallery.insertAdjacentHTML('beforeend', newImagesHTML);
}

export function clearGallery() {
  const gallery = document.getElementById('image-gallery');
  gallery.innerHTML = ''; // Очищення вмісту галереї
}

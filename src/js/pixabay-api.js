import axios from 'axios';

const API_KEY = '46595467-38d51347a919535f7c3759bfb';

export async function fetchImages(query, page = 1, perPage = 15) {
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await axios.get(URL); // Запит до API через axios
    return {
      images: response.data.hits,
      totalHits: response.data.totalHits // Повертаємо загальну кількість результатів
    };
  } catch (error) {
    console.error('Error:', error);
    return { images: [], totalHits: 0 }; // У разі помилки повертаємо порожні результати
  }
}

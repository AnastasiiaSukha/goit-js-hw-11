
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiService from './api_service';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


let query = '';



const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')

};

let SimpleGallery = new SimpleLightbox('.photo-card a',{

});

const imagesApiService = new ApiService();

refs.searchForm.addEventListener('submit', onSearch);
// refs.loadMoreBtn.addEventListener('click', onLoadMore);


function onSearch(e) {
    e.preventDefault();

  imagesApiService.searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  const search = e.currentTarget.elements.searchQuery.value.trim();
  
  if (!search) {
    Notify.failure('Please write your option', {
      clickToClose: true,
      timeout: 2000,
    });
    return;
  }

    query = imagesApiService.query;
    clearGallery();

    imagesApiService.resetPage();

    GalleryFetchAndRender().then(result => {
    if (result) {
      Notify.success(`Hooray! We found ${result} images.`, {
        clickToClose: true,
        timeout: 3000,
      });
    }

    refs.searchForm.reset();
  });
};


async function GalleryFetchAndRender() {
  try {
    imagesApiService.searchQuery = query;
      const res = await imagesApiService.fetchImages(query);
      SimpleGallery.refresh();

    if (res.total === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
        clickToClose: true,
      });

      clearGallery();
    } else {
      renderGallery(res.hits);
      return res.totalHits;
    }
  } catch (error) {
      console.log(error);
    Notify.info("We're sorry, but you've reached the end of search results.", {
      clickToClose: true,
      timeout: 3000,
    });
  }
}

function renderGallery(hits) {
  const imageCard = hits
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
        <a class="photo-card_link" href="${largeImageURL}">
         <img class="card_image" src="${webformatURL}" alt="${tags} loading="lazy"/></a>
           <div class="info">
             <p class="info-item">
               <b>Likes ${likes}</b>
            </p>
              <p class="info-item">
                 <b>Views ${views}</b>
              </p>
                <p class="info-item">
                  <b>Comments ${comments}</b>
                </p>
                <p class="info-item">
                  <b>Downloads ${downloads}</b>
                </p>
              </div>
        </div>`,
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', imageCard);
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

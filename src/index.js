
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiService from './js/api_service';
import LoadMoreBtn from './js/load-more-btn';



const refs =  {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};


let query = '';

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});


const imagesApiService = new ApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);


function onSearch(e) {
  e.preventDefault();

  const search = e.currentTarget.elements.searchQuery.value.trim();
 
  if (search === '') {
    Notify.failure('Please write your option', {
      clickToClose: true,
      timeout: 2000,
    });
    return;
  };


  query = search;

  imagesApiService.resetPage();
  clearGallery();
  
  galleryFetchAndRender().then(images => {
    console.log(images)
    if (images){
      Notify.success(`Hooray! We found ${images} images.`, {
        clickToClose: true,
        timeout: 3000,
      })
    }
  })
  loadMoreBtn.show();
  refs.searchForm.reset();
};
  

async function galleryFetchAndRender() {
  try {
    imagesApiService.searchQuery = query;
    const response = await imagesApiService.fetchImages(query);

    if (response.total === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
        clickToClose: true,
      });

      clearGallery();
    }
    else {
      renderGallery(response.hits);
      
      return response.totalHits;
    }
  }
  catch (error) {
    console.log(error)
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
          `<div class="photo-card" id="photo">
        <a class="photo-card_link" href="${largeImageURL}">
         <img class="card-image" src="${webformatURL}" alt="${tags} loading="lazy"/></a>
           <div class="card-info">
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
    
    
  function onLoadMore(e) {
   e.preventDefault();
    galleryFetchAndRender()
      .then((response) => {
        renderGallery(response);
      });
}
      
function clearGallery() {
  refs.gallery.innerHTML = '';
}


  
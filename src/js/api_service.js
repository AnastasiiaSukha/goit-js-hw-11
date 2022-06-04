const { default: axios } = require('axios');

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '27785524-47e8f859613f7a00e6f2241aa';

export default class ApiService{
    constructor() {
        this.query = '';
        this.page = 1;
    }


    fetchImages() {

    const url= `${BASE_URL}?key=${KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    return axios
      .get(url)
          .then(({ data }) => {
        this.incrementPage();

           return data;
      })
      .catch(error => console.log(error));
    };
    
    
    incrementPage() {
        this.page += 1;
    };

    resetPage() {
        this.page = 1;
    };

    get query() {
        return this.searchQuery;
    };

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
};

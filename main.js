let emptyResults = document.getElementById('empty-results')
let results = document.getElementById('results')
let search = document.getElementById('search')
// let searchBtn = document.getElementById('search-btn')
let resultsListContainer = document.querySelector('.result-list-popup')
let oneMovieResult = document.querySelector('.result-container')
let moviePoster

oneMovieResult.style.display = 'none'

// searchBtn.addEventListener('click', loadMovies)

search.addEventListener('keyup', findMovies)

function loadMovies(searchTerm) {
    fetch(`http://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=17406216`)
    .then(res => res.json())
    .then(dataBase => {
      displayMoviesList(dataBase.Search);
      resultsListContainer.classList.remove('popup-no-response')
      determinePopupsheight(dataBase.Search)
      console.log(dataBase.Response)
    })
    .catch(error => {
      resultsListContainer.textContent = `Loading...`
      resultsListContainer.classList.add('popup-no-response')
      document.querySelector(".result-list-popup").style.height = '100%';
      resultsListContainer.classList.remove('show-results-list')
    })
}

function determineLoadingMessage() {
  resultsListContainer.classList.add('popup-no-response')

  setTimeout(() => {
    resultsListContainer.textContent = `Sorry, maybe the title spelling is not correct`
  }, 10000);

  setTimeout(function () {
    resultsListContainer.textContent = `Pardon us, but server took too long to respond, please try again later`
  }, 60000);
}

function determinePopupsheight(data) {
  resultsListContainer.classList.remove('popup-no-response')
    if (data.length === 1 || data.length === 0) {
        document.querySelector(".result-list-popup").style.height = '100%';
    }
    
    if (data.length === 2) {
        document.querySelector(".result-list-popup").style.height = '200%';
    }
    if (data.length === 3) {
        document.querySelector(".result-list-popup").style.height = '300%';
    }
    if (data.length >= 4) {
        document.querySelector(".result-list-popup").style.height = '400%';
    }
    else {
      resultsListContainer.classList.add('popup-no-response')
    }
    console.log(data.length)
}

function findMovies() {
    let searchTerm = search.value.trim()
    if (searchTerm.length > 0) {
        resultsListContainer.classList.add('show-results-list')
        loadMovies(searchTerm)
    }else {
        resultsListContainer.classList.remove('show-results-list')
    }
}

function displayMoviesList(movies) {
    resultsListContainer.innerHTML = '';
    for (let id = 0; id < movies.length; id++) {
        let moviesListItem = document.createElement('div');
        moviesListItem.dataset.id = movies[id].imdbID;
        moviesListItem.classList.add('result-item')

        if(movies[id].Poster != "N/A"){
            moviePoster = movies[id].Poster
        } 
        else {
            moviePoster = '/images/image_not_found.jpeg';
         }

            moviesListItem.innerHTML = `
               <div class="result-item-thumbnail">
                  <img src='${moviePoster}'
                  class='cover' alt="cover">
               </div>
              <div class="result-item-info">
                   <h3>${movies[id].Title}</h3>
                   <p>${movies[id].Year}</p>
                </div>
            `
            resultsListContainer.appendChild(moviesListItem)
    }
    loadMovieDetails()
}

function loadMovieDetails() {
    const searchListMovies = resultsListContainer.querySelectorAll('.result-item')
    
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            resultsListContainer.classList.remove('show-results-list')
            search.value = ''
            emptyResults.style.display = 'none'
            oneMovieResult.style.display = 'block'
            // API call
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=17406216`);
            const movieDetails = await result.json()
            displayMovieDetails(movieDetails)
        })
    });
}

function displayMovieDetails(details) {
    oneMovieResult.innerHTML = `
        <div class="result-grid" id="result-grid">
            <!-- movie information here -->
            <div class="movie-poster">
              <img src="${details.Poster === 'N/A' ? 'images/image_not_found.jpeg' : details.Poster }" alt="currently cover is not available">
            </div>
            <div class="movie-info">
              <div class="movie-title-div">
              <h2 class="movie-title">
                ${details.Title}
              </h2>
              </div>
              <ul class="movie-misc-info">
                <li class="year">
                  <span>
                    Year :
                  </span>${details.Year}
                </li>
                <li class="ratings">
                  <span>
                    Ratings:
                  </span>
                  ${details.Rated}
                </li>
                <li class="released">
                  <span>
                    Release Date:
                  </span>
                  ${details.Released}
                </li>
              </ul>
              <p class="genre"><b>Genre: </b>${details.Genre}</p>
              <p class="writer"><b>Writer: </b>${details.Writer}</p>
              <p class="actors">
                <b>Actors:</b>
                ${details.Actors}
              </p>
              <p class="plot">
                <b>Plot:</b>
                ${details.Plot}
              </p>
              <p class="language">
                <b>language:</b>
                ${details.Language}
              </p>
              <p class="awards">
                <b>
                  <i class="fas fa-award"></i>
                </b>
                ${details.Awards}
              </p>
            </div>
          </div>
    `
}
const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", async function () {
  try {
    const inputKeyword = document.querySelector(".input-keyword").value;
    const movies = await getMovies(inputKeyword);
    updateUI(movies);
  } catch (err) {
    alert(err);
  }
});

function getMovies(keyword) {
  return fetch("http://www.omdbapi.com/?apikey=4ebbde0c&s=" + keyword)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

function updateUI(movies) {
  let cards = "";
  movies.forEach((m) => (cards += showCards(m)));
  const movieContainer = document.querySelector(".movie-container");
  movieContainer.innerHTML = cards;
}

// event binding
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modal-detail-button")) {
    const imdbid = e.target.dataset.imdbid;
    const movieDetail = await getMovieDetail(imdbid);
    updateUIDetail(movieDetail);
  }
});

function getMovieDetail(imdbid) {
  return fetch("http://www.omdbapi.com/?apikey=4ebbde0c&i=" + imdbid)
    .then((response) => response.json())
    .then((response) => response);
}

function updateUIDetail(movie) {
  const movieDetail = showMovieDetails(movie);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = movieDetail;
}

function showCards(m) {
  return ` <div class="col-md-4 my-3">
                <div class="card" style="width: 18rem;">
                    <img src="${m.Poster}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${m.Title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                        <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#movieDetailsModal" data-imdbid="${m.imdbID}">Show Details</a>
                    </div>
                </div>
            </div>`;
}

function showMovieDetails(i) {
  return `
                      <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-3">
                                <img src="${i.Poster}" class="img-fluid">
                            </div>
                            <div class="col-md">
                                <ul class="list-group">
                                    <li class="list-group-item"><h4>${i.Title} (${i.Year})</h4></li>
                                    <li class="list-group-item"><strong>Genre : </strong>${i.Genre}</li>
                                    <li class="list-group-item"><strong>Duration : </strong>${i.Runtime}</li>
                                    <li class="list-group-item"><strong>Rating Imdb : </strong>${i.imdbRating}/10.0</li>
                                    <li class="list-group-item"><strong>Votes : </strong>${i.imdbVotes}</li>
                                    <li class="list-group-item"><strong>Director : </strong>${i.Director}</li>
                                    <li class="list-group-item"><strong>Actors : </strong>${i.Actors}</li>
                                    <li class="list-group-item"><strong>Synopsis : </strong>${i.Plot}</li>     
                                </ul>
                            </div>
                        </div>
                    </div>
          `;
}

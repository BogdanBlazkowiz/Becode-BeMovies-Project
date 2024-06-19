const authKey =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTBjYzg2ZTM5MWMyMjVlM2Q3ZGY2MjFmMDk1OWYzMiIsInN1YiI6IjY2NzJkMmRkNTY0YzE0YzI4MWEzOWY0YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X45G_3hcrrZbyOxpKvMgOn6YnE4ldnXWLrOGe_XuWIw";

//js simple fetch by search keyword
let searchButton = document.querySelector(".search-box-input-submit");
    searchButton.addEventListener("click", () => {
let searchKeyword = document.querySelector(".search-box-input").value;
    console.log(searchKeyword);

    searchMovieByKeyword(searchKeyword);
});

async function searchMovieByKeyword(keyword) {
const options = {
    method: "GET",
    headers: {
    accept: "application/json",
    Authorization: `${authKey}`,
    },
};

try {
    // Fetch the data from the URL
    const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=en-US&page=1`,
    options
    );

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
    throw new Error("Network response was not ok");
    }

    // Parse the response as JSON
    const data = await response.json();

    // Log the data
    console.log(data);
    displayDataSwiper(data);
} catch (error) {
    // Handle any errors
    console.error("There has been a problem with your fetch operation:", error);
}
}

function displayDataSwiper(data) {
  // Get the swiper wrapper element
    const swiperWrapper = document.querySelector(".swiper1 .swiper-wrapper");

    // Clear the current slides
    swiperWrapper.innerHTML = "";

    // Iterate through the fetched movie data
    data.results.forEach((movie) => {
    // Create a new swiper slide
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

    // Create the movie poster element
    const moviePoster = document.createElement("img");
    moviePoster.classList.add("movie-poster");
    moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    moviePoster.alt = movie.title;

    // Create the hover preview element
    const hoverPreview = document.createElement("div");
    hoverPreview.classList.add("hover-preview");

    // Create the title element
    const title = document.createElement("span");
    title.classList.add("title");
    title.textContent = movie.title;

    // Create the year element
    const year = document.createElement("span");
    year.classList.add("year");
    year.textContent = new Date(movie.release_date).getFullYear();

    // Create the genres element
    const genres = document.createElement("span");
    genres.classList.add("genres");
    genres.textContent = movie.genre_ids
    .map((id) => getGenreName(id))
    .join(" / ");

    // Create the star element
    const star = document.createElement("img");
    star.src = "img/star.svg";
    star.alt = "Star";
    star.classList.add("star");

    // Create the score element
    const score = document.createElement("span");
    score.classList.add("score");
    score.textContent = movie.vote_average.toFixed(1);

    // Append all elements to the hover preview
    hoverPreview.appendChild(title);
    hoverPreview.appendChild(year);
    hoverPreview.appendChild(genres);
    hoverPreview.appendChild(star);
    hoverPreview.appendChild(score);

    // Append the movie poster and hover preview to the slide
    slide.appendChild(moviePoster);
    slide.appendChild(hoverPreview);

    // Append the slide to the swiper wrapper
    swiperWrapper.appendChild(slide);
    });

    // Update the swiper instance
    const swiper = new Swiper(".swiper1", {
        slidesPerView: 4,
        spaceBetween: 5,
        pagination: {
        el: ".swiper-pagination",
        clickable: true,
        },
        navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        },
    });
}

// Function to get genre names from IDs (you need to define this based on your genre data)
function getGenreName(id) {
    const genres = {
        14: "Fantasy",
        10751: "Family",
        18: "Drama",
        53: "Thriller",
        16: "Animation",
        28: "Action",
        10749: "Romance",
    // Add more genre mappings as needed
    };

    return genres[id] || "Unknown";
}

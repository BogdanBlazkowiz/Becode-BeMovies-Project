const authKey =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTBjYzg2ZTM5MWMyMjVlM2Q3ZGY2MjFmMDk1OWYzMiIsInN1YiI6IjY2NzJkMmRkNTY0YzE0YzI4MWEzOWY0YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X45G_3hcrrZbyOxpKvMgOn6YnE4ldnXWLrOGe_XuWIw";

document.addEventListener("DOMContentLoaded", () => {
  // Set default genre to Comedy and load its movies
  loadMoviesByGenre("comedy");

  // Add event listeners to genre list items
  const genreListItems = document.querySelectorAll(".genres-container li div");
  genreListItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Remove 'selected' class from all items
      genreListItems.forEach((i) => i.classList.remove("selected"));
      // Add 'selected' class to the clicked item
      item.classList.add("selected");
      // Fetch and display movies for the selected genre
      const genreId = item.querySelector("span").id;
      loadMoviesByGenre(genreId);
    });
  });
});

// Function to fetch and display movies based on search keyword
async function searchMovieByKeyword(keyword) {

    let resultsWord = document.querySelector(".results-container span");
    let mainGrid = document.querySelector("main");
    let searchInput = document.querySelector(".search-box-input");
    let resultsContainer = document.querySelector(".results-container");
    
    if(keyword === null || keyword === undefined || keyword.trim() === '') {
            searchInput.placeholder = "Please enter a word";
            mainGrid.gridTemplateRows = "44px 380px 519px";
            resultsContainer.style.display = "none";
        return;
    }

  resultsWord.innerText = `Results for "${keyword}"`;
  mainGrid.gridTemplateRows = "44px 380px 380px 519px";


  resultsContainer.style.display = "grid";

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `${authKey}`,
    },
  };

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(keyword)}&include_adult=false&language=en-US&page=1`,
      options
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    displayMovies(data.results, ".swiper1");
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

// Function to fetch and display the latest movies
async function fetchLatestMovies() {
  let currentDate = new Date().toISOString().slice(0, 10);
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `${authKey}`,
    },
  };

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_date.lte=${currentDate}&sort_by=primary_release_date.desc&vote_count.gte=30`,
      options
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    displayMovies(data.results, ".swiper2"); // Could wrap the data in an array if result is only one movie
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

//Fetch by genre
async function loadMoviesByGenre(genre) {
  const genreId = getGenreId(genre);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `${authKey}`,
    },
  };

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}`,
      options
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    displayMovies(data.results, ".swiper3");
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function getGenreId(genre) {
  const genres = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    scienceFiction: 878,
    tvMovie: 10770,
    thriller: 53,
    war: 10752,
    western: 37,
    //Add more as needed
  };

  return genres[genre] || 35; // Default to comedy if genre not found
}

// Function to display movies in the swiper
function displayMovies(movies, swiperSelector) {
  const swiperWrapper = document.querySelector(
    `${swiperSelector} .swiper-wrapper`
  );
  swiperWrapper.innerHTML = "";

  movies.forEach((movie) => {
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");
    slide.dataset.id = movie.id;

    const moviePoster = document.createElement("img");
    moviePoster.classList.add("movie-poster");
    moviePoster.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "img/no-image.png";
    moviePoster.alt = movie.title;

    const hoverPreview = document.createElement("div");
    hoverPreview.classList.add("hover-preview");

    const title = document.createElement("span");
    title.classList.add("title");
    title.textContent = movie.title;

    const year = document.createElement("span");
    year.classList.add("year");
    year.textContent = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : "Unknown";

    const genres = document.createElement("span");
    genres.classList.add("genres");
    genres.textContent = movie.genre_ids
      ? movie.genre_ids.map((id) => getGenreName(id)).join(" / ")
      : "Unknown";

    const star = document.createElement("img");
    star.src = "img/star.svg";
    star.alt = "Star";
    star.classList.add("star");

    const score = document.createElement("span");
    score.classList.add("score");
    score.textContent = movie.vote_average
      ? movie.vote_average.toFixed(1)
      : "N/A";

    hoverPreview.appendChild(title);
    hoverPreview.appendChild(year);
    hoverPreview.appendChild(genres);
    hoverPreview.appendChild(star);
    hoverPreview.appendChild(score);

    slide.appendChild(moviePoster);
    slide.appendChild(hoverPreview);

    swiperWrapper.appendChild(slide);

    slide.addEventListener("click", () => {
      openModal(movie);
    });
  });

  new Swiper(swiperSelector, {
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
        625:{
            slidesPerView:2,
        },
        937.5:{
            slidesPerView:3,
        },
        1250: {
            slidesPerView:4,
        },
    },
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

// Function to get genre names from IDs
function getGenreName(id) {
  const genres = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
    //Add more genre mappings as needed
  };

  return genres[id] || "Unknown";
}

// Function to open modal with movie details
async function openModal(movie) {
  const apiKey = "f90cc86e391c225e3d7df621f0959f32";

  // Replace with your TMDb API key

  // Set up the modal content
  const modal = document.querySelector(".movie-popup");
  modal.querySelector(".movie-poster").src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "img/no-image.png";
  modal.querySelector(".title").textContent = movie.title;
  modal.querySelector(".year").textContent = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "Unknown";
  modal.querySelector(".score span").textContent = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : "N/A";
  modal.querySelector(".genres").textContent = movie.genre_ids
    ? movie.genre_ids.map((id) => getGenreName(id)).join(" / ")
    : "Unknown";
  modal.querySelector(".synopsis").textContent = movie.overview;

  // Fetch cast data
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}`
    );
    const data = await response.json();
    const cast = data.cast;

    // Display cast
    const castContainer = modal.querySelector(".cast-container p");
    castContainer.textContent = cast.map((actor) => actor.name).join(", ") + ".";
  } catch (error) {
    console.error("Error fetching cast data:", error);
  }

  // Show the modal
  modal.classList.remove("hidden");

  // Close modal on close button click
  const closeButton = modal.querySelector(".close-button");
  closeButton.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

// Search button event listener
let searchButton = document.querySelector(".search-box-input-submit");
searchButton.addEventListener("click", () => {
  let searchKeyword = document.querySelector(".search-box-input").value;
  console.log(searchKeyword);
  searchMovieByKeyword(searchKeyword);
});

// Call the function to fetch and display the latest movies
fetchLatestMovies();

//form login and signup
document.addEventListener("DOMContentLoaded", function () {
  // Get elements
  const loginLink = document.querySelectorAll("#login, #login-footer");
  const registerLink = document.querySelectorAll("#register, #register-footer");
  const loginPopup = document.querySelector(".login-popup");
  const registerPopup = document.querySelector(".register-popup");
  const closeButtons = document.querySelectorAll(".register-login-popup img");

  // Function to show the login form
  function showLoginForm() {
    registerPopup.classList.add("hidden");
    loginPopup.classList.remove("hidden");
    document
      .querySelector(".signup-switch-button")
      .classList.remove("currently-in-use");
    document
      .querySelector(".login-switch-button")
      .classList.add("currently-in-use");
  }

  // Function to show the register form
  function showRegisterForm() {
    loginPopup.classList.add("hidden");
    registerPopup.classList.remove("hidden");
    document
      .querySelector(".signup-switch-button")
      .classList.add("currently-in-use");
    document
      .querySelector(".login-switch-button")
      .classList.remove("currently-in-use");
  }

  // Add event listeners to the navbar links
  loginLink.forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        showLoginForm();
    });
  });

  registerLink.forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        showRegisterForm();
    });
  });

  // Add event listeners to switch buttons
  document.querySelectorAll(".signup-switch-button").forEach((button) => {
    button.addEventListener("click", showRegisterForm);
  });

  document.querySelectorAll(".login-switch-button").forEach((button) => {
    button.addEventListener("click", showLoginForm);
  });

  // Add event listeners to close buttons
  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      loginPopup.classList.add("hidden");
      registerPopup.classList.add("hidden");
    });
  });



  // Basic validation and logging for login form
  document
    .querySelector(".login-button")
    .addEventListener("click", function () {
      const username = document.querySelector(".login-popup .username").value;
      const password = document.querySelector(".login-popup .password").value;
      const rememberMe = document.querySelector(
        ".login-popup #remember"
      ).checked;

      if (username && password.length >= 8) {
        const loginData = { username, password, rememberMe };
        console.log("Login Data:", loginData);
        alert("Login successful!");
      } else {
        alert(
          "Please fill in both fields and ensure the password is at least 8 characters long."
        );
      }
    });

  // Basic validation and logging for register form
  document
    .querySelector(".signup-button")
    .addEventListener("click", function () {
      const username = document.querySelector(
        ".register-popup .username"
      ).value;
      const email = document.querySelector(".register-popup .email").value;
      const password = document.querySelector(
        ".register-popup .password"
      ).value;
      const passwordConf = document.querySelector(
        ".register-popup .passwordconf"
      ).value;

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!username) {
        alert("Username is required.");
      } else if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
      } else if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
      } else if (password !== passwordConf) {
        alert("Passwords do not match.");
      } else {
        const registerData = { username, email, password };
        console.log("Sign Up Data:", registerData);
        alert("Registration successful!");
      }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Function to toggle the visibility of the menu
    function toggleMenu(menuWrapper, burger, closeButton) {
        menuWrapper.style.display = 'block';
        burger.style.display = 'none';
        closeButton.style.display = 'block';
    }

    // Function to hide the menu
    function hideMenu(menuWrapper, burger, closeButton) {
        menuWrapper.style.display = 'none';
        burger.style.display = 'block';
        closeButton.style.display = 'none';
    }

    // Function to handle screen size changes
    function handleResize() {
        document.querySelectorAll('.menu-wrapper').forEach(menuWrapper => {
            const burger = menuWrapper.querySelector('.burger');
            const closeButton = menuWrapper.querySelector('.close-icon img');
            const menuList = menuWrapper.querySelector('ul');
            if (window.innerWidth < 1100) {
                burger.style.display = 'block';
                menuList.style.display = 'none';
                closeButton.style.display = 'none';
            } else {
                burger.style.display = 'none';
                menuList.style.display = 'flex'; // Ensure the menu is visible on larger screens
                closeButton.style.display = 'none';
            }
        });
    }

    // Event listener for the burger menu click
    document.querySelectorAll('.burger').forEach(burger => {
        burger.addEventListener('click', function (e) {
            e.stopPropagation();  // Prevent the click event from bubbling up to the document
            const menuWrapper = burger.parentElement.querySelector('ul');
            const closeButton = burger.parentElement.querySelector('.close-icon img');
            toggleMenu(menuWrapper, burger, closeButton);
        });
    });

    // Event listener for the close button click
    document.querySelectorAll('.close-icon img').forEach(closeButton => {
        closeButton.addEventListener('click', function (e) {
            e.stopPropagation();  // Prevent the click event from bubbling up to the document
            const menuWrapper = closeButton.parentElement.parentElement.querySelector('ul');
            const burger = closeButton.parentElement.parentElement.querySelector('.burger');
            hideMenu(menuWrapper, burger, closeButton);
        });
    });

    // Initial setup and event listener for window resize
    window.addEventListener('resize', handleResize);
    handleResize();
});

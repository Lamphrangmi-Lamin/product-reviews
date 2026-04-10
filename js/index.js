import reviews from "../data/product-reviews.json" with { type: "json" };
import users from "../data/users.json" with { type: "json" };
const cardsContainer = document.querySelector(".cards-container");
const remainReviewsContainer = document.getElementById("remaining-reviews");
const showMoreBtn = document.getElementById("show-more-btn");

// State
let sortedReviews = [...reviews].sort(
  (a, b) => new Date(b.created_at) - new Date(a.created_at),
);

// Pagination
let visibleReviews = [];

const mql = window.matchMedia("(width <= 768px)");

let visibleCount = mql.matches ? 10 : 12;

// initial value of pageSize as soon as the page/app loads
let pageSize = mql.matches ? 10 : 12;

let activeRatingFilter = null;
let filteredReviews = getFilteredReviews();

mql.addEventListener("change", (event) => {
  pageSize = event.matches ? 10 : 12;
  visibleCount = Math.min(filteredReviews.length, pageSize);
  pagination(visibleCount);
});

function pagination(count) {
  visibleReviews = filteredReviews.slice(0, count);
  cardsContainer.innerHTML = cardHTML(visibleReviews);
  remainReviewsContainer.innerText = `${filteredReviews.length - visibleReviews.length}`;
}
pagination(visibleCount);

// Show more button
showMoreBtn.addEventListener("click", () => {
  visibleCount = Math.min(visibleCount + pageSize, filteredReviews.length);
  pagination(visibleCount);
});

// Date formatting helper function
function formatDate(dateInput) {
  const date = new Date(dateInput + "T00:00:00");
  const newDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return newDate;
}

// Render rating bar helper function
function renderRating(rating) {
  let ratingMarkup = ``;
  const totalStars = 5;
  let fullStars = Number(Math.floor(rating));
  const decimalPart = Number((rating % 1).toFixed(1));
  let halfStars = 0;

  // render full stars markup
  for (let i = 0; i < fullStars; i++) {
    ratingMarkup += `<i class="ri-star-fill text-yellow-400 text-xl"></i>`;
  }

  // render half stars markup
  if (decimalPart >= 0.1 && decimalPart <= 0.5) {
    ratingMarkup += `<i class="ri-star-half-fill text-yellow-400 text-xl"></i>`;
    halfStars = 1;
  } else if (decimalPart >= 0.6 && decimalPart <= 0.9) {
    ratingMarkup += `<i class="ri-star-fill text-yellow-400 text-xl"></i>`;
    fullStars += 1;
  }

  const emptyStars = totalStars - fullStars - halfStars;
  // render empty stars markup
  for (let i = 0; i < emptyStars; i++) {
    ratingMarkup += `<i class="ri-star-fill text-gray-200 text-xl"></i>`;
  }

  return ratingMarkup;
}

// Rendering Card Reviews markup
function cardHTML(arrOfReviews) {
  return arrOfReviews
    .map((review) => {
      // Obj reviews variables
      const username = users.find(
        (user) => user.user_id === review.user_id,
      ).name;
      const avatarUrl = users.find(
        (user) => user.user_id === review.user_id,
      ).avatar_url;

      // Rendered Markup
      return `<div class="card-container flex flex-col gap-4">
            <div class="flex gap-4">
              <div class="w-12 h-12">
                <img class="w-12 h-12 object-cover rounded-full" src="${avatarUrl}" alt="avatar">
              </div>
              <div class="review-message-container flex flex-grow justify-between">
                <div class="flex flex-col justify-between">
                  <p class="font-semibold text-neutral-900">${username}</p>
                  <span class="rating-bar">
                    ${renderRating(review.rating)}
                  </span>
                </div>
                <div class="date-n-time">
                  <span class="text-neutral-600 text-xs">${formatDate(review.created_at)}</span>
                </div>
              </div>
            </div>
            <div class="text-neutral-600">
              <p>${review.content}</p>
            </div>
          </div>`;
    })
    .join("");
}

cardsContainer.innerHTML = cardHTML(visibleReviews);

// RATING SUMMARY
// Overall rating
const overallRating = document.getElementById("overallRating");
const averageRatingContainer = document.getElementById("averageRating");

const totalRatings = reviews.reduce(
  (accumulator, review) => accumulator + review.rating,
  0,
);
const averageRating = totalRatings / reviews.length;
const roundedAverage = averageRating.toFixed(1);

overallRating.innerHTML = renderRating(averageRating);
averageRatingContainer.innerText = roundedAverage;

// Rendering total number of reviews
document.getElementById("total-no-reviews").innerText = sortedReviews.length;

// Review Bands
function renderPercent(numberOfStars) {
  let newFilteredReviews = sortedReviews.filter(
    (review) => review.rating == numberOfStars,
  );
  let percentage = (newFilteredReviews.length / sortedReviews.length) * 100;
  let roundedPercent = percentage.toFixed();
  return roundedPercent + "%";
}

const fiveStarsPercent = document.getElementById("fiveStarsPercent");
const fiveStarsBand = document.getElementById("fiveStarsBand");
fiveStarsPercent.innerText = renderPercent(5);
fiveStarsBand.classList.add(`w-[${renderPercent(5)}]`);

const fourStarsPercent = document.getElementById("fourStarsPercent");
const fourStarsBand = document.getElementById("fourStarsBand");
fourStarsPercent.innerText = renderPercent(4);
fourStarsBand.classList.add(`w-[${renderPercent(4)}]`);

const threeStarsPercent = document.getElementById("threeStarsPercent");
const threeStarsBand = document.getElementById("threeStarsBand");
threeStarsPercent.innerText = renderPercent(3);
threeStarsBand.classList.add(`w-[${renderPercent(3)}]`);

const twoStarsBand = document.getElementById("twoStarsBand");
const twoStarsPercent = document.getElementById("twoStarsPercent");
twoStarsPercent.innerText = renderPercent(2);
twoStarsBand.classList.add(`w-[${renderPercent(2)}]`);

const oneStarsBand = document.getElementById("oneStarsBand");
const oneStarsPercent = document.getElementById("oneStarsPercent");
oneStarsPercent.innerText = renderPercent(1);
oneStarsBand.classList.add(`w-[${renderPercent(1)}]`);

const ratingBands = document.querySelectorAll(".ratingBandContainer");
const clearFilterBtn = document.getElementById("clearFilterBtn");
const ratingBandLabels = document.querySelectorAll(".rating-band-label");

function getFilteredReviews() {
  if (activeRatingFilter === null) return sortedReviews;
  return sortedReviews.filter((review) => review.rating === activeRatingFilter);
}

ratingBands.forEach((band) => {
  band.addEventListener("click", () => {
    clearFilterBtn.classList.remove("hidden");
    activeRatingFilter = Number(band.dataset.rating);
    filteredReviews = getFilteredReviews();
    // if filtered array is less than pageSize, set visibleCount to a value equal to that array length
    visibleCount =
      filteredReviews.length < pageSize ? filteredReviews.length : pageSize;
    pagination(visibleCount);

    // active state logic
    ratingBandLabels.forEach(label => {
      label.classList.remove('text-indigo-700');
      label.classList.add('text-neutral-600');
      label.classList.add('hover:text-neutral-900');
    })

    band.querySelector('.rating-band-label').classList.remove('text-neutral-600');
    band.querySelector('.rating-band-label').classList.remove('hover:text-neutral-900');
    band.querySelector('.rating-band-label').classList.remove('text-neutral-600');
    band.querySelector('.rating-band-label').classList.add('text-indigo-700');
  });
});

clearFilterBtn.addEventListener("click", () => {
  clearFilterBtn.classList.add("hidden");
  activeRatingFilter = null;
  filteredReviews = getFilteredReviews();
  pagination(pageSize);
})

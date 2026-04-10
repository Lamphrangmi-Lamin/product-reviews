import reviews from "../data/product-reviews.json" with { type: "json" };
import users from "../data/users.json" with { type: "json" };

// State
let sortedReviews = [...reviews].sort(
  (a, b) => new Date(b.created_at) - new Date(a.created_at),
);

const cardsContainer = document.querySelector(".cards-container");
const remainingReviewsCount = document.getElementById("remaining-reviews");
const showMoreBtn = document.getElementById("show-more-btn");
// Overall rating
const overallRating = document.getElementById("overallRating");
const averageRatingContainer = document.getElementById("averageRating");

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

// RATING SUMMARY
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

let visibleReviews = [];

const mobileMediaQuery = window.matchMedia("(width <= 768px)");

let visibleCount = mobileMediaQuery.matches ? 10 : 12;

// initial value of pageSize as soon as the page/app loads
let pageSize = mobileMediaQuery.matches ? 10 : 12;

let activeRatingFilter = null;
let activeReviews = getFilteredReviews();

// Initial rendering
renderReviewsPage(visibleCount);

mobileMediaQuery.addEventListener("change", (event) => {
  pageSize = event.matches ? 10 : 12;
  visibleCount = resetVisibleCount();
  renderReviewsPage(visibleCount);
});

// Show more button
showMoreBtn.addEventListener("click", () => {
  visibleCount = Math.min(visibleCount + pageSize, activeReviews.length);
  renderReviewsPage(visibleCount);
});

ratingBands.forEach((band) => {
  band.addEventListener("click", () => {
    clearFilterBtn.classList.remove("hidden");
    activeRatingFilter = Number(band.dataset.rating);
    activeReviews = getFilteredReviews();
    visibleCount = resetVisibleCount();
    renderReviewsPage(visibleCount);


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
  activeReviews = getFilteredReviews();
  visibleCount = resetVisibleCount();
  renderReviewsPage(visibleCount);
})

// Rendering Card Reviews markup
function renderReviewCards(arrOfReviews) {
  return arrOfReviews
    .map((review) => {
      // Obj reviews variables
      const username = users.find(
        (user) => user.user_id === review.user_id,
      ).name;

      let reviewContent = "";
      if (review.content) {
        reviewContent = review.content;
      }

      const avatarUrl = users.find(
        (user) => user.user_id === review.user_id,
      ).avatar_url;

      // set avatar markup to a variable
      let avatarMarkup = '';
      // if avatarUrl exists set avatarMarkup to an image markup otherwise set it to the initials circle markup
      if (avatarUrl) {
        avatarMarkup = `<img class="w-12 h-12 object-cover rounded-full" src="${avatarUrl}" alt="avatar">`;
      } else {
        avatarMarkup = `<div class="bg-gray-200 text-xl font-medium text-neutral-600 w-12 h-12 rounded-full flex justify-center items-center">${getInitials(username)}</div>`;
      }

      // Rendered Markup
      return `<div class="card-container flex flex-col gap-4">
            <div class="flex gap-4">
              <div class="w-12 h-12">
                ${avatarMarkup}
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
              <p>${reviewContent}</p>
            </div>
          </div>`;
    })
    .join("");
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

// Review Bands
function renderPercent(numberOfStars) {
  let newFilteredReviews = sortedReviews.filter(
    (review) => review.rating == numberOfStars,
  );
  let percentage = (newFilteredReviews.length / sortedReviews.length) * 100;
  let roundedPercent = percentage.toFixed();
  return roundedPercent + "%";
}

function renderReviewsPage(count) {
  visibleReviews = activeReviews.slice(0, count);
  cardsContainer.innerHTML = renderReviewCards(visibleReviews);
  remainingReviewsCount.innerText = `${activeReviews.length - visibleReviews.length}`;
}

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

// Helper function
function getFilteredReviews() {
  if (activeRatingFilter === null) return sortedReviews;
  return sortedReviews.filter((review) => review.rating === activeRatingFilter);
}

function resetVisibleCount() {
  return Math.min(activeReviews.length, pageSize);
}

// Helper function to get the initials of a username of upto 2 characters long
function getInitials(name = 'brenton mosley') {
  return name.trim()
        .split(' ')
        .map(word => word[0])
        .slice(0,2)
        .join("")
        .toUpperCase();
}
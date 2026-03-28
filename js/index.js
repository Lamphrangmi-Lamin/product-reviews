import reviews from "../data/product-reviews.json" with { type: "json" };
// console.log(reviews);
import users from "../data/users.json" with { type: "json" };
// console.log(users);
const cardsContainer = document.querySelector(".cards-container");
const remainReviewsContainer = document.getElementById("remaining-reviews");
// console.log(remainReviewsContainer);
const showMoreBtn = document.getElementById("show-more-btn");

// State
let sortedReviews = [...reviews].sort(
  (a, b) => new Date(b.created_at) - new Date(a.created_at),
);

// Pagination
let visibleCount = 10;
let visibleReviews = [];
let remainingReviews = sortedReviews.length - visibleCount;
remainReviewsContainer.innerText = `${remainingReviews}`
// console.log(remainingReviews)

function pagination(count) {
  visibleReviews = sortedReviews.slice(0, count);
  console.log(visibleReviews);
}
pagination(visibleCount);

// show more button
showMoreBtn.addEventListener("click", () => {
  visibleCount = sortedReviews.length;
  console.log(`Now the visibleCount is ${visibleCount}`);
  pagination(visibleCount);
  console.log(`VisibleReviews are of ${visibleReviews.length}`);
  cardsContainer.innerHTML = cardHTML();
  //   remainingReviews = 0;
  remainingReviews = sortedReviews.length - visibleCount;
  remainReviewsContainer.innerText = `${remainingReviews}`;
  console.log(`Remaining views is ${remainingReviews}`);
});

function cardHTML() {
  return visibleReviews
    .map((review) => {
      // Obj reviews variables
      const username = users.find(
        (user) => user.user_id === review.user_id,
      ).name;
      const avatarUrl = users.find(
        (user) => user.user_id === review.user_id,
      ).avatar_url;

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
      function renderRatings(rating) {
        let ratingBar = ``;
        for (let i = 0; i < 5; i++) {
          if (i < rating) {
            ratingBar += `<i class="ri-star-fill text-yellow-400 text-xl"></i>`;
          } else {
            ratingBar += `<i class="ri-star-fill text-gray-200 text-xl"></i>`;
          }
        }
        return ratingBar;
      }

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
                    ${renderRatings(review.rating)}
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

cardsContainer.innerHTML = cardHTML();

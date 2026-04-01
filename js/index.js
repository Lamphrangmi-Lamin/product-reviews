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
let visibleReviews = [];
// console.log(remainingReviews)

const mql = window.matchMedia("(width <= 768px)");
// console.log(mql);

let visibleCount = mql.matches ? 10 : 12;
let remainingReviews;
let totalReviewsCount = sortedReviews.length;
let pageSize = mql.matches ? 10 : 12;

// console.log({
//   currentRemaining: remainingReviews,
//   calC: `${sortedReviews.length} - ${visibleReviews.length}`,
//   total: totalReviewsCount,
// })

mql.addEventListener("change", (event) => {
  if (event.matches) {
    // console.log(`matches to true`);
    visibleCount = 10;
    pageSize = 10;
  } else {
    // console.log(`matches to false`);
    visibleCount = 12;
    pageSize = 12;
  }
  pagination(visibleCount);
  // console.log(visibleReviews);
});
function pagination(count) {
  visibleReviews = sortedReviews.slice(0, count);
  cardsContainer.innerHTML = cardHTML();
  remainReviewsContainer.innerText = `${pageSize}`;
}
pagination(visibleCount);

// Show more button
showMoreBtn.addEventListener("click", () => {
  if (visibleCount < sortedReviews.length) {
    visibleCount = Math.min(visibleCount + pageSize, sortedReviews.length);
    pagination(visibleCount);
    remainingReviews = totalReviewsCount - visibleCount

    // console.log({
    //   VcountAfterClick: visibleCount,
    //   RcountAfterClick: remainingReviews
    // });

    if (remainingReviews <= 0) {
      remainReviewsContainer.innerText = `${remainingReviews}`;
    }
    // console.log({
    //   visibleReviews: visibleReviews,
    //   visibleReviewsCount: visibleReviews.length,
    //   remainingReviews: remainingReviews
    // })
  }
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

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
  cardsContainer.innerHTML = cardHTML(visibleReviews);
  remainReviewsContainer.innerText = `${pageSize}`;
}
pagination(visibleCount);

// Show more button
showMoreBtn.addEventListener("click", () => {
  if (visibleCount < sortedReviews.length) {
    visibleCount = Math.min(visibleCount + pageSize, sortedReviews.length);
    pagination(visibleCount);
    remainingReviews = totalReviewsCount - visibleCount;

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
console.log({
  averageRating: averageRating,
  roundedAverage: roundedAverage,
});

overallRating.innerHTML = renderRating(averageRating);
averageRatingContainer.innerText = roundedAverage;
// overallRating.addEventListener("click", (e) => {
//   const clickedStar = e.target.closest(".star");
//   console.log(clickedStar);
//   if (!clickedStar) {
//     console.log("You did not click a star");
//     return;
//   }

//   const stars = Array.from(overallRating.children);
//   const index = stars.indexOf(clickedStar) + 1;
//   console.log(`You clicked star ${index}`);

//   // Filter Reviews base on rating
//   let filteredReviews = reviews.filter(review => {
//     return review.rating == index;
//   });
//   visibleReviews = filteredReviews;
//   cardsContainer.innerHTML = cardHTML(visibleReviews)
//   console.log({
//     filteredReviews: filteredReviews,
//     visibleReviews: filteredReviews
//   })
// });

// Rendering total number of reviews
document.getElementById("total-no-reviews").innerText = totalReviewsCount;

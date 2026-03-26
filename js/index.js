import reviews from "../data/product-reviews.json" with {type: "json"};
// console.log(reviews);
import users from "../data/users.json" with {type: "json"};
// console.log(users);
let sortedReviews = [...reviews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
// console.log(sortedReviews);
const cardsContainer = document.querySelector('.cards-container');

const cardHTML = sortedReviews.map(review => {
    const username = users.find(user => user.user_id === review.user_id).name;
    // console.log(username);
    const avatarUrl = users.find(user => user.user_id === review.user_id).avatar_url;
    // console.log(avatarUrl)
    function formatDate(dateInput) {
        const date = new Date(dateInput + 'T00:00:00');
        const newDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return newDate;
    }

    function renderRatings(rating) {
        let ratingBar = ``;
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                ratingBar += `<i class="ri-star-fill text-yellow-400 text-xl"></i>`;
            } else {
                ratingBar += `<i class="ri-star-fill text-gray-200 text-xl"></i>`;
            }
        }
        // console.log(rating)
        return ratingBar;
    }
    
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
          </div>`
}).join("");

cardsContainer.innerHTML = cardHTML;


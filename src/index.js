document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.querySelector("#toy-collection");
  const toyFormContainer = document.querySelector(".container");

  // Fetch toys from the server
  fetch("http://localhost:3000/toys")
    .then(r => r.json())
    .then(toys => {
      let toysHTML = toys.map(function(toy) {
        return `
          <div class="card">
            <h2>${toy.name}</h2>
            <img src="${toy.image}" class="toy-avatar" />
            <p>${toy.likes} Likes</p>
            <button data-id="${toy.id}" class="like-btn">Like ❤️</button>
          </div>
        `;
      }).join('');

      toyCollection.innerHTML = toysHTML;
    })
    .catch(error => console.error('Error fetching toys:', error));

  // Handle toy form submission
  toyFormContainer.addEventListener("submit", function(e) {
    e.preventDefault();
    const toyName = e.target.name.value;
    const toyImage = e.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
        likes: 0
      })
    })
    .then(r => r.json())
    .then(newToy => {
      let newToyHTML = `
        <div class="card">
          <h2>${newToy.name}</h2>
          <img src="${newToy.image}" class="toy-avatar" />
          <p>${newToy.likes} Likes</p>
          <button class="like-btn" data-id="${newToy.id}">Like ❤️</button>
        </div>
      `;
      toyCollection.innerHTML += newToyHTML;
    })
    .catch(error => console.error('Error adding toy:', error))
  });

  // Handle like button clicks
  toyCollection.addEventListener("click", (event) => {
    if (event.target.className === "like-btn") {
      let currentLikes = parseInt(event.target.previousElementSibling.innerText);
      let newLikes = currentLikes + 1;
      event.target.previousElementSibling.innerText = newLikes + " likes";

      fetch(`http://localhost:3000/toys/${event.target.dataset.id}`)
        .then(response => response.json())
        .then(data => {
          // Update the likes count on the server
          // You may need to send a PATCH request to update the likes count
        })
        .catch(error => console.error('Error updating likes:', error));
    }
  });

  // Toggle toy form visibility
  const addBtn = document.querySelector("#new-toy-btn");
  let addToy = false;
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });
});

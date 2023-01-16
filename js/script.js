const btn = document.getElementById("showBtn");
btn.addEventListener("click", getPhotos);
const clickImageP = document.querySelector("#click-image");
clickImageP.style.display = "none";
const hoverImageP = document.querySelector("#hover-image");
hoverImageP.style.display = "none";
const overlay = document.querySelector("#overlay");

// animation while fetching data
const loader = document.querySelector("#loading");
const loadingAnimation = {
    targets: "#loading",
    easing: "linear",
    direction: "linear",
    duration: 500,
    rotate: [0, 360],
    loop: true,
};

const loading = anime(loadingAnimation);

// fetch data from API
function getPhotos(event) {
    event.preventDefault();
    displayLoading();
    console.log(document.getElementById("text-input").value);

    const textInput = document.getElementById("text-input").value.toLowerCase();
    const amountInput = document.getElementById("amount-input").value;
    const selectedSize = document.getElementById("photo-size").value;
    const sortBy = document.getElementById("sort-by").value;
    document.getElementById("field-required").innerText = "";
    document.getElementById("photo-size").classList.remove("required-border");
    document.getElementById("amount-input").classList.remove("required-border");
    document.getElementById("text-input").classList.remove("required-border");
    document.getElementById("error-message").innerText = "";
    document.getElementById("photo-container").innerText = "";
    clickImageP.style.display = "none";
    hoverImageP.style.display = "none";

    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=bcb05e9d4c886eb20c68ad140f2c376e&text=${textInput}&sort=${sortBy}&per_page=${amountInput}&format=json&nojsoncallback=1`;

    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            hideLoading();
            if (data.photos.photo.length == 0){
                clickImageP.style.display = "none";
                hoverImageP.style.display = "none";
                const errorText = document.getElementById("error-message");
                errorText.innerText = "No photos was found with the given search text. Try a different text"
            }
            else {
                showData(data, selectedSize);
            }
        })
        .catch(handleError);
}

// display data
function showData(data, selectedSize) {
    clickImageP.style.display = "none";
    hoverImageP.style.display = "none";
    const searchText = document.getElementById("text-input").value;
    const searchAmount = document.getElementById("amount-input").value;
    

    // possible if statements when to show "field required"
    if (
        selectedSize == "placeholder" &&
        searchAmount == "" &&
        searchText == ""
    ) {
        document.querySelector("#photo-size").classList.add("required-border");
        document
            .querySelector("#amount-input")
            .classList.add("required-border");
        document.querySelector("#text-input").classList.add("required-border");
    }

    if (selectedSize == "placeholder" && searchAmount == "") {
        document.querySelector("#photo-size").classList.add("required-border");
        document
            .querySelector("#amount-input")
            .classList.add("required-border");
    }

    if (searchAmount == "" && searchText == "") {
        document
            .querySelector("#amount-input")
            .classList.add("required-border");
        document.querySelector("#text-input").classList.add("required-border");
    }

    if (selectedSize == "placeholder" && searchText == "") {
        document.querySelector("#photo-size").classList.add("required-border");
        document.querySelector("#text-input").classList.add("required-border");
    }

    if (selectedSize == "placeholder") {
        throw fieldRequiredSize();
    }

    if (searchAmount == "") {
        throw fieldRequiredAmount();
    }

    if (searchText == "") {
        throw fieldRequiredText();
    }

    clickImageP.style.display = "flex";
    hoverImageP.style.display = "flex";

    // display photos
    const photoArr = data.photos.photo;
    photoArr.forEach((image) => {
        const card = document.createElement("div");
        card.id = "card";
        document.getElementById("photo-container").append(card);
        const img = document.createElement("img");
        img.id = "card-img";
        img.src = `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_${selectedSize}.jpg`;
        card.append(img);
        img.addEventListener("click", function () {
            window.open(img.src, "_blank");
        });

        // blurr out background when hovering on image
        img.addEventListener("mouseenter", (event) => {
            event.target.style.zIndex = "2";
            overlay.classList.add("blurred");
            img.classList.add("image-clicked");
        });

        img.addEventListener("mouseleave", (event) => {
            event.target.style.zIndex = "0";
            overlay.classList.remove("blurred");
            img.classList.remove("image-clicked");
        });
    });
}

// show animation while loading
function displayLoading() {
    loader.style.visibility = "visible";
    loading.play();
}

// hide animation when finished loading
function hideLoading() {
    loader.style.visibility = "hidden";
    loading.pause();
}

function handleError(error) {
    hideLoading();
    const errorP = document.getElementById("error-message");
    errorP.innerText =
        "Something went wrong with your search. Make sure you enter a search word, how many photos you wish to display and what size";
    console.log(error);
}

// functions for required fields
function fieldRequiredSize() {
    const photoSizeField = document.querySelector("#photo-size");
    const requiredText = document.querySelector("#field-required");
    requiredText.innerText = "Fields marked in red are required";
    requiredText.style.color = "red";
    photoSizeField.classList.add("required-border");
}

function fieldRequiredText() {
    const textInputField = document.querySelector("#text-input");
    const requiredText = document.querySelector("#field-required");
    requiredText.innerText = "Fields marked in red are required";
    requiredText.style.color = "red";
    textInputField.classList.add("required-border");
}

function fieldRequiredAmount() {
    const amountInputField = document.querySelector("#amount-input");
    const requiredText = document.querySelector("#field-required");
    requiredText.innerText = "Fields marked in red are required";
    requiredText.style.color = "red";
    amountInputField.classList.add("required-border");
}

const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

const your_api_key = "64f930ebd5833d4e2fda47d7c8be5894";
const apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";

inputField.addEventListener("keyup", (e) => {
    // if user pressed enter btn and input value is not empty
    if (e.key == "Enter" && inputField.value.trim() !== "") {
        requestApi(inputField.value.trim());
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation API");
    }
});

function requestApi(city) {
    const apiUrl = `${apiEndpoint}?q=${city}&units=metric&appid=${your_api_key}`;
    fetchData(apiUrl);
}

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    const apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&units=metric&appid=${your_api_key}`;
    fetchData(apiUrl);
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(apiUrl) {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");

    fetch(apiUrl)
        .then((res) => res.json())
        .then((result) => weatherDetails(result))
        .catch(() => {
            infoTxt.innerText = "Something went wrong";
            infoTxt.classList.replace("pending", "error");
        });
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { temp, feels_like, humidity } = info.main;

        // Using custom weather icon according to the id which API gives to us
        if (id == 800) {
            wIcon.src = "icons/clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "icons/storm.svg";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "icons/snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "icons/haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "icons/cloud.svg";
        } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            wIcon.src = "icons/rain.svg";
        }

        // Passing weather info to respective elements
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});

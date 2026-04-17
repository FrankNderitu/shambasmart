// SHAMBASMART - Weather Advisor for Kenyan Farmers

// TODO: Replace this with your own OpenWeatherMap API key
// Get free key at: https://home.openweathermap.org/api_keys
const API_KEY = "YOUR_OWN_API_KEY_HERE"; 

// 2. Run this code when the page fully loads
document.addEventListener("DOMContentLoaded", () => {
    // Connect buttons to their functions
    document.getElementById("getBtn").addEventListener("click", getWeather);
    document.getElementById("saveBtn").addEventListener("click", saveProfile);
    document.getElementById("loadBtn").addEventListener("click", loadProfile);
});


// 3. Main Function - Fetch weather from API

async function getWeather() {
    const county = document.getElementById("countyInput").value.trim();
    const crop = document.getElementById("crop").value;

    // Validation: Make sure user entered a county
    if (!county) {
        alert("Please enter a county name (e.g. Nairobi, Nakuru, Kisumu)");
        return;
    }

    // Show the result area and loading message
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("title").innerHTML = `Loading weather for ${county}...`;

    // Build the API URL
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${county},KE&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Check if the county was found
        if (data.cod !== "200") {
            alert(`County "${county}" not found. Try: Nairobi, Nakuru, Kisumu, Mombasa, Eldoret`);
            return;
        }

        // Display the weather forecast
        displayForecast(data, county, crop);

    } catch (error) {
        alert("Error fetching weather. Please check your internet and API key.");
        console.error(error);
    }
}


// 4. Display the 5-day weather forecast

// 4. Display the 5-day weather forecast with crop-specific emojis
function displayForecast(data, county, crop) {
    
    // Get the correct emoji for the selected crop
    const cropEmoji = getCropEmoji(crop);

    // Update the title with crop emoji
    document.getElementById("title").innerHTML = `${cropEmoji} ${county} County - ${crop}`;

    // Clear previous results
    const container = document.getElementById("forecast");
    container.innerHTML = "";

    // Loop through 5 days
    for (let i = 0; i < 5; i++) {
        
        const day = data.list[i * 8];

        const date = new Date(day.dt * 1000).toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });

        const temp = Math.round(day.main.temp);
        const condition = day.weather[0].description;
        const rain = day.pop ? Math.round(day.pop * 100) : 0;

        // Simple farming advice
        let advice = "Good day for farming activities.";
        if (rain > 60) {
            advice = `High rain expected (${rain}%). Consider delaying planting ${crop}.`;
        } else if (temp > 30) {
            advice = `Hot day (${temp}°C). Water your ${crop} properly.`;
        } else if (rain < 20) {
            advice = `Dry weather. Good time to weed or prepare land for ${crop}.`;
        }

        // Create weather card
        const card = `
            <div class="card">
                <h3>${date}</h3>
                <p>🌡️ Temperature: ${temp}°C</p>
                <p>☁️ Condition: ${condition}</p>
                <p>🌧️ Rain chance: ${rain}%</p>
                <p><strong>Advice for ${crop}:</strong> ${advice}</p>
            </div>
        `;

        container.innerHTML += card;
    }
}

// New helper function: Returns emoji based on crop
function getCropEmoji(crop) {
    switch(crop.toLowerCase()) {
        case "maize":
            return "🌽";        // Maize / Corn
        case "beans":
            return "🫘";        // Beans
        case "potatoes":
            return "🥔";        // Potatoes
        case "kale":
            return "🥬";        // Kale / Sukuma Wiki
        default:
            return "🌱";        // Default plant emoji
    }
}


// 5. Save user preferences (County + Crop)

function saveProfile() {
    const profile = {
        county: document.getElementById("countyInput").value.trim(),
        crop: document.getElementById("crop").value
    };

    localStorage.setItem("shambaProfile", JSON.stringify(profile));
    alert(" Preferences saved successfully!");
}


// 6. Load saved preferences and fill the form

function loadProfile() {
    const saved = localStorage.getItem("shambaProfile");

    if (saved) {
        const profile = JSON.parse(saved);
        
        document.getElementById("countyInput").value = profile.county;
        document.getElementById("crop").value = profile.crop;
        
        alert(" Preferences loaded! Now click 'Get Weather Forecast & Advice'");
    } else {
        alert("No saved preferences found yet.");
    }
}
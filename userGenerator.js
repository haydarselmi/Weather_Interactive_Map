// Tableau contenant la liste des utilisateurs français
let usersArray = [];
/* 
    Tableau contenant la météo correspondants à l'utilisateur
    au même indice que le tableau usersArray.
*/
let weatherConditions = [];
// Tableau des markers présents sur la carte.
let markers = [];
// Tableau des popups pouvant être affichés sur la carte.
let popups = [];
// indique si on a atteint 10 utilisateurs présents sur la carte.
let reached10usersFlag = false;
let lat, long, town, marker, popup, popupOptions;
// API permettant de fournir des profils d'utilisateurs français.
const userApiAdress = "https://randomuser.me/api/?nat=fr";
// API de geocoding permettant de fournir les coords à partir d'une ville.
let userLatLongAPI = `https://geocoding-api.open-meteo.com/v1/search?name=${town}`;
// API donnant la temperature aux coords (lat, long)
let weatherApiAdress = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`;
// Adresse API pour avoir la temperature d'une personne sur une période.
let hourlyWeatherApiAdress = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m`;
// Le titre du graphe affiché pour une personne donnée.
let graphTitle = "";

/**
 * Permet d'afficher le graphe de température correspondant à l'utilisateur
 * dont le marker a été clicked et le popup affiché.
 * @param {*} e 
 */
function onClick(e) {
    coords = this.getLatLng();
    hourlyWeatherApiAdress = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&hourly=temperature_2m`;
    fetch(hourlyWeatherApiAdress).then((response) => response.json())
    .then((data) => {
        chartData.datasets[0].label = `${graphTitle}, ci-dessous le graphe de température période`; 
        chartData.labels = data.hourly.time;
        chartData.datasets[0].data = data.hourly.temperature_2m;
        drawChart(chartData);
    });
}

/**
 * Appels fetch async permettant de fournir un utilisateur
 * puis les coordonnées de sa ville et finalement
 * les conditions météos de sa ville.
 */
function fetchUser() {
    // Récupération d'un utilisateur français.
    fetch(userApiAdress).then((response) => response.json())
    .then((data) => {

        // Donne la longitude et latitude correcte à partir de la ville.
        town = data.results[0].location.city;
        popupOptions = {
            content: `Personne : ${data.results[0].name.first} ${data.results[0].name.last}`
        };

        // Récupération des coords de la ville de l'utilisateur avec l'API geocoding.
        userLatLongAPI = `https://geocoding-api.open-meteo.com/v1/search?name=${town},France`;
        fetch(userLatLongAPI).then((response) => response.json())
        .then((data) => {

            lat = data.results[0].latitude;
            long = data.results[0].longitude;

            // Récupération de la condition météo actuelle depuis la latitude et longitude.
            weatherApiAdress = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`;
            fetch(weatherApiAdress).then((response) => response.json())
            .then((data) => {

                // Mise à jour du contenu à afficher dans le popup et l'image de la condition météo.
                popupOptions.content += `\nTempérature : ${data.current_weather.temperature}`
                    + `\n` + interpretWeatherCode(data.current_weather.weathercode);
                graphTitle = popupOptions.content;
                popupOptions.content += `<img src="${interpretWeatherCodeImageUrl(data.current_weather.weathercode)}"></img>`;
                
                // On enlève la première temperature premier marker avec son popup
                // si on a déjà 10 utilisateur dans la carte.
                if(reached10usersFlag) {
                    weatherConditions.shift();
                    map.removeLayer(markers[0]);
                    markers.shift();
                    map.removeLayer(popups[0]);
                    popups.shift();
                }
                weatherConditions.push(data);
                
                // Ajout du popup
                popup = L.popup([lat, long], popupOptions);
                popups.push(popup);
                // Ajout du marker avec son popup sur ouverture lors d'un click.
                marker = L.marker([lat, long]).addTo(map);
                marker.on("click", onClick);
                markers.push(marker);
                marker.bindPopup(popup);
            });

        });        

        // Si on a atteint 10 utilisateur sur la carte on enlève le plus ancien
        // et on ajoute le nouvel utilisateur.
        if(reached10usersFlag) {
            usersArray.shift();
        }
        usersArray.push(data.results[0]);

        // notifie si on a atteint 10 utilisateurs sur la carte.
        if(usersArray.length === 10) {
            reached10usersFlag = true;
        }
    })
}

// Alimentation de la carte par un nouvel utilisateur toutes les secondes.
const supplyUsersArray = setInterval(fetchUser, 1000);

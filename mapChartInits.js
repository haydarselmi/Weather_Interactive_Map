/**
 * ----------- MAP INIT ---------------------------
 * Initialisation de la carte centrée sur la France
 * avec un niveau de zoom de 6.
 */
let map = L.map('map').setView([48, 2.35], 6);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
/** ----------- MAP INIT ---------------- */

/**
 * ------------ CHART INIT ----------------------------------------------
 * Partie permettant d'initialiser un graphe pour afficher la temperature
 * sur une période sur le canvas présent dans la partie droite de la page.
 */
const ctx = document.getElementById("userChart").getContext("2d");

let chartData = {
  labels: [1, 2, 3, 4, 5, 6],
  datasets: [{
    label: 'Cliquez sur une Personne un marker pour afficher le graphe de température sur une Période',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};

let chart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      onClick: (e) => {
        const canvasPosition = getRelativePosition(e, chart);
  
        // Substitute the appropriate scale IDs
        const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
        const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
      }
    }
});
/** ------------------- CHART INIT ------------------------------------ */
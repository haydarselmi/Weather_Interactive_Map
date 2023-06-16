/**
 * Permet de retourner à partir du weather code la chaîne correspondant au
 * type de météo.
 * @param {*} weatherCode.
 * @return string de l'état de la météo. 
 */
function interpretWeatherCode(weatherCode) {
    switch(weatherCode) {
        case 0:
            return "ciel dégagé";
            break;
        case 1:
            return "un peu clair";
            break;
        case 2:
            return "nuageux";
            break;
        case 3:
            return "couvert";
            break;
        case 45:
            return "brouillard";
            break;
        case 48:
            return "brouillard givré";
            break;
        case 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82:
            return "pluie";
            break;
        case 71, 73, 75, 77, 85, 86:
            return "neige";
            break;
        case 95, 96, 99:
            return "orage";
            break;
        default:
            return "orage tonnerre";
            break;
    }
}

/**
 * Permet de retourner à partir du weather code la chaîne correspondant à
 * l'emplacement de l'image représentant le weather code.
 * @param {*} weatherCode.
 * @return string de l'emplacement de l'image correspondante. 
 */
function interpretWeatherCodeImageUrl(weatherCode) {
    switch(weatherCode) {
        case 0:
            return "img/ciel_degage.webp";
            break;
        case 1:
            return "img/un_peu_clair.webp";
            break;
        case 2:
            return "img/nuageux.webp";
            break;
        case 3:
            return "img/couvert.webp";
            break;
        case 45:
            return "img/brouillard.webp";
            break;
        case 48:
            return "img/brouillard_givre.webp";
            break;
        case 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82:
            return "img/pluie.webp";
            break;
        case 71, 73, 75, 77, 85, 86:
            return "img/neige.webp";
            break;
        case 95, 96, 99:
            return "img/orage.webp";
            break;
        default:
            return "img/orage_tonnerre.webp";
            break;
    }
}

/**
 * Permet de redessiner le graphe avec les données chartData
 * chartData alimentée par les API contenant les températures
 * et les horaires et le titre du graphe contenant la personne
 * etc.
 * @param {*} chartData 
 */
function drawChart(chartData) {
    chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          onClick: (s) => {
            const canvasPosition = getRelativePosition(s, chart);
      
            // Substitute the appropriate scale IDs
            const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
            const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
          }
        }
    });
}
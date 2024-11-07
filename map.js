let latitude = -37.80;
let longitude = 144.95;
let zoomLevel = 14;
let map;
let legend;
const colorScale = d3.scaleSequential(d3.interpolatePlasma)
  .domain([10, 3000]);


async function loadMap() {
    try {
        const selectedYear = document.getElementById('year-input').value || 2004;
        const selectedCategory = document.getElementById('category-input').value || 'retail_trade';
        const data = await fetchMapData(selectedYear, selectedCategory);

        if (!map) { 
            map = L.map('map').setView([latitude, longitude], zoomLevel);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        } else {
            map.eachLayer(layer => {
                if (layer instanceof L.TileLayer) {
                    return;
                }
                map.removeLayer(layer);
            });
        }

        const maxQuantity = Math.max(...data.map(d => d.quantity));
        const minQuantity = Math.min(...data.map(d => d.quantity));


        const getColor = quantity => {
            const color = colorScale(quantity);
            console.log("Quantity:", quantity, "Color:", color);
            return color;
        };
        
        
        
        

        const geoData = data.map(item => ({
            type: "Feature",
            properties: {
                clue_area: item.clue_area,
                quantity: item.quantity
            },
            geometry: JSON.parse(item.st_asgeojson)
        }));

        L.geoJSON(geoData, {
            style: feature => ({
                fillColor: getColor(feature.properties.quantity),
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 1
            }),
            onEachFeature: (feature, layer) => {
                layer.bindTooltip(`${feature.properties.clue_area}: ${feature.properties.quantity}`);
            }
        }).addTo(map);
        if (legend) {
            legend.remove();
        }
        legend = L.control({ position: 'bottomright' });

        legend.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'info legend');
            
            const grades = [minQuantity, (minQuantity + maxQuantity) / 4, (minQuantity + maxQuantity) / 2, (3 * minQuantity + maxQuantity) / 4, maxQuantity];
        
            for (let i = 0; i < grades.length; i++) {
                const legendItem = L.DomUtil.create('div', 'legend-item', div);
        
                const colorBlock = L.DomUtil.create('i', '', legendItem);
                colorBlock.style.background = getColor(grades[i]);
                colorBlock.style.width = '20px';
                colorBlock.style.height = '20px';
                colorBlock.style.float = 'left';
                colorBlock.style.marginRight = '5px';
        
                const text = grades[i] + (grades[i + 1] ? ' – ' + grades[i + 1] : '+');
                legendItem.innerHTML += text;
            }
            return div;
        };
        
        

        legend.addTo(map);
    } catch (error) {
        console.error('Loading map failed:', error);
    }
}

async function fetchMapData(year, category) {
    const url = `https://njwivaoww8.execute-api.ap-southeast-2.amazonaws.com/OB_test1/getmapdata?census_year=${year}&anzsic1_category=${category}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);
        return responseData;
    } catch (error) {
        console.error('Fetching map data failed:', error);
        throw error;
    }
}

async function fillDropdowns() {
    try {
        const response = await fetch("https://0qkq06emrj.execute-api.ap-southeast-2.amazonaws.com/I1/getyearandanzsic");
        const data = await response.json();
        // const actualData = data.body;
        const yearSelect = document.getElementById('year-input');
        const categorySelect = document.getElementById('category-input');

        yearSelect.innerHTML = '';
        categorySelect.innerHTML = '';

        data.years.forEach(item => {
            const option = document.createElement('option');
            option.value = item.census_year;
            option.textContent = item.census_year;
            yearSelect.appendChild(option);
        });

        data.categories.forEach(item => {
            const option = document.createElement('option');
            option.value = item.anzsic1_category;
            option.textContent = item.anzsic1_category.replace(/_/g, ' ').charAt(0).toUpperCase() + item.anzsic1_category.replace(/_/g, ' ').slice(1); 
            categorySelect.appendChild(option);
        });

    } catch (error) {
        console.error("Failed to fetch and populate dropdowns:", error);
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    await fillDropdowns();
    const selector = document.getElementById('industrySelector');
    selector.addEventListener('change', updateLineChart);
});


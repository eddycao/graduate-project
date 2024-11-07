let lineChart;
let dataset = [];

const fetchDataAndDrawLineChart = async () => {
    
    const response = await fetch('https://0qkq06emrj.execute-api.ap-southeast-2.amazonaws.com/I1/industydemand');
    const data = await response.json();
    console.log(data)
    const bodyData = data;
    
    const industries = [...new Set(bodyData.map(item => item.industry_name))];
    populateIndustrySelector(industries);
    dataset = industries.map(industry => {
        return {
            label: industry,
            data: bodyData.filter(item => item.industry_name === industry).map(item => parseFloat(item.demand)),
            borderColor: getRandomColor(),  
            fill: false
        }
    });

    const labels = bodyData.filter(item => item.industry_name === industries[0]).map(item => `${item.report_year}-Q${item.report_quarter}`);

    const ctx = document.getElementById('lineChart').getContext('2d');
    
    if (typeof lineChart !== 'undefined' && lineChart) {
        lineChart.destroy();
    }

    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: dataset
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    document.getElementById('industrySelector').style.display = 'block';
    document.getElementById('loadLineChart').style.display = 'none';
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function populateIndustrySelector(industries) {
    const selector = document.getElementById('industrySelector');

    selector.innerHTML = "";
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.text = 'Show All';
    selector.appendChild(allOption);

    industries.forEach(industry => {
        const option = document.createElement('option');
        option.value = industry;
        option.text = industry;
        selector.appendChild(option);
    });
}

function updateLineChart() {
    const selectedIndustries = Array.from(document.getElementById('industrySelector').selectedOptions).map(option => option.value);

    let updatedDataset;

    if (selectedIndustries.includes('all')) {
        updatedDataset = dataset;
    } else {
        updatedDataset = dataset.filter(data => selectedIndustries.includes(data.label));
    }

    lineChart.data.datasets = updatedDataset;
    lineChart.update();
}

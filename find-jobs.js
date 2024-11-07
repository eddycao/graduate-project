let latitude = -35;
let longitude = 133;
let zoomLevel = 3;
let legend = 0;
let map = L.map('map').setView([latitude, longitude], zoomLevel);
let anzscoCode = null;
document.addEventListener('DOMContentLoaded', function() {
  if (sessionStorage.getItem('searched') !== 'true') {
    window.location.href = 'index.html';
    alert("Please Search Before entering this page!")
  }
  var successYourPersonalized = document.getElementById("successYourPersonalized");
  const allJobCards = document.querySelectorAll('[class^="job-card-states"]');
  
  allJobCards.forEach((jobCard) => {
    jobCard.addEventListener('click', function() {
      

      const anzscoCodeElement = jobCard.querySelector(".canva8");
      anzscoCode = anzscoCodeElement ? anzscoCodeElement.textContent : null;
      localStorage.setItem("anzsco_code", anzscoCode);
      // const anzscoCode = 2412; //debug
      

      if (anzscoCode) {
        fetch(`https://0qkq06emrj.execute-api.ap-southeast-2.amazonaws.com/I1/getcareerpathbyanzcode?anzsco_code=${anzscoCode}`)
        .then(response => response.json())
        .then(data => {
          // console.log(data)
          const jobPopup = document.getElementById('job-popup');
          
          jobPopup.querySelector('.anzsco_title').textContent = data.occupationDescription[0].anzsco_title || 'N/A';
          jobPopup.querySelector('.anzsco_description').textContent = data.occupationDescription[0].anzsco_description || 'N/A';
          // for tech skills
          let ul_technology = jobPopup.querySelector('.technology_tool');
          if (!ul_technology) {
            ul_technology = document.createElement('ul');
            ul_technology.className = 'technology_tool';
              jobPopup.appendChild(ul_technology);
          }
          ul_technology.innerHTML = '';

          data.technologyTool.slice(0, 3).forEach(comp => {
            const li = document.createElement('li');
            const spanTool = document.createElement('span');
            spanTool.textContent = comp.technology_tool;
            spanTool.className = 'tech-tool-name';
            li.appendChild(spanTool);
        
                   
            const spanTrending = document.createElement('span');
            if(comp.emerging_trending === 'NaN') {
                // spanTrending.textContent = 'Neither Trending/Emerging';
                // spanTrending.classList.add('color-yellow', 'highlighted-content2'); 
            } else if(comp.emerging_trending === 'Emerging') {
                spanTrending.textContent = comp.emerging_trending;
                spanTrending.classList.add('color-red', 'highlighted-content2'); 
            } else if(comp.emerging_trending === 'Trending') {
                spanTrending.textContent = comp.emerging_trending;
                spanTrending.classList.add('color-green', 'highlighted-content2'); 
            }
            li.appendChild(spanTrending);        

            const spanDescription = document.createElement('span');
            spanDescription.textContent = comp.technology_tool_description;
            spanDescription.className = 'tech-tool-description';
            spanDescription.style.display = 'none'; 
            li.appendChild(spanDescription); 
            spanTool.addEventListener('click', function() {
                if(spanDescription.style.display === 'none') {
                    spanDescription.style.display = 'block';
                    spanDescription.style.marginTop = "5px"
                } else {
                    spanDescription.style.display = 'none';
                }
            });
        
            ul_technology.appendChild(li);
          });        

          let ul_competency = jobPopup.querySelector('.competency-list');
          if (!ul_competency) {
            ul_competency = document.createElement('ul');
            ul_competency.className = 'competency-list';
              jobPopup.appendChild(ul_competency);
          }
          ul_competency.innerHTML = '';
          
          data.competency.slice(0, 3).forEach(comp => {
            const li = document.createElement('li');
          
            const spanCompetency = document.createElement('span');
            spanCompetency.textContent = comp.competency_name;
            spanCompetency.className = 'competency-name'; 
            li.appendChild(spanCompetency);

            const spanDescription = document.createElement('span');
            spanDescription.textContent = comp.description;
            spanDescription.className = 'competency-description'; 
            spanDescription.style.display = 'none';
            li.appendChild(spanDescription);
            
            spanCompetency.addEventListener('click', function() {
                if(spanDescription.style.display === 'none') {
                    spanDescription.style.display = 'block';
                    spanDescription.style.marginTop = "5px"
                } else {
                    spanDescription.style.display = 'none';
                }
            });
        

            ul_competency.appendChild(li);
        })        

          // for tasks
          let ul_tasks = jobPopup.querySelector('.skill_node_name');
          if (!ul_tasks) {
            ul_tasks = document.createElement('ul');
            ul_tasks.className = 'skill_node_name';
              jobPopup.appendChild(ul_tasks);
          }
          ul_tasks.innerHTML = '';

          data.skillTask.slice(0, 3).forEach(comp => {
              const li = document.createElement('li');
              li.textContent = `${comp.skill_node_name}`;
              ul_tasks.appendChild(li);
          });


          jobPopup.style.display = 'block';
          map.invalidateSize();
          return fetch(`https://0qkq06emrj.execute-api.ap-southeast-2.amazonaws.com/I1/getstatesjobdemand?anzsco_code=${anzscoCode}`)
        })
        .then(response => response.json())
        .then(responseData => {
          
          const stateTerritoryLabourMarketData = responseData.stateTerritoryLabourMarket;
          // console.log(stateTerritoryLabourMarketData);
          loadMapWithJobData(stateTerritoryLabourMarketData);

          const nationalLabourMarketRatingData = responseData.nationalLabourMarket;
          // console.log(nationalLabourMarketRatingData[0]);
          // console.log(nationalLabourMarketRatingData[0].current_national_labour_market_rating);
          const demandDiv = document.querySelector('.demand');
          demandDiv.classList.remove('color-red', 'color-green', 'color-yellow'); // Reset previous classes
          const futureDiv = document.querySelector('.future');
          futureDiv.classList.remove('color-red', 'color-green', 'color-yellow'); // Reset previous classes for futureDiv

          if (nationalLabourMarketRatingData && nationalLabourMarketRatingData.length > 0) {
              switch (nationalLabourMarketRatingData[0].current_national_labour_market_rating) {
                  case 'S':
                      demandDiv.textContent = 'National Shortage: Shortage!!!';
                      demandDiv.classList.add('color-red', 'highlighted-content');
                      break;
                  case 'NS':
                      demandDiv.textContent = 'National Shortage: Not Shortage!';
                      demandDiv.classList.add('color-green', 'highlighted-content');
                      break;
                  case 'R':
                      demandDiv.textContent = 'National Shortage: Regional!!';
                      demandDiv.classList.add('color-yellow', 'highlighted-content');
                      break;
                  default:
                      demandDiv.textContent = 'National Shortage: Unknown';
                      break;
              }

              switch (nationalLabourMarketRatingData[0].national_future_demand_rating) {
                  case 'Soft':
                      futureDiv.textContent = 'Future Demand: Soft!';
                      futureDiv.classList.add('color-green', 'highlighted-content');
                      break;
                  case 'Moderate':
                      futureDiv.textContent = 'Future Demand: Moderate!!';
                      futureDiv.classList.add('color-yellow', 'highlighted-content');
                      break;
                  case 'Strong':
                      futureDiv.textContent = 'Future Demand: Strong!!!';
                      futureDiv.classList.add('color-red', 'highlighted-content');
                      break;
                  default:
                      futureDiv.textContent = 'Future Demand: ' + nationalLabourMarketRatingData[0].national_future_demand_rating || 'N/A';
                      break;
              }
          }

        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
      }
    });
  });
  

  var scrollAnimElements = document.querySelectorAll("[data-animate-on-scroll]");
  var observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          const targetElement = entry.target;
          targetElement.classList.add("animate");
          observer.unobserve(targetElement);
        }
      }
    },
    {
      threshold: 0.15,
    }
  );

  for (let i = 0; i < scrollAnimElements.length; i++) {
    observer.observe(scrollAnimElements[i]);
  }

  const jobsData = JSON.parse(localStorage.getItem('jobsData'));
  if (jobsData) {
    displayJobs(jobsData);
  }

  const refreshButton = document.getElementById('refresh-jobs');

  refreshButton.addEventListener('click', function() {
    const randomJobs = getRandomJobsFromLocalStorage();
    displayJobs(randomJobs);
  });

});
let isReloading = sessionStorage.getItem('reloaded');
sessionStorage.removeItem('reloaded');

window.addEventListener('beforeunload', function(event) {
    if (!isReloading) {
        localStorage.clear();
    }
});

window.addEventListener('unload', function(event) {
    sessionStorage.setItem('reloaded', 'true');
});
const jobCard = document.querySelector('.job-card-states7');
const jobPopup = document.getElementById('job-popup');
const closeButton = document.querySelector('.job-popup-close');

jobCard.addEventListener('click', function() {
  jobPopup.style.display = 'block';
});

closeButton.addEventListener('click', function() {
  jobPopup.style.display = 'none';
});

jobPopup.addEventListener('click', function(event) {
  if (event.target === jobPopup) {
    jobPopup.style.display = 'none';
  }
});

function displayJobs(jobs) {
  const jobsRelevantElement = document.querySelector(".jobs-relevant-to2");
  if (jobsRelevantElement) {
    if(jobs.length < 7){
      jobsRelevantElement.textContent = `${jobs.length} JOBS RELEVANT TO YOU`;
    }
    else
    jobsRelevantElement.textContent = `${7} JOBS RELEVANT TO YOU`;

  }
  const fillOrder = ['job-card-states13', 'job-card-states7', 'job-card-states8', 'job-card-states9', 'job-card-states10', 'job-card-states11', 'job-card-states12'];
  for (let i = 0; i < fillOrder.length; i++) {
    const jobCard = document.querySelector(`.${fillOrder[i]}`);
    if (i < jobs.length) {
      const titleElement = jobCard.querySelector(".junior-ux-designer8") || jobCard.querySelector(".junior-ux-designer14");
      const companyElement = jobCard.querySelector(".canva8") || jobCard.querySelector(".canva14");
      const salaryElement = jobCard.querySelector(".kyearly8");
      if (titleElement) titleElement.textContent = jobs[i].anzsco_title;
      if (companyElement) companyElement.textContent = jobs[i].anzsco_code;
      if (salaryElement) salaryElement.textContent = jobs[i].description;
      jobCard.style.display = 'block'; 
    } else {
      jobCard.style.display = 'none';
    }
  }
}

function getRandomJobsFromLocalStorage() {
  const allJobs = JSON.parse(localStorage.getItem('jobsData'));
  
  if (!allJobs || allJobs.length === 0) return [];

  if (allJobs.length <= 7)
  {
    alert("No more job found")
    return allJobs;
  } 

  const shuffledJobs = allJobs.sort(() => 0.5 - Math.random());

  return shuffledJobs.slice(0, 7);
}

function loadMapWithJobData(data) {
  if (!map) { 
      map = L.map('map').setView([latitude, longitude], zoomLevel);
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  } else {
      map.eachLayer(layer => {
          if (layer instanceof L.TileLayer) {
              return;
          }
          map.removeLayer(layer);
      });
  }

  const getColor = (labourMarketRating) => {
      switch (labourMarketRating) {
          case "S": return "red";
          case "R": return "yellow";
          case "NS": return "green";
          default: return "grey"; 
      }
  };

  const geoData = data.map(item => ({
      type: "Feature",
      properties: {
          clue_area: item.clue_area,
          state_initials : item.state_initials,
          labour_market_rating: item.labour_market_rating
      },
      geometry: JSON.parse(item.geo_shape)
  }));

  L.geoJSON(geoData, {
      style: feature => ({
          fillColor: getColor(feature.properties.labour_market_rating),
          weight: 2,
          opacity: 1,
          color: 'white',
          fillOpacity: 1
      }),
      onEachFeature: (feature, layer) => {
          layer.bindTooltip(`${feature.properties.state_initials}: ${feature.properties.labour_market_rating}`);
      }
  }).addTo(map);

  if (!legend) {
    legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        const ratings = ["S", "R", "NS","No Data"];
        const displayname = ["S:Shortage", "R:Regional", "NS:Not Shortage", "No Data"];
        for (let i = 0; i < ratings.length; i++) {
            div.innerHTML += `<i style="background:${getColor(ratings[i])}; width: 18px; height: 18px; float: left; margin-right: 8px;"></i> ${displayname[i]}<br>`;
        }

        return div;
    };


}

  legend.addTo(map);
}


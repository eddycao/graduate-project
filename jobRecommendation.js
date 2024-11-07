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

async function getJobRecommendations() {
    const userText = document.getElementById("userText").value;
  
    const payload = {
      user_text: userText
    };
  
    try {
      const response = await fetch("https://0qkq06emrj.execute-api.ap-southeast-2.amazonaws.com/I1/getjobrecommendations", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
  
      const result = await response.json();
      console.log(result);  // Debugging 
  
      if (response.ok) {  // Check if HTTP status code is in the range 200-299
        document.getElementById("status").textContent = "Success!";
        console.log(result.data);  // Debugging 
        displayJobs(result.data);
      } else {
        document.getElementById("status").textContent = "Error!";
      }
  
    } catch (error) {
      console.error(error);
      document.getElementById("status").textContent = "Unexpected GPT ERROR.";
    }
}

  

function displayJobs(jobs) {
    console.log("Displaying jobs:", jobs);

    const resultsDiv = document.getElementById("jobList");
    resultsDiv.innerHTML = "";

    jobs.forEach(job => {
        const jobDiv = document.createElement("div");
        jobDiv.className = "job";

        const jobTitle = document.createElement("h3");
        jobTitle.textContent = job.anzsco_title;
        
        const jobDetails = document.createElement("div");
        jobDetails.className = "r";
        jobDetails.innerHTML = `
            <p>Code: ${job.anzsco_code}</p>
            <p>Description: ${job.description}</p>
        `;
        jobDetails.style.display = "none";  

        jobTitle.addEventListener("click", () => {
            if (jobDetails.style.display === "none") {
                jobDetails.style.display = "block";
            } else {
                jobDetails.style.display = "none";
            }
        });

        jobDiv.appendChild(jobTitle);
        jobDiv.appendChild(jobDetails);

        resultsDiv.appendChild(jobDiv);
    });
}
  
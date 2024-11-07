async function fetchJobs() {

    const keyword = document.getElementById("keyword").value;

    try {

        const response = await fetch('https://0qkq06emrj.execute-api.ap-southeast-2.amazonaws.com/I1/searchresult', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyword: keyword })
        });


        const data = await response.json();

        if (data.message === "Success!") {
            displayJob(data.data);
        } else {
            alert("No jobs found");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching data");
    }
}


function displayJob(jobs) {
    console.log("Displaying jobs:", jobs);

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    jobs.forEach(job => {
        const jobDiv = document.createElement("div");
        jobDiv.className = "job";

        const jobTitle = document.createElement("h3");
        jobTitle.textContent = job.anzsco_title;
        
        const jobDetails = document.createElement("div");
        jobDetails.className = "jobDetails";
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


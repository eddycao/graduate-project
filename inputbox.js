let progressInterval;

document.addEventListener('DOMContentLoaded', function() {
  const inputContainer = document.getElementById('inputContainer');
  const toggleInput = document.getElementById('toggleInput');
  const confirmInput = document.getElementById('confirmInput');
  document.getElementById("inputBox").addEventListener('input', checkAndToggleButton);


  let multiLine = false;

  toggleInput.addEventListener('click', function() {
    multiLine = !multiLine;

    if (multiLine) {
      const textarea = document.createElement("textarea");
      textarea.id = "inputBox";
      textarea.className = "input";
      textarea.placeholder = "Tell me what you're looking for...               Or your experiences/what you like...         Powered by Chat-GPT ";
      textarea.style.height = "200px";
      textarea.addEventListener('input', checkAndToggleButton); 
      inputContainer.replaceChild(textarea, document.getElementById('inputBox'));

      toggleInput.textContent = "Quick Search";
      inputContainer.style.background = "linear-gradient(120deg, #c2e9fb, #a1c4fd)";
    } else {
      const input = document.createElement("input");
      input.type = "text";
      input.id = "inputBox";
      input.className = "input";
      input.placeholder = "Search for jobs...";
      input.style.height = "40px";
      input.addEventListener('input', checkAndToggleButton); 
      inputContainer.replaceChild(input, document.getElementById('inputBox'));

      toggleInput.textContent = "AI Assistance";
      inputContainer.style.background = "linear-gradient(120deg, #a1c4fd, #c2e9fb)";
    }
    checkAndToggleButton(); 
  });
  confirmInput.addEventListener('click', function() {
    const randomDurationAI = parseFloat((Math.random() * 10 + 15).toFixed(1));
    const randomDurationQuick = parseFloat((Math.random() * 2 + 1).toFixed(1));

    if (multiLine) {
        showProgress(randomDurationAI, "AI Recommendations will take around 30 seconds to match the result!"); 
        getJobRecommendations();
    } else {
        showProgress(randomDurationQuick, "Quick search algorithm takes about 3 seconds to response!"); 
        fetchJobs();
    }
  });

});

async function getJobRecommendations() {
  const userText = document.getElementById("inputBox").value;
  // alert("AI Recommendations will take around 30 seconds to match the result!");

  try {
    const response = await fetch("https://0qkq06emrj.execute-api.ap-southeast-2.amazonaws.com/I1/getjobrecommendations", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user_text: userText})
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem('jobsData', JSON.stringify(result.data));
      localStorage.setItem('searched', 'true');
      sessionStorage.setItem('searched', 'true');
      window.location.href = "find-jobs.html";
    } else {
      alert("An error occurred: Unexpected AI ERROR PLEASE TRY AGAIN");
    }

  } catch (error) {
    console.error(error);
    alert("An error occurred: Unexpected AI ERROR PLEASE TRY AGAIN");
  }
  finally {
    hideProgress();
  }
}
async function fetchJobs() {
  // alert("Searching algorithm takes about 15 seconds to response!");
  const keyword = document.getElementById("inputBox").value;

  try {

      const response = await fetch('https://0qkq06emrj.execute-api.ap-southeast-2.amazonaws.com/I1/searchresult', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keyword: keyword })
      });


      const data = await response.json();
      // console.log(data.data);
      // alert(data.data);
      if (data.message === "Success!" && data.data && data.data.length > 0) {
        localStorage.setItem('jobsData', JSON.stringify(data.data));
        localStorage.setItem('searched', 'true');
        sessionStorage.setItem('searched', 'true');
        window.location.href = "find-jobs.html";
      } else {
          alert("No jobs found");
      }

  } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching data");
  }
  finally{
    hideProgress();
  }
}

function showProgress(duration, promptMessage) {
  clearInterval(progressInterval); 

  const progressPopup = document.getElementById('progress-popup');
  const progressBar = document.getElementById('progress-bar');
  const timerElem = document.getElementById('timer');
  const searchType = document.getElementById('search_type');

  progressPopup.className = 'popup-shown';
  timerElem.textContent = `In Progress, Approximately: ${0.0}/${duration}.0 seconds`;
  searchType.textContent = promptMessage
  let startTime = Date.now();

  progressInterval = setInterval(() => {
    let elapsedTime = (Date.now() - startTime) / 1000;
    if (elapsedTime >= duration) {
      clearInterval(progressInterval); 
      hideProgress();
    } else {
      progressBar.style.width = `${(elapsedTime / duration) * 100}%`;
      timerElem.textContent = `In Progress, Approximately: ${elapsedTime.toFixed(2)}/${duration}seconds`;
    }
  }, 10); 
}

function hideProgress() {
  const progressPopup = document.getElementById('progress-popup');
  progressPopup.className = 'popup-hidden';
}
function checkAndToggleButton() {

  const toggleInput = document.getElementById('toggleInput');
  const inputBox = document.getElementById("inputBox").value; 
  if (inputBox.trim() !== "") {
   
    toggleInput.style.display = "none"; 
  } else {

    toggleInput.style.display = "block";
  }
}







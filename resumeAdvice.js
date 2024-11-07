document.addEventListener('DOMContentLoaded', function() {
    const anzscoCodeStored = localStorage.getItem('anzsco_code');
    if (anzscoCodeStored) {
        document.getElementById('anzsco_code').textContent = anzscoCodeStored;
        console.log(anzscoCodeStored)
    }
});


async function fetchResumeAdvice() {
    const anzscoCode = document.getElementById('anzsco_code').textContent;
    const experience = document.getElementById('experience').value;
    const interests = document.getElementById('interests').value;
    const skills = document.getElementById('skills').value;

    const payload = {
        body: JSON.stringify({
            anzsco_code: anzscoCode,
            experience: experience,
            interests: interests,
            skills: skills
        })
    };

    try {
        const response = await fetch('https://0qkq06emrj.execute-api.ap-southeast-2.amazonaws.com/I1/getResumeAdvice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        const recommendations = JSON.parse(data.body).recommendations;

        if (recommendations) {
            // console.log(recommendations);
            localStorage.setItem("recommendations",recommendations)
            document.getElementById('adviceOutput').textContent = recommendations;
        } else if (data.error) {
            alert('Error occurred: ' + data.error);
        }
    } catch (err) {
        alert('Request failed: ' + err.toString());
    }
}

async function fetchsynthesiseResume() {
    const anzscoCode = document.getElementById('anzsco_code').textContent;
    const experience = document.getElementById('experience').value;
    const interests = document.getElementById('interests').value;
    const skills = document.getElementById('skills').value;
    const recommendations = localStorage.getItem('recommendations') || "";

    const payload = {
        anzsco_code: anzscoCode,
        experience: experience,
        interests: interests,
        skills: skills,
        advice: recommendations
    };

    try {
        const response = await fetch('https://0qkq06emrj.execute-api.ap-southeast-2.amazonaws.com/I1/systhesiseresume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.resume) {
            console.log(data.resume);
            document.getElementById('synthesisedOutput').textContent = data.resume;
        } else if (data.error) {
            alert('Error occurred: ' + data.error);
        }
    } catch (err) {
        alert('Request failed: ' + err.toString());
    }
}

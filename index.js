var buttonsTextLargeContainer = document.getElementById(
    "buttonsTextLargeContainer"
  );
  if (buttonsTextLargeContainer) {
    buttonsTextLargeContainer.addEventListener("click", function (e) {
      window.location.href = "./find-jobs.html";
    });
  }
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


  document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('scrollToInputButton');  
    const inputElement = document.getElementById('inputContainer');  
  
    if (searchButton && inputElement) {
      searchButton.addEventListener('click', function() {
        smoothScrollTo(inputElement);
      });
    }
  });
  function smoothScrollTo(element) {
    const startPosition = window.pageYOffset;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const halfViewportHeight = viewportHeight / 2; 
    const targetPosition = element.getBoundingClientRect().top + startPosition - halfViewportHeight; // 计算新的目标位置
    const distance = targetPosition - startPosition;
    const duration = 500;
    let startTime = null;
  
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = calculator(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
  
    function calculator(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }
  
    requestAnimationFrame(animation);
  }

  

console.log("PRELOADER: Datei wurde erfolgreich geladen!");
document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const counter = document.getElementById("counter");

  const images = document.querySelectorAll("img");
  let totalImages = images.length;
  let loadedImages = 0;

  function updateCounter() {
    let percent = Math.round((loadedImages / totalImages) * 100);
    counter.textContent = percent + "/100";
  }

  if (totalImages === 0) {
    counter.textContent = "100/100";
    hidePreloader();
    return;
  }

  images.forEach(img => {
    const imageClone = new Image();
    imageClone.src = img.src;

    imageClone.onload = () => {
      loadedImages++;
      updateCounter();
      if (loadedImages === totalImages) hidePreloader();
    };

    imageClone.onerror = () => {
      loadedImages++;
      updateCounter();
      if (loadedImages === totalImages) hidePreloader();
    };
  });

  function hidePreloader() {
    setTimeout(() => {
      preloader.style.opacity = "0";
      preloader.style.transition = "opacity 0.5s";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }, 300);
  }
});
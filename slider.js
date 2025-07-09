window.addEventListener("load", (event) => {
  const sliderElements = document.querySelectorAll('.slider');
  const rootStyles = getComputedStyle(document.documentElement);
  const transitionTime = parseFloat(rootStyles.getPropertyValue('--transition-time').trim());
  const gap = parseFloat(rootStyles.getPropertyValue('--gap').trim());

  sliderElements.forEach(slider => {
    let speed = parseFloat(slider.dataset.speed) || 5000;
    let contentWidth = parseFloat(slider.dataset.size) || 500;
    const totalSlideSize = contentWidth + gap;
    const prevBtn = slider.querySelector('.sb-left');
    const nextBtn = slider.querySelector('.sb-right');
    const container = slider.querySelector('.slider-content-container')
    let slides = slider.querySelectorAll('.slide');
    let firstSlide = slides[0];
    let lastSlide = slides[slides.length - 1];
    let timeoutId;

    slides.forEach((slide) => {
      const image = slide.querySelector('img');
      slide.style.width = `${totalSlideSize}px`;
      image.style.width = `${contentWidth}px`;
    })

    const startTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        slidesForward();
      }, speed);
    }

    slider.addEventListener('mouseenter', () => {
      prevBtn.style.opacity = '0.7';
      nextBtn.style.opacity = '0.7';
    });

    slider.addEventListener('mouseleave', () => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        prevBtn.style.opacity = '0.7';
        nextBtn.style.opacity = '0.7';
      } else {
        prevBtn.style.opacity = '0';
        nextBtn.style.opacity = '0';
      }
    });

    const prependSlides = () => {
      const lastSlideCopy = lastSlide.cloneNode(true);
      lastSlideCopy.style.width = '0px';
      container.prepend(lastSlideCopy);
      requestAnimationFrame(() => {
        lastSlideCopy.style.width = `${totalSlideSize}px`;
      });
    }

    const appendSlides = () => {
      const firstSlideCopy = firstSlide.cloneNode(true);
      container.append(firstSlideCopy);
    }

    const updateSlides = () => {
      slides = slider.querySelectorAll('.slide');
      firstSlide = slides[0];
      lastSlide = slides[slides.length - 1];
    }

    const slidesForward = () => {
      if(!slider.classList.contains("controlsLocked")){
        startTimeout();
        appendSlides();
        firstSlide.style.marginLeft = `-${totalSlideSize}px`;
        slider.classList.add("controlsLocked");
        setTimeout(() => {
          firstSlide.remove();
          updateSlides();
          slider.classList.remove("controlsLocked");
        }, `${transitionTime * 1000}`);
      }
    }

    const slidesBack = () => {
      if(!slider.classList.contains("controlsLocked")){
        startTimeout();
        prependSlides();
        slider.classList.add("controlsLocked");
        setTimeout(() => {
          lastSlide.remove();
          updateSlides();
          slider.classList.remove("controlsLocked");
        }, `${transitionTime * 1000}`);
      }
    }

    startTimeout();

    prevBtn.addEventListener('click', () => {
      slidesBack();
    });

    nextBtn.addEventListener('click', () => {
      slidesForward();
    });
  });
});

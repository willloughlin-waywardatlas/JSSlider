window.addEventListener("load", (event) => {
  const sliderElements = document.querySelectorAll('.slider');
  // const buttons = document.querySelectorAll('.slider-button');
  const rootStyles = getComputedStyle(document.documentElement);
  const transitionTime = parseFloat(rootStyles.getPropertyValue('--transition-time').trim());
  const contentWidth = parseFloat(rootStyles.getPropertyValue('--content-width').trim());
  const gap = parseFloat(rootStyles.getPropertyValue('--gap').trim());
  const totalSlideSize = contentWidth + gap;

  // buttons.forEach((el) => {
  //   el.style.opacity = '1';
  // })

  sliderElements.forEach(slider => {
    const prevBtn = slider.querySelector('.sb-left');
    const nextBtn = slider.querySelector('.sb-right');
    const container = slider.querySelector('.slider-content-container')
    let slides = slider.querySelectorAll('.slide');
    let firstSlide = slides[0];
    let lastSlide = slides[slides.length - 1];
    let timeoutId;

    const startTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        slidesForward();
      }, 5000);
    }

    slider.addEventListener('mouseenter', () => {
      prevBtn.style.opacity = '0.7';
      nextBtn.style.opacity = '0.7';
    });

    slider.addEventListener('mouseleave', () => {
      prevBtn.style.opacity = '0';
      nextBtn.style.opacity = '0';
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






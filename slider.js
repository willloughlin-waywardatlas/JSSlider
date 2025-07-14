window.addEventListener("load", (event) => {
  const sliderElements = document.querySelectorAll('.slider');
  const rootStyles = getComputedStyle(document.documentElement);
  const transitionTime = parseFloat(rootStyles.getPropertyValue('--transition-time').trim());
  const gap = parseFloat(rootStyles.getPropertyValue('--gap').trim());

  //set up lightbox
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';

  const expandedContent = document.createElement('div');
  expandedContent.className = 'expanded-content';

  const closeIcon = document.createElement('i');
  closeIcon.className = 'material-icons';
  closeIcon.textContent = 'close';

  const lightboxParagraph = document.createElement('p');
  lightboxParagraph.className = 'text-content';

  expandedContent.appendChild(closeIcon);
  expandedContent.appendChild(lightboxParagraph);
  lightbox.appendChild(expandedContent);
  document.body.appendChild(lightbox);

  //light box behaviour
  const resetLightbox = () => {
    lightbox.style.display = 'none';
    const clonedContent = document.querySelector('.expanded-content :nth-child(2)');
    if (clonedContent) clonedContent.remove();
  }

  lightbox.addEventListener('click', function (e) {
    if (e.target === this) {
      resetLightbox();
    }
  });

  closeIcon.addEventListener('click', function (e) {
    resetLightbox();
  });

  sliderElements.forEach(slider => {
    slider.addEventListener('click', function (e) {
      const slide = e.target.closest('.slide');
      if (!slide) return;

      const firstChild = slide.firstElementChild;
      if (firstChild) {
        const clonedNode = firstChild.cloneNode(true);
        clonedNode.style.width = 'auto';
        expandedContent.insertBefore(clonedNode, expandedContent.lastChild);
        lightboxParagraph.textContent = clonedNode.alt;
      }

      lightbox.style.display = "flex";
    });
    //set up slider variables
    let thisGap = slider.dataset.gap != undefined ? parseFloat(slider.dataset.gap) : gap;
    let delay = parseFloat(slider.dataset.delay) || 0;
    let speed = parseFloat(slider.dataset.speed) || 5000;
    let contentWidth = parseFloat(slider.dataset.size) || 500;
    const totalSlideSize = contentWidth + thisGap;
    const prevBtn = slider.querySelector('.sb-left');
    const nextBtn = slider.querySelector('.sb-right');
    const container = slider.querySelector('.slider-content-container')
    let slides = slider.querySelectorAll('.slide');
    let firstSlide = slides[0];
    let lastSlide = slides[slides.length - 1];
    let timeoutId;

    if( thisGap != gap ) {
      slider.style.paddingTop = `${thisGap}px`;
      slider.style.paddingBottom = `${thisGap}px`;
    }


    slides.forEach((slide) => {
      const image = slide.querySelector('img');
      const video = slide.querySelector('video');
      if( thisGap != gap ) {
        if(image) {
        image.style.marginRight = `${thisGap}px`;
        }
        if(video) {
          video.style.marginRight = `${thisGap}px`;
        }
      }

      slide.style.width = `${totalSlideSize}px`;
      if(image) {
        image.style.width = `${contentWidth}px`;
      }
      if(video) {
        video.style.width = `${contentWidth}px`;
      }
    })

    const startTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        slidesForward();
      }, ( speed + delay ));
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
      container.style.transform = `translateX(${totalSlideSize}px)`;
      const lastSlideCopy = lastSlide.cloneNode(true);
      container.prepend(lastSlideCopy);
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
      if (!slider.classList.contains("controlsLocked")) {
        if (delay) delay = 0;
        startTimeout();
        appendSlides();
        container.style.transition = `transform ${transitionTime}s`;
        container.style.transform = `translateX(-${totalSlideSize}px)`;
        slider.classList.add("controlsLocked");
        setTimeout(() => {
          container.style.transition = "none";
          requestAnimationFrame(() => {
            container.style.transform = "translateX(0px)";
            container.offsetHeight;
            container.style.transition = `transform ${transitionTime}s`;
            firstSlide.remove();
            updateSlides();
            slider.classList.remove("controlsLocked");
          });
        }, transitionTime * 1000);
      }
    };

    const slidesBack = () => {
      if(!slider.classList.contains("controlsLocked")){
        startTimeout();
        prependSlides();
        container.style.transition = "none";
        container.style.transform = `translateX(-${totalSlideSize}px)`;
        requestAnimationFrame(() => {
          container.style.transition = `transform ${transitionTime}s`;
          container.style.transform = "translateX(0px)";
          slider.classList.add("controlsLocked");
          setTimeout(() => {
            lastSlide.remove();
            updateSlides();
            slider.classList.remove("controlsLocked");
          }, `${transitionTime * 1000}`);
        });
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

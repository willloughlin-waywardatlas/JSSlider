window.addEventListener("load", (event) => {
  const rootStyles = getComputedStyle(document.documentElement);
  const transitionTime = parseFloat(rootStyles.getPropertyValue('--transition-time').trim());
  const gap = parseFloat(rootStyles.getPropertyValue('--gap').trim());

  //set up slider data object
  const sliderElements = document.querySelectorAll('.slider');
  const sliderArray = [...document.querySelectorAll('.slider')];
  const sliderData = sliderArray.map((slider) => {
    let contentWidth;
    if( slider.dataset.fit != undefined ) {
      contentWidth = updateDynamicContentWidth(slider);
    } else {
      contentWidth = parseFloat(slider.dataset.size) || 500;
    }
    const thisGap = slider.dataset.gap != undefined ? parseFloat(slider.dataset.gap) : gap;
    const border = slider.dataset.border != undefined ? parseFloat(slider.dataset.border) : 0;
    return {
      sliderEl: slider,
      gap: slider.dataset.gap != undefined ? parseFloat(slider.dataset.gap) : gap,
      delay: parseFloat(slider.dataset.delay) || 0,
      speed: parseFloat(slider.dataset.speed) || 5000,
      prevBtn: slider.querySelector('.sb-left'),
      nextBtn: slider.querySelector('.sb-right'),
      container: slider.querySelector('.slider-content-container'),
      slides: slider.querySelectorAll('.slide'),
      contentWidth: contentWidth,
      totalSlideSize: contentWidth + thisGap + (border * 2),
      border: border
    }
  })

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

  //Handle slider behaviour
  sliderData.forEach(entry => {
    const slider = entry.sliderEl;
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

    if( slider.dataset.size != undefined && slider.dataset.fit != undefined ) {
      console.error('data-size and data-fit cannot both be used, the slider will either work to specified slide size or fit the amount of slides specified.')
      return
    }

    let firstSlide = entry.slides[0];
    let lastSlide = entry.slides[entry.slides.length - 1];
    let timeoutId;

    if( entry.gap != gap ) {
      slider.style.paddingTop = `${entry.gap}px`;
      slider.style.paddingBottom = `${entry.gap}px`;
    }

    entry.slides.forEach((slide) => {
      const image = slide.querySelector('img');
      const video = slide.querySelector('video');
      if( entry.gap != gap ) {
        if(image) {
        image.style.marginRight = `${entry.gap}px`;
        }
        if(video) {
          video.style.marginRight = `${entry.gap}px`;
        }
      }

      slide.style.width = `${entry.totalSlideSize}px`;
      if(image) {
        image.style.width = `${entry.contentWidth}px`;
      }
      if(video) {
        video.style.width = `${entry.contentWidth}px`;
      }
    })

    const startTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        slidesForward();
      }, ( entry.speed + entry.delay ));
    }

    slider.addEventListener('mouseenter', () => {
      entry.prevBtn.style.opacity = '0.7';
      entry.nextBtn.style.opacity = '0.7';
    });

    slider.addEventListener('mouseleave', () => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        entry.prevBtn.style.opacity = '0.7';
        entry.nextBtn.style.opacity = '0.7';
      } else {
        entry.prevBtn.style.opacity = '0';
        entry.nextBtn.style.opacity = '0';
      }
    });

    const prependSlides = () => {
      entry.container.style.transform = `translateX(${entry.totalSlideSize}px)`;
      const lastSlideCopy = lastSlide.cloneNode(true);
      entry.container.prepend(lastSlideCopy);
    }

    const appendSlides = () => {
      const firstSlideCopy = firstSlide.cloneNode(true);
      entry.container.append(firstSlideCopy);
    }

    const updateSlides = () => {
      entry.slides = slider.querySelectorAll('.slide');
      firstSlide = entry.slides[0];
      lastSlide = entry.slides[entry.slides.length - 1];
    }

    const slidesForward = () => {
      if (!slider.classList.contains("controlsLocked")) {
        if (entry.delay) entry.delay = 0;
        startTimeout();
        appendSlides();
        entry.container.style.transition = `transform ${transitionTime}s`;
        entry.container.style.transform = `translateX(-${entry.totalSlideSize}px)`;
        slider.classList.add("controlsLocked");
        setTimeout(() => {
          entry.container.style.transition = "none";
          requestAnimationFrame(() => {
            entry.container.style.transform = "translateX(0px)";
            entry.container.offsetHeight;
            entry.container.style.transition = `transform ${transitionTime}s`;
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
        entry.container.style.transition = "none";
        entry.container.style.transform = `translateX(-${entry.totalSlideSize}px)`;
        requestAnimationFrame(() => {
          entry.container.style.transition = `transform ${transitionTime}s`;
          entry.container.style.transform = "translateX(0px)";
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

    entry.prevBtn.addEventListener('click', () => {
      slidesBack();
    });

    entry.nextBtn.addEventListener('click', () => {
      slidesForward();
    });

  });

  function updateDynamicContentWidth(slider) {
    const sliderWidth = slider.getBoundingClientRect().width;
    const thisGap = slider.dataset.gap != undefined ? parseFloat(slider.dataset.gap) : gap;
    const border = slider.dataset.border != undefined ? parseFloat(slider.dataset.border) : 0;
    const amountOfSlides = slider.dataset.fit = parseFloat(slider.dataset.fit);
    const contentWidth = ((sliderWidth - ((amountOfSlides * 2) * border)) - (thisGap * (amountOfSlides - 1 ))) / amountOfSlides;
    return contentWidth;
  }

  window.addEventListener("resize", (event) => {
    sliderData.forEach((entry) => {
      if( entry.sliderEl.dataset.fit != undefined ) {
        entry.contentWidth = updateDynamicContentWidth(entry.sliderEl);
        entry.totalSlideSize = entry.contentWidth + entry.gap + (entry.border * 2);

        entry.slides.forEach((slide) => {
          const image = slide.querySelector('img');
          const video = slide.querySelector('video');
          slide.style.width = `${entry.totalSlideSize}px`;
          if(image) {
            image.style.width = `${entry.contentWidth}px`;
          }
          if(video) {
            video.style.width = `${entry.contentWidth}px`;
          }
        })
      }
    })
  });
});




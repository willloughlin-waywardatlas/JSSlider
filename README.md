# JS slider example page

The slider will automatically advance a slide every 5 seconds unless the user manually interacts with the slide control buttons. Slide control buttons are hidden until mouseover. Slide controls are locked during transition for stability purposes.

## Parameter adjustment through data
The following can be passed as a data-set to the Slider element.
### data-speed
In milliseconds, controls the rate the slide are automatically progressed when idle.
### data-size
Float representing pixel width. Helps to control both display size and thumbnail cropping.
### data-delay
In milliseconds, how long to de-sync the slider from the default, usefull when multiple sliders exist within one visible area.
### data-gap
Float representing pixel size, change the default gap used around the slides.
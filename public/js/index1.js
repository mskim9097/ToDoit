document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector("#onboardingCarousel");
    const carouselInstance = new bootstrap.Carousel(carousel, {
        interval: false, // Disable auto-slide
        wrap: false // Prevent looping
    });

    const nextButtons = document.querySelectorAll(".next-slide");
    const prevButtons = document.querySelectorAll(".prev-slide");
    const skipButton = document.querySelector(".skip-slide");

    // Move to next slide
    nextButtons.forEach(button => {
        button.addEventListener("click", function () {
            carouselInstance.next();
        });
    });

    // Move to previous slide
    prevButtons.forEach(button => {
        button.addEventListener("click", function () {
            carouselInstance.prev();
        });
    });

    // Skip to the last slide
    if (skipButton) {
        skipButton.addEventListener("click", function () {
            let lastIndex = document.querySelectorAll(".carousel-item").length - 1;
            carouselInstance.to(lastIndex);
        });
    }
});

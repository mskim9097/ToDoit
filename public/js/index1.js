document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector("#onboardingCarousel");
    const carouselInstance = new bootstrap.Carousel(carousel, {
        interval: false, // Disable auto-slide
        wrap: false // Prevent looping
    });

    // "Get Started" button: Moves to next slide
    document.querySelector(".bottom-btn").addEventListener("click", function (event) {
        event.preventDefault();
        carouselInstance.next(); // Moves to next slide
    });


});

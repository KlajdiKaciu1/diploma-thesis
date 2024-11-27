import React, { useState, useEffect } from 'react';

const PhotoCarousel = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? photos.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const isLastSlide = currentIndex === photos.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (slideIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(slideIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2000); // Slide transition every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]); // Depend on currentIndex and isAnimating

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="w-full h-64 md:h-96 overflow-hidden relative">
        <div className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${isAnimating ? 'transform scale-105 opacity-90' : 'transform scale-100 opacity-100'}`}>
          <img
            src={`http://localhost:3000/${photos[currentIndex]}`}
            alt={`Slide ${currentIndex}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300 ease-in-out"
      >
        &#8592;
      </button>
      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300 ease-in-out"
      >
        &#8594;
      </button>
      {/* Dots */}
      <div className="flex justify-center py-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ease-in-out ${
              currentIndex === index ? 'bg-gray-800 scale-110' : 'bg-gray-400'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;

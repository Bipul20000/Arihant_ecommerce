import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: assets.hero_img,
      title: "Uniquely Crafted",
      subtitle: "Styles for Your Life",
      buttonText: "Shop Collection"
    },
    {
      id: 2,
      image: assets.hero_img,
      title: "Experience Audio",
      subtitle: "Unparalleled Elegance",
      buttonText: "Shop Now"
    },
    {
      id: 3,
      image: assets.hero_img,
      title: "New Arrivals",
      subtitle: "Fashion That Moves",
      buttonText: "Explore More"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    // 👇 FIX: Use w-screen and a special margin calculation to break out of the parent container
    <div className='relative w-screen h-screen bg-gray-900 text-white overflow-hidden ml-[calc(-50vw+50%)]'>
      
      {/* --- Slides Container --- */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <img 
            src={slide.image} 
            className='w-full h-full object-cover object-center opacity-70' 
            alt={slide.title} 
          />

          {/* Text Content Overlay */}
          {/* 👇 NOTE: We add padding BACK here so the text aligns with your Logo */}
          <div className='absolute inset-0 flex flex-col justify-center items-start z-20 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
            <div className='max-w-xl'>
                <div className='overflow-hidden'>
                <p className={`text-sm sm:text-lg font-medium uppercase tracking-widest mb-2 text-gray-300 transform transition-transform duration-700 delay-300 ${index === currentSlide ? 'translate-y-0' : 'translate-y-10 opacity-0'}`}>
                    {slide.title}
                </p>
                </div>
                
                <div className='overflow-hidden mb-8'>
                <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight transform transition-transform duration-700 delay-500 ${index === currentSlide ? 'translate-y-0' : 'translate-y-full opacity-0'}`}>
                    {slide.subtitle}
                </h1>
                </div>

                <Link 
                to='/collection' 
                className={`inline-block border border-white px-8 py-3 text-sm sm:text-base uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 transform ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                {slide.buttonText}
                </Link>
            </div>
          </div>
        </div>
      ))}

      {/* --- Navigation Arrows --- */}
      <div className='absolute bottom-10 right-4 sm:right-[5vw] md:right-[7vw] lg:right-[9vw] z-30 flex gap-4'>
        <button 
          onClick={prevSlide} 
          className='w-12 h-12 border border-white/50 flex items-center justify-center rounded-full hover:bg-white hover:text-black transition-colors bg-black/20 backdrop-blur-sm'
        >
          <img className='w-4 rotate-180 invert hover:invert-0' src={assets.dropdown_icon} alt="Prev" style={{filter: 'invert(1)'}} /> 
        </button>
        <button 
          onClick={nextSlide} 
          className='w-12 h-12 border border-white/50 flex items-center justify-center rounded-full hover:bg-white hover:text-black transition-colors bg-black/20 backdrop-blur-sm'
        >
           <img className='w-4 invert hover:invert-0' src={assets.dropdown_icon} alt="Next" style={{filter: 'invert(1)'}} />
        </button>
      </div>

    </div>
  );
};

export default Hero;
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const offers = [
  {
    image: "/offer1.png",
    alt: "SafeGo offer 1",
  },
  {
    image: "/offer2.png",
    alt: "SafeGo offer 2",
  },
  {
    image: "/offer3.png",
    alt: "SafeGo offer 3",
  },
];

const Offers = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + offers.length) % offers.length);
  };

  return (
    <section className="w-full ">
      {/* Heading */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          Special Offers
        </h2>

        <span className="text-sm text-emerald-400">
          {current + 1} / {offers.length}
        </span>
      </div>

      {/* Carousel */}
      <div className="relative w-full  overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
        
        {/* Images */}
        <div className="relative aspect-[3/1] w-full">
          {offers.map((offer, index) => (
            <img
              key={index}
              src={offer.image}
              alt={offer.alt}
              className={`
                absolute inset-0
                h-full w-full
                object-cover
                transition-all duration-500 ease-in-out
                ${
                  current === index
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4"
                }
              `}
            />
          ))}
        </div>

        {/* Previous button */}
        <button
          onClick={prevSlide}
          className="
            absolute left-3 top-1/2 -translate-y-1/2
            flex h-9 w-9 items-center justify-center
            rounded-full
            bg-black/40 backdrop-blur-sm
            text-white
            transition
            hover:bg-black/60
            active:scale-95
          "
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next button */}
        <button
          onClick={nextSlide}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            flex h-9 w-9 items-center justify-center
            rounded-full
            bg-black/40 backdrop-blur-sm
            text-white
            transition
            hover:bg-black/60
            active:scale-95
          "
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div
          className="
            absolute bottom-3 left-1/2
            flex -translate-x-1/2
            items-center gap-2
            rounded-full
            bg-black/30
            px-3 py-1.5
            backdrop-blur-sm
          "
        >
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`Go to offer ${index + 1}`}
              className={`
                h-2 rounded-full
                transition-all duration-300
                ${
                  current === index
                    ? "w-6 bg-emerald-400"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offers;
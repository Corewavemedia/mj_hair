import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { useState, useEffect } from "react";

import { IconStar } from "./Icons";

const testimonials = [
    {
        name: "Amelia",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200",
        review: "The quality of the bundles is outstanding. Minimal shedding, true to length, and my clients keep coming back for installs using this hair. Wholesale pricing is fair for the consistency."
    },
    {
        name: "Sophie",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200",
        review: "Delivery across the UK was quicker than I expected and the packaging felt premium. The hair holds curls beautifully and still feels soft after washing. Definitely reordering for my salon."
    },
    {
        name: "Charlotte",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&h=200",
        review: "I have tried multiple suppliers and this is by far the most reliable. The density is full from root to tip and the lace melts perfectly. Customer service is responsive and professional."
    }
];

export default function Testimonials() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(1);

    // Auto-scroll every 3 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentSlide((prev) => (prev + 1) % testimonials.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [currentSlide]); // Reset timer when slide changes

    const handleDotClick = (index: number) => {
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
    };

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const swipeThreshold = 50;

        if (info.offset.x > swipeThreshold) {
            // Swiped right - go to previous
            setDirection(-1);
            setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        } else if (info.offset.x < -swipeThreshold) {
            // Swiped left - go to next
            setDirection(1);
            setCurrentSlide((prev) => (prev + 1) % testimonials.length);
        }
    };

    return (
        <section className="pb-12">
            <div className="max-w-[1400px] mx-auto px-6">
                <motion.h2
                    className="font-['Cambay'] font-bold text-5xl text-[#C9834E] mb-12 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    Testimonials
                </motion.h2>

                {/* Mobile Slider - Single testimonial */}
                <div className="md:hidden relative overflow-hidden pt-12">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentSlide}
                            custom={direction}
                            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={handleDragEnd}
                            className="p-10 rounded-[30px] border border-gray-100 shadow-xl bg-white relative cursor-grab active:cursor-grabbing"
                        >
                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <IconStar key={star} />
                                ))}
                            </div>
                            <p className="font-['Manrope'] text-gray-500 leading-relaxed mb-8">
                                "{testimonials[currentSlide].review}"
                            </p>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white py-2 pl-3 pr-10 w-max rounded-full flex items-center gap-4 shadow-md">
                                <img
                                    src={testimonials[currentSlide].image}
                                    alt="User"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <h4 className="font-bold text-lg whitespace-nowrap text-[#1A1A1A]">
                                    {testimonials[currentSlide].name}
                                </h4>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Desktop Grid - All testimonials */}
                <motion.div
                    className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-[27px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                    }}
                >
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={idx}
                            className={`p-10 rounded-[30px] border border-gray-100 bg-white relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-2`}
                            variants={{
                                hidden: { opacity: 0, scale: 0.9, y: 30 },
                                visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                            }}
                        >
                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <IconStar key={star} />
                                ))}
                            </div>
                            <p className="font-['Manrope'] text-gray-500 leading-relaxed mb-8">
                                "{testimonial.review}"
                            </p>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white py-2 pl-3 pr-8 w-max rounded-full flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt="User"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <h4 className="font-bold text-lg whitespace-nowrap text-[#1A1A1A]">
                                    {testimonial.name}
                                </h4>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Slider Dots */}
                <div className="flex lg:hidden justify-center gap-2 mt-16 z-20">
                    {testimonials.map((_, idx) => (
                        <motion.div
                            key={idx}
                            onClick={() => handleDotClick(idx)}
                            className={`w-20 h-2 rounded-full cursor-pointer shadow-sm transition-all duration-300 ${currentSlide === idx ? 'bg-[#C9834E]' : 'bg-gray-300'
                                }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Hero from "../components/Hero";
import About from "../components/About";
import WhatWeSell from "../components/WhatWeSell";
import HowToOrder from "../components/HowToOrder";
import ShopSection from "../components/ShopSection";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import Marquee from "../components/Marquee";
import Navbar from "../components/Navbar";

export default function Home() {
    const trackVisit = useMutation(api.visitors.trackVisit);

    useEffect(() => {
        const hasTracked = sessionStorage.getItem("visitorTracked");
        if (!hasTracked) {
            // Generate a simple pseudo-fingerprint
            const ipHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            trackVisit({
                ipHash,
                userAgent: navigator.userAgent,
                path: window.location.pathname,
            }).catch(console.error);

            sessionStorage.setItem("visitorTracked", "true");
        }
    }, [trackVisit]);

    return (
        <div className="relative min-h-screen w-screen bg-white font-['Manrope',sans-serif]">
            <Navbar />
            <Hero />
            <Marquee />
            <About />
            <WhatWeSell />
            <HowToOrder />
            <ShopSection />
            <Testimonials />
            <Footer />
        </div>
    );
}

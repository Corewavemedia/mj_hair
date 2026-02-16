import { motion } from "framer-motion";

const marqueeItems = [
    "Bouncy Curls",
    "*",
    "Bone Straight",
    "*",
    "Pixie Hairs",
    "*",
    "Bouncy Curls",
    "*",
    "Bone Straight",
    "*",
    "Pixie Hairs",
    "*",
];

export default function Marquee() {
    return (
        <motion.div
            className="w-full max-w-[1100px] mx-auto bg-gradient-to-r from-[#EF2460] to-[#861134] md:rounded-full overflow-hidden will-change-transform"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
        >
            <div className="flex py-5 font-['Comfortaa'] font-bold text-base tracking-wide whitespace-nowrap">
                <motion.div
                    className="flex gap-4 text-white justify-center items-center"
                    animate={{
                        x: ["0%", "-50%"],
                    }}
                    transition={{
                        x: {
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear",
                        },
                    }}
                >
                    {/* Duplicate content for seamless loop */}
                    {[...marqueeItems, ...marqueeItems].map((item, index) => (
                        <span key={index} className="px-2">
                            {item}
                        </span>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import imgBag from "../assets/a597fb58038f17b44a734de07791477dd0797eff.png";
import imgStraightHair from "../assets/6d8b5a18e526ded7afffc43755e08f0276665eba.png";
import imgCurlyHair from "../assets/b5e43fa3d431b7a54cde245ae230c1db7ea0d6c8.png";

export default function About() {
    return (
        <section id="about" className="w-full lg:px-[50px] py-24 max-w-[1400px] lg:mx-auto">
            <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">

                {/* Left Side - Image Collage */}
                <motion.div
                    className="w-full lg:w-[470px] relative min-h-[500px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* Back Top-Left Image (Bag) */}
                    <motion.div
                        className="absolute top-0 left-0 w-[350px] lg:w-[405px] h-[150px] z-0 rounded-[20px] overflow-hidden shadow-lg"
                        variants={{
                            hidden: { opacity: 0, x: -50, rotate: -10 },
                            visible: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.8 } }
                        }}
                    >
                        <img
                            src={imgBag}
                            className="w-full h-auto object-cover"
                            alt="Jenny's Bag"
                            loading="lazy"
                            decoding="async"
                        />
                    </motion.div>

                    {/* Back Bottom-Left Image (Straight Hair) */}
                    <motion.div
                        className="absolute top-[169px] left-0 w-[170px] lg:w-[185px] h-[290px] z-10 rounded-[15px] overflow-hidden shadow-lg border-2 border-white"
                        variants={{
                            hidden: { opacity: 0, scale: 0.8, y: 50 },
                            visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } }
                        }}
                    >
                        <img
                            src={imgCurlyHair}
                            className="w-full h-full object-cover"
                            alt="Curly Hair"
                            loading="lazy"
                            decoding="async"
                        />
                    </motion.div>

                    {/* Front Right Image (Curly Hairs - Main Focus) */}
                    <motion.div
                        className="absolute top-[46px] left-[173px] lg:left-[188px] w-[240px] lg:w-[282px] h-[293px] z-20 rounded-[15px] overflow-hidden shadow-2xl border-[8px] border-white"
                        variants={{
                            hidden: { opacity: 0, x: 50, scale: 1.1 },
                            visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 } }
                        }}
                        whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                    >
                        <img
                            src={imgStraightHair}
                            className="w-full h-full object-cover"
                            alt="Curly Hair"
                            loading="lazy"
                            decoding="async"
                        />
                    </motion.div>

                    {/* Shop Now Button */}
                    <motion.div
                        className="absolute top-[352px] left-[180px] lg:left-[203px]"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.6 } }
                        }}
                    >
                        <Link to="/shop">
                            <motion.div
                                className="bg-gradient-to-r from-[#EF2460] to-[#991438] text-white w-[204px] lg:w-[254px] h-[80px] lg:h-[104px] px-auto lg:px-10 py-3.5 rounded-2xl font-['Comfortaa'] text-[24px] lg:text-[32px] font-bold shadow-xl flex items-center justify-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                    y: [0, -5, 0],
                                }}
                                transition={{
                                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                }}
                            >
                                Shop Now
                            </motion.div>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right Side - Content */}
                <motion.div
                    className="w-full lg:w-1/2 lg:flex-1 flex flex-col lg:pl-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
                    }}
                >
                    {/* Typography: ABOUT JENNY'S HAIR & WIGS */}
                    <motion.h2
                        className="font-['Buenard'] text-3xl lg:text-4xl mb-[23px] tracking-wide"
                        variants={{
                            hidden: { opacity: 0, x: 20 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                        }}
                    >
                        <span className="text-[#333333] font-normal">ABOUT </span>
                        <span className="text-[#EF2460] font-['Unna'] font-bold">JENNY'S </span>
                        <span className="text-[#8B1A3A] font-normal">HAIR & WIGS</span>
                    </motion.h2>

                    {/* Dark Gradient Content Box */}
                    <motion.div
                        className="bg-gradient-to-br from-[#2D0F18] via-[#3D1420] to-[#961A3F] rounded-[32px] lg:-mr-[52px] px-[50px] lg:pl-[63px] lg:pr-[84px] py-[38px] shadow-2xl relative overflow-hidden text-white/90 font-['Inter'] leading-relaxed h-fit flex flex-col justify-center"
                        variants={{
                            hidden: { opacity: 0, scale: 0.95, y: 20 },
                            visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                        }}
                        whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                    >
                        <motion.p className="mb-6 text-[15px] lg:text-[16px]" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                            Jenny's hair has grown to become one of the leading premium hair brand since it's establishment in 2017. 
                            A brand based in the UK supplies hair worldwide with a vast clientele in UK, 
                            USA and Africa. 
                            Part of Jenny's hair growth has also been its signature wig making which was established by a self taught and as well as Jenny's quality hair supply has been a major trend for the brand. 
                            Jenny's hair as a brand continues to grow thinking of more innovative styles for existing and new customers. 
                            Check out our very exciting products and services below. 
                            Our team are here to help you feel and look amazing.
                        </motion.p>
                        <motion.p className="text-[15px] lg:text-[16px]" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                            Your satisfaction is top priority
                        </motion.p>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
}
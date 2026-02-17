import { Mail, MapPin, Phone } from "lucide-react";
import imgJennyLogo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { siInstagram, siTiktok, siWhatsapp } from 'simple-icons/icons';
import { useState } from "react";
import OrderPolicyModal from "./OrderPolicyModal";


export default function Footer() {
    const [isOrderPolicyOpen, setIsOrderPolicyOpen] = useState(false);

    return (
        <footer className="relative mt-0 bg-gradient-to-br from-[#861134] to-[#2d020e] text-white pt-20 pb-10 overflow-hidden font-['Manrope']">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#EF2460] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#EF2460] rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                {/* Newsletter Section */}
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-xl">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold font-['Comfortaa'] mb-2">Join the VIP List</h3>
                        <p className="text-pink-100/80">Get exclusive offers, early access, and beauty tips.</p>
                    </div>
                    <form className="flex w-full md:w-auto gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#EF2460] transition w-full md:w-[300px]"
                        />
                        <button className="bg-[#EF2460] hover:bg-[#d01b50] text-white px-6 py-3 rounded-xl font-bold transition shadow-lg hover:shadow-[#EF2460]/50 whitespace-nowrap">
                            Sign Up
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-12">
                    {/* Brand Column */}
                    <div className="md:col-span-1 space-y-6">
                        <Link to="/">
                            <img src={imgJennyLogo} alt="Jenny's Hair" className="h-10 opacity-90" />
                        </Link>
                        <p className="text-white/70 leading-relaxed text-sm">
                            United Kingdom's No. 1 Supplier for premium hairs and wigs. Elevating confidence, one bundle at a time.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/jennyshairandwig_coventry" target="_blank" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#EF2460] flex items-center justify-center transition-all duration-300 border border-white/10 group">
                                <svg role="img" viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white group-hover:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg">
                                    <title>{siInstagram.title}</title>
                                    <path d={siInstagram.path} />
                                </svg>
                            </a>
                            <a href="https://www.tiktok.com/@jennyshair_and_wig_uk" target="_blank" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#EF2460] flex items-center justify-center transition-all duration-300 border border-white/10 group">
                                <svg role="img" viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white group-hover:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg">
                                    <title>{siTiktok.title}</title>
                                    <path d={siTiktok.path} />
                                </svg>
                            </a>
                            <a href="https://wa.me/447404699950" target="_blank" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#EF2460] flex items-center justify-center transition-all duration-300 border border-white/10 group">
                                <svg role="img" viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white group-hover:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg">
                                    <title>{siWhatsapp.title}</title>
                                    <path d={siWhatsapp.path} />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-['Comfortaa'] text-lg font-bold mb-6">Shop</h4>
                        <ul className="space-y-4 text-white/70 text-sm">
                            <li><Link to="/shop" className="hover:text-[#EF2460] transition">All Products</Link></li>
                            <li><Link to="/shop?category=wigs" className="hover:text-[#EF2460] transition">Wigs</Link></li>
                            <li><Link to="/shop?category=bundles" className="hover:text-[#EF2460] transition">Bundles</Link></li>
                            <li><Link to="/shop?category=accessories" className="hover:text-[#EF2460] transition">Accessories</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-['Comfortaa'] text-lg font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-white/70 text-sm">
                            <li><Link to="/about" className="hover:text-[#EF2460] transition">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-[#EF2460] transition">Contact</Link></li>
                            <li>
                                <button
                                    onClick={() => setIsOrderPolicyOpen(true)}
                                    className="hover:text-[#EF2460] transition text-left"
                                >
                                    Order Policy and Return Guide
                                </button>
                            </li>
                            <li><Link to="/terms" className="hover:text-[#EF2460] transition">Terms & Privacy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-['Comfortaa'] text-lg font-bold mb-6">Contact</h4>
                        <ul className="space-y-6 text-white/70 text-sm">
                            <li className="flex flex-col">
                                <Phone size={16} className="text-[#EF2460]" />
                                <span>+447404699950</span>
                            </li>
                            <li className="flex flex-col">
                                <Mail size={16} className="text-[#EF2460]" />
                                <a href="mailto:jennyshairandwig@gmail.com" className="hover:text-[#EF2460] transition">jennyshairandwig@gmail.com</a>
                            </li>
                            <li className="flex flex-col">
                                <MapPin size={16} className="text-[#EF2460]" />
                                <span>Cv2 3nq, Topcross avenue, Coventry</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
                     <a href="https://wa.me/2349120014546" target="_blank" rel="noopener noreferrer" className="hover:text-[#EF2460] transition"><p>© Designed by corewave media</p></a>
                    <div className="flex gap-6 items-center">
                        <div className="flex gap-2">
                            <span className="bg-white/10 px-2 py-1 rounded text-xs text-white/80">Visa</span>
                            <span className="bg-white/10 px-2 py-1 rounded text-xs text-white/80">Mastercard</span>
                            <span className="bg-white/10 px-2 py-1 rounded text-xs text-white/80">PayPal</span>
                        </div>
                    </div>
                </div>
            </div>

            <OrderPolicyModal isOpen={isOrderPolicyOpen} onClose={() => setIsOrderPolicyOpen(false)} />
        </footer>
    );
}

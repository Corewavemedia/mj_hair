import { ChevronDown, ChevronUp, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function HelpCenter() {
    return (
        <div className="bg-white rounded-[24px] p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-['Poppins']">Help Center</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div
                    onClick={() => window.location.href = "mailto:support@mjhair.example.com"}
                    className="p-6 rounded-2xl bg-blue-50 hover:bg-blue-100 transition cursor-pointer group"
                >
                    <Mail className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-gray-800 mb-1">Email Support</h3>
                    <p className="text-sm text-gray-500">Get a response within 24h</p>
                </div>
                <div
                    onClick={() => alert("Live Chat unavailable. Please email us.")}
                    className="p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition cursor-pointer group"
                >
                    <MessageCircle className="w-8 h-8 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-gray-800 mb-1">Live Chat</h3>
                    <p className="text-sm text-gray-500">Available 9am - 5pm</p>
                </div>
            </div>

            <h3 className="font-bold text-lg text-gray-800 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
                <FAQItem
                    question="How long does shipping take?"
                    answer="Standard shipping typically takes 3-5 business days. Express delivery is available for 1-2 day delivery within the UK."
                />
                <FAQItem
                    question="Can I return my order?"
                    answer="Yes, we accept returns within 14 days of delivery provided the item is unused and in its original packaging."
                />
                <FAQItem
                    question="How do I track my order?"
                    answer="Once your order ships, you will receive an email with a tracking number which you can use to monitor the status of your delivery."
                />
                <FAQItem
                    question="Do you ship internationally?"
                    answer="Currently we primarily ship within the United Kingdom. International shipping options may be available upon request."
                />
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden transition-all hover:shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50/50 transition"
            >
                <span className="font-bold text-gray-700 text-sm">{question}</span>
                {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            {isOpen && (
                <div className="p-4 pt-0 text-sm text-gray-500 bg-white">
                    {answer}
                </div>
            )}
        </div>
    );
}

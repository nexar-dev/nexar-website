import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhatWeCreateSection from "@/components/WhatWeCreateSection";
import ImagineSection from "@/components/ImagineSection";
import ProcessSection from "@/components/ProcessSection";
import WhySystemSection from "@/components/WhySystemSection";
import MeetingsSection from "@/components/MeetingsSection";
import DemoSection from "@/components/DemoSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import NeedsQuestionnaire from "@/components/NeedsQuestionnaire";

export default function Index() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="overflow-x-hidden">
      <Navbar onOpenQuestionnaire={() => setShowQuestionnaire(true)} />
      <HeroSection onOpenQuestionnaire={() => setShowQuestionnaire(true)} />
      <WhatWeCreateSection />
      <ImagineSection />
      <ProcessSection />
      <WhySystemSection />
      <MeetingsSection />
      <DemoSection />
      <CTASection onOpenQuestionnaire={() => setShowQuestionnaire(true)} />
      <Footer />

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/553598499733"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-16 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-purple text-primary-foreground shadow-glow transition-all duration-300 hover:scale-110 hover:shadow-card-hover active:scale-110"
        aria-label="Conversar no WhatsApp"
        animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={shouldReduceMotion ? undefined : { duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <MessageCircle size={24} />
      </motion.a>

      {showQuestionnaire && (
        <NeedsQuestionnaire onClose={() => setShowQuestionnaire(false)} />
      )}
    </main>
  );
}

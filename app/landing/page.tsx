"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useEffect } from "react";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();

  // --- Force Unlock Scroll (Bypassing global app CSS locks) ---
  useEffect(() => {
    const originalBodyStyle = document.body.style.overflow;
    const originalBodyPos = document.body.style.position;
    const originalHtmlStyle = document.documentElement.style.overflow;

    document.body.style.overflow = "auto";
    document.body.style.position = "static";
    document.documentElement.style.overflow = "auto";

    return () => {
      document.body.style.overflow = originalBodyStyle;
      document.body.style.position = originalBodyPos;
      document.documentElement.style.overflow = originalHtmlStyle;
    };
  }, []);

  // Parallax the hero down effortlessly as we navigate to the next section
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <div className="relative min-h-[600dvh] bg-[#FDFBF7] text-[#1A1714] selection:bg-[#BE3423] selection:text-[#FDFBF7] font-sans overflow-x-hidden">
      
      {/* ------------------------------------------------------------
          MOVEMENT 01: THE INHALE
      ------------------------------------------------------------- */}
      <section className="h-[100dvh] w-full flex flex-col items-center justify-center px-6 md:px-12 relative overflow-hidden bg-[#FDFBF7]">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] mix-blend-multiply" />
        
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 0.1], [0, -50]), opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="relative z-10 flex flex-col items-center text-center max-w-[1200px]"
        >
          <motion.div className="mb-8 font-jost uppercase tracking-[0.8em] text-[10px] text-[#BE3423] font-black">
            The Poetik Manifesto
          </motion.div>
          <h1 className="font-playfair text-[clamp(4.5rem,18vw,14rem)] font-normal leading-[0.75] tracking-[-0.05em] mb-12">
            BECAUSE <br/>
            <span className="text-[#BE3423] italic">LANGUAGE</span> <br/>
            STAYED.
          </h1>
          <p className="font-cormorant text-2xl md:text-3xl text-[#1A1714]/60 max-w-[500px] leading-snug italic">
            "Poetry is when an emotion has found its thought and the thought has found words."
          </p>
          <div className="mt-16 w-[1px] h-24 bg-[#BE3423]/30 animate-pulse" />
        </motion.div>
      </section>

      {/* ------------------------------------------------------------
          MOVEMENT 02: THE HALL OF GIANTS (The Tribute)
      ------------------------------------------------------------- */}
      
      {/* 02.A: Charles Bukowski */}
      <section className="relative min-h-screen w-full bg-[#1A1714] text-[#FDFBF7] flex flex-col md:flex-row items-center border-t border-white/5 overflow-hidden">
        <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden grayscale contrast-125 opacity-70 group hover:opacity-100 transition-opacity duration-1000">
           <img src="/landing-assets/bukowski.png" alt="Charles Bukowski" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[3s]" />
           <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1A1714]" />
        </div>
        <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center gap-8 relative z-10">
           <span className="font-jost uppercase tracking-[0.4em] text-[10px] text-[#BE3423] font-black">The Grit</span>
           <h2 className="font-playfair text-6xl md:text-8xl leading-none italic">Charles <br/> Bukowski</h2>
           <blockquote className="font-cormorant text-3xl md:text-4xl leading-tight border-l-4 border-[#BE3423] pl-10 py-4 italic text-white/90">
             "If it doesn't come bursting out of you in spite of everything, don't do it."
           </blockquote>
           <p className="font-cormorant text-xl text-white/50 max-w-sm leading-relaxed">
             He wrote because the misery of a 10-hour shift at the post office was too heavy to carry without a typewriter to bleed into.
           </p>
        </div>
      </section>

      {/* 02.B: Faiz Ahmed Faiz */}
      <section className="relative min-h-screen w-full bg-[#241F1A] text-[#FDFBF7] flex flex-col md:flex-row-reverse items-center overflow-hidden">
        <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden grayscale sepia opacity-60 group hover:opacity-100 transition-opacity duration-1000">
           <img src="/landing-assets/faiz.png" alt="Faiz Ahmed Faiz" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[3s]" />
           <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#241F1A]" />
        </div>
        <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center gap-8 relative z-10 text-right md:items-end">
           <span className="font-jost uppercase tracking-[0.4em] text-[10px] text-[#C5A059] font-black">The Resistance</span>
           <h2 className="font-playfair text-6xl md:text-8xl leading-none italic">Faiz <br/> Ahmed Faiz</h2>
           <blockquote className="font-cormorant text-3xl md:text-4xl leading-tight border-r-4 border-[#C5A059] pr-10 py-4 italic text-white/90">
             "Speak, for your two lips are free; <br/> Speak, your tongue is still your own."
           </blockquote>
           <p className="font-cormorant text-xl text-white/50 max-w-sm leading-relaxed">
             He wrote from a prison cell because freedom isn't a place, it's the precise moment a thought is committed to paper.
           </p>
        </div>
      </section>

      {/* 02.C: Sylvia Plath */}
      <section className="relative min-h-screen w-full bg-[#0D0B09] text-[#FDFBF7] flex flex-col md:flex-row items-center border-t border-white/5 overflow-hidden">
        <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden grayscale contrast-150 opacity-60 group hover:opacity-100 transition-opacity duration-1000">
           <img src="/landing-assets/plath.png" alt="Sylvia Plath" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[3s]" />
           <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0D0B09]" />
        </div>
        <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center gap-8 relative z-10">
           <span className="font-jost uppercase tracking-[0.4em] text-[10px] text-[#8C8278] font-black">The Unnamed</span>
           <h2 className="font-playfair text-6xl md:text-8xl leading-none italic">Sylvia <br/> Plath</h2>
           <blockquote className="font-cormorant text-3xl md:text-4xl leading-tight border-l-4 border-white/20 pl-10 py-4 italic text-white/90">
             "I took a deep breath and listened to the old brag of my heart. I am, I am, I am."
           </blockquote>
           <p className="font-cormorant text-xl text-white/50 max-w-sm leading-relaxed">
             She wrote because silence was a storm she couldn't navigate without the sharp, silver needle of a sentence.
           </p>
        </div>
      </section>

      {/* ------------------------------------------------------------
          MOVEMENT 03: THE CRAFT (The Tool)
      ------------------------------------------------------------- */}
      <section className="relative py-48 px-6 md:px-24 bg-[#FDFBF7] text-[#1A1714]">
         <div className="max-w-[1200px] mx-auto flex flex-col gap-24">
            <div className="space-y-8 max-w-2xl">
               <h2 className="font-playfair text-6xl md:text-8xl leading-none tracking-tighter">Tools for the <br/> <span className="italic text-[#BE3423]">unspoken.</span></h2>
               <p className="font-cormorant text-2xl leading-relaxed opacity-70 italic">
                 We didn't build a text editor. We built a room. A room that respects the weight of the giants above, and the impulse of the poet right now.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 border-t border-black/10 pt-24">
               <div className="space-y-6">
                  <span className="font-jost uppercase tracking-widest text-[9px] font-black opacity-40">Tactile Persistence</span>
                  <p className="font-playfair italic text-3xl">Physics of Loss</p>
                  <p className="font-cormorant text-lg opacity-60">Words shouldn't just disappear. If they fail, they dissolve—scattering like ash using a physical entropy engine.</p>
               </div>
               <div className="space-y-6">
                  <span className="font-jost uppercase tracking-widest text-[9px] font-black opacity-40">Visual Silence</span>
                  <p className="font-playfair italic text-3xl">The Ghost Mode</p>
                  <p className="font-cormorant text-lg opacity-60">Inactive stanzas fade away, leaving you alone with the only sentence that matters: the one you are writing.</p>
               </div>
               <div className="space-y-6">
                  <span className="font-jost uppercase tracking-widest text-[9px] font-black opacity-40">Sensory Depth</span>
                  <p className="font-playfair italic text-3xl">Subliminal Moods</p>
                  <p className="font-cormorant text-lg opacity-60">Cinematic rain and fire. Lighting that shifts with the weather. A room designed to induce a flow state.</p>
               </div>
            </div>
         </div>
      </section>

      {/* ------------------------------------------------------------
          MOVEMENT 04: THE FINAL ACT
      ------------------------------------------------------------- */}
      <section className="h-[100dvh] w-full bg-[#BE3423] text-white flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <h2 className="font-playfair text-[clamp(3.5rem,10vw,8rem)] font-normal leading-none max-w-[1200px]">
          Poetry is a tribute <br/> 
          <span className="italic">to being human.</span>
        </h2>

        <a href="/" className="mt-24 group relative flex flex-col items-center gap-6">
           <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white flex items-center justify-center transition-all group-hover:bg-[#1A1714] duration-700 cursor-pointer">
              <span className="font-jost uppercase tracking-[0.5em] text-[10px] font-black text-[#BE3423] group-hover:text-white transition-colors">Enter</span>
           </div>
        </a>

        {/* Brand Footer Decoration */}
        <div className="absolute bottom-12 flex items-center gap-8 opacity-40">
           <span className="font-jost uppercase tracking-[0.4em] text-[9px] font-bold">Poetik v1.0</span>
        </div>
      </section>



    </div>
  );
}

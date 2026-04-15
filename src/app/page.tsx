import Scene from "@/components/background/Scene";
import Hero from "@/components/sections/Hero";
import Aila from "@/components/sections/Aila";
import Antios from "@/components/sections/Antios";
import Quant from "@/components/sections/Quant";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <main className="snap-y-mandatory bg-[#050505]">
      <Scene />
      
      <div className="relative z-10 w-full h-full">
        <Hero />
        <Aila />
        <Antios />
        <Quant />
        <CTA />
      </div>
    </main>
  );
}

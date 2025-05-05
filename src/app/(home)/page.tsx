import Features from "./_components/Features";
import Hero from "./_components/Hero";
import Pricing from "./_components/Pricing";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
    </>
  );
}

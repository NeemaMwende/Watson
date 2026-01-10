import Navbar from "@/components/homepage/Navbar";
import Hero from "@/components/homepage/Hero";
import Features from "@/components/homepage/Features";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
    </main>
  );
}

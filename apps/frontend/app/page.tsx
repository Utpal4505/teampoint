import {
  Navbar,
  Hero,
  Problem,
  Solution,
  ProductFlows,
  Differentiation,
  Trust,
  FAQ,
  FinalCTA,
  Footer,
} from '@/components/landing'

export default function LandingPage() {
  return (
    <div className="landing-shell relative min-h-screen overflow-hidden bg-[#0b0d10] text-foreground">
      <div className="landing-backdrop" />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Problem />
        <Solution />
        <ProductFlows />
        <Differentiation />
        <Trust />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  )
}

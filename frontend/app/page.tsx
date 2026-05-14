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
    <div
      className="min-h-screen bg-[#08080a]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
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
  )
}

import { LandingCta, LandingFooter, LandingPartners } from "@/components/landing/landing-cta";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHowItWorks } from "@/components/landing/landing-how";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingReviews } from "@/components/landing/landing-reviews";
import { LandingWhy } from "@/components/landing/landing-why";

export default function LandingPage() {
  return (
    <div className="landing-root">
      <a className="skip-link" href="#features">
        Skip to features
      </a>
      <LandingNav />
      <main>
        <LandingHero />
        <LandingPartners />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingWhy />
        <LandingReviews />
        <LandingFaq />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}

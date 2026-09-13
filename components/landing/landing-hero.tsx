import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PhoneMockup } from "@/components/landing/phone-mockup";
import styles from "./landing-hero.module.css";

export function LandingHero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.background} aria-hidden="true">
        <div className={styles.tide} />
        <div className={styles.aurora} />
        <div className={styles.shadow} />
        <div className={styles.grain} />
        <div className={styles.scrim} />
      </div>

      <div className={`landing-wrap ${styles.layout}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" /> Your campus. In real time.
          </p>
          <h1 id="hero-title" className={styles.title}>
            See what’s<br />happening<br /><span>on campus.</span>
          </h1>
          <p className={styles.description}>
            Rally is a live map of Texas Tech. Find what’s on, join in minutes,
            chat with the group, and earn points with a photo check-in.
          </p>
          <div className={styles.actions}>
            <Link
              href="/login?returnTo=/app"
              className={styles.primaryLink}
            >
              Find your people <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#how-it-works" className={styles.secondaryLink}>
              How it works <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.orbit} />
          <div className={styles.phone}><PhoneMockup /></div>
          <div className={styles.locationTag}>
            <span className={styles.pin}><MapPin size={20} /></span>
            <span><strong>Your next plan is here.</strong><small>Texas Tech University</small></span>
          </div>
          <span className={styles.visualCaption}>LESS SCROLLING. MORE SHOWING UP.</span>
        </div>
      </div>

    </section>
  );
}

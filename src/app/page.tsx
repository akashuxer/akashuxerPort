import dynamic from "next/dynamic";
import { AmbientBackground } from "@/components/ambient-background";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollToTop } from "@/components/scroll-to-top";

const BackgroundRippleEffect = dynamic(() =>
  import("@/components/ui/background-ripple-effect").then(
    (m) => m.BackgroundRippleEffect
  )
);

const Expertise = dynamic(() =>
  import("@/components/expertise").then((m) => ({ default: m.Expertise }))
);
const Work = dynamic(() =>
  import("@/components/work").then((m) => ({ default: m.Work }))
);
const About = dynamic(() =>
  import("@/components/about").then((m) => ({ default: m.About }))
);
const Experience = dynamic(() =>
  import("@/components/experience").then((m) => ({ default: m.Experience }))
);
const Awards = dynamic(() =>
  import("@/components/awards").then((m) => ({ default: m.Awards }))
);
const Articles = dynamic(() =>
  import("@/components/articles").then((m) => ({ default: m.Articles }))
);
const Testimonials = dynamic(() =>
  import("@/components/testimonials").then((m) => ({
    default: m.Testimonials,
  }))
);
const FooterCta = dynamic(() =>
  import("@/components/footer-cta").then((m) => ({ default: m.FooterCta }))
);
const SiteFooter = dynamic(() =>
  import("@/components/footer-cta").then((m) => ({ default: m.SiteFooter }))
);

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <AmbientBackground />
      <BackgroundRippleEffect />
      <Nav />
      <ScrollToTop />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <main className="flex flex-1 flex-col">
          <Hero />
          <Expertise />
          <Work />
          <About />
          <Experience />
          <Awards />
          <Articles />
          <Testimonials />
          <FooterCta />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

import dynamic from "next/dynamic";
import { AmbientBackground } from "@/components/ambient-background";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { PreloadBelowFold } from "@/components/preload-below-fold";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SectionLoading } from "@/components/section-loading";

const Work = dynamic(
  () => import("@/components/work").then((m) => ({ default: m.Work })),
  { loading: () => <SectionLoading label="Work" /> }
);
const About = dynamic(
  () => import("@/components/about").then((m) => ({ default: m.About })),
  { loading: () => <SectionLoading label="About" /> }
);
const Experience = dynamic(
  () =>
    import("@/components/experience").then((m) => ({ default: m.Experience })),
  { loading: () => <SectionLoading label="Experience" /> }
);
const Awards = dynamic(
  () => import("@/components/awards").then((m) => ({ default: m.Awards })),
  { loading: () => <SectionLoading label="Awards" /> }
);
const Articles = dynamic(
  () => import("@/components/articles").then((m) => ({ default: m.Articles })),
  { loading: () => <SectionLoading label="Articles" /> }
);
const Testimonials = dynamic(
  () =>
    import("@/components/testimonials").then((m) => ({
      default: m.Testimonials,
    })),
  { loading: () => <SectionLoading label="Testimonials" /> }
);
const FooterCta = dynamic(
  () =>
    import("@/components/footer-cta").then((m) => ({ default: m.FooterCta })),
  { loading: () => <SectionLoading label="Contact" /> }
);
const SiteFooter = dynamic(
  () =>
    import("@/components/footer-cta").then((m) => ({ default: m.SiteFooter })),
  { loading: () => <div className="min-h-[120px]" aria-hidden /> }
);

export default function Home() {
  return (
    <>
      <PreloadBelowFold />
      <ScrollProgress />
      <AmbientBackground />
      <Nav />
      <ScrollToTop />
      <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        <main className="flex min-w-0 flex-1 flex-col">
          <Hero />
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

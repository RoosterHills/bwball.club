import { useSiteData } from "@/hooks/useSiteData";
import { useSiteContent } from "@/hooks/useSiteContent";
import { nextEventFor } from "@/lib/selectors";
import Hero from "@/components/home/Hero";
import QuickActions from "@/components/home/QuickActions";
import TeamGrid from "@/components/home/TeamGrid";
import ThisWeek from "@/components/home/ThisWeek";
import LatestNews from "@/components/home/LatestNews";
import SponsorWall from "@/components/home/SponsorWall";
import PartnerStrip from "@/components/site/PartnerStrip";

export default function Home() {
  const { organization, teams, brands, sponsors, events, announcements } = useSiteData();
  const { settings } = useSiteContent();

  return (
    <>
      <Hero
        teams={teams}
        brands={brands}
        sponsors={sponsors}
        heroImage={organization?.hero_image}
        settings={settings}
        nextEventFor={(teamId) => nextEventFor(events, teamId)}
      />
      <QuickActions />
      <TeamGrid
        teams={teams}
        brands={brands}
        sponsors={sponsors}
        events={events}
        title={settings?.teams_title}
        intro={settings?.teams_intro}
        parentBrand={settings?.site_name}
      />
      <ThisWeek events={events} teams={teams} />
      <LatestNews announcements={announcements} teams={teams} title={settings?.news_title} />
      <SponsorWall
        sponsors={sponsors}
        title={settings?.sponsors_title}
        intro={settings?.sponsors_intro}
      />
      <PartnerStrip />
    </>
  );
}
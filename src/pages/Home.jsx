import { useSiteData } from "@/hooks/useSiteData";
import { nextEventFor } from "@/lib/selectors";
import Hero from "@/components/home/Hero";
import QuickActions from "@/components/home/QuickActions";
import TeamGrid from "@/components/home/TeamGrid";
import ThisWeek from "@/components/home/ThisWeek";
import LatestNews from "@/components/home/LatestNews";
import SponsorWall from "@/components/home/SponsorWall";

export default function Home() {
  const { organization, teams, brands, sponsors, events, announcements } = useSiteData();

  return (
    <>
      <Hero
        teams={teams}
        brands={brands}
        sponsors={sponsors}
        heroImage={organization?.hero_image}
        nextEventFor={(teamId) => nextEventFor(events, teamId)}
      />
      <QuickActions />
      <TeamGrid teams={teams} brands={brands} sponsors={sponsors} events={events} />
      <ThisWeek events={events} teams={teams} />
      <LatestNews announcements={announcements} teams={teams} />
      <SponsorWall sponsors={sponsors} />
    </>
  );
}
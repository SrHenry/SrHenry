import { getTranslations } from "next-intl/server";
import { SiGithub } from "react-icons/si";
import { Avatar } from "@/components/_shared/avatar";
import { LinkedInIcon } from "@/components/_shared/linkedin-icon";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/widgets/animated-section";
import { GITHUB_LINK, LINKEDIN_LINK } from "@/lib/constants";

export async function AboutSection() {
  const t = await getTranslations("about");

  return (
    <AnimatedSection>
      <section className="py-12 text-center">
        <div className="flex flex-col items-center gap-6">
          <Avatar alt="SrHenry" size={160} />

          <div className="space-y-2">
            <h1 className="text-4xl font-bold md:text-5xl">{t("greeting")}</h1>
            <h2 className="text-2xl text-muted-foreground md:text-3xl">{t("role")}</h2>
            <p className="text-lg text-muted-foreground">{t("experience")}</p>
          </div>

          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{t("summary")}</p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild>
              <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer">
                <SiGithub className="mr-2 h-4 w-4" />
                {t("github")}
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href={LINKEDIN_LINK} target="_blank" rel="noopener noreferrer">
                <LinkedInIcon className="mr-2 h-4 w-4" />
                {t("linkedin")}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

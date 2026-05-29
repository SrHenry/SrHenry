import { Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SiGithub, SiGitlab } from "react-icons/si";
import { LinkedInIcon } from "@/components/_shared/linkedin-icon";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/widgets/animated-section";
import { EMAIL, GITHUB_LINK, GITLAB_LINK, LINKEDIN_LINK } from "@/lib/constants";

const contactLinks = [
  { name: "GitHub", url: GITHUB_LINK, icon: SiGithub },
  { name: "LinkedIn", url: LINKEDIN_LINK, icon: LinkedInIcon },
  { name: "GitLab", url: GITLAB_LINK, icon: SiGitlab },
  { name: "Email", url: `mailto:${EMAIL}`, icon: Mail },
] as const;

export async function ContactSection() {
  const t = await getTranslations("contact");

  return (
    <AnimatedSection>
      <section className="py-12">
        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{t("subtitle")}</p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {contactLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Button
                  asChild
                  key={link.name}
                  variant={link.name === "GitHub" ? "default" : "secondary"}
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <Icon className="mr-2 h-4 w-4" />
                    {link.name}
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

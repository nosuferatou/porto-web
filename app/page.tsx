import React from "react";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { InformationSection } from "@/components/home/InformationSection";
import { SkillGrid } from "@/components/home/SkillGrid";
import { PostsPreviewSection } from "@/components/home/PostsPreviewSection";
import { ContactSection } from "@/components/home/ContactSection";
import { GothicDivider } from "@/components/ui";
import { Profile, Skill, Post, ContactLink } from "@/lib/data";

export const instant = false;

export default async function Home() {
  const [dbProfile, dbSkills, dbFeaturedPosts, postsCount, dbContacts] =
    await Promise.all([
      prisma.profile.findFirst().catch(() => null),
      prisma.skill.findMany({
          where: { showOnHomepage: true },
          orderBy: { order: "asc" },
        }).catch(() => []),
      prisma.post
        .findMany({
          where: { status: "published", featured: true },
          orderBy: { createdAt: "desc" },
          take: 3,
        })
        .catch(() => []),
      prisma.post.count({ where: { status: "published" } }).catch(() => 0),
      prisma.contactLink.findMany({ orderBy: { order: "asc" } }).catch(() => []),
    ]);

  const profile: Profile | undefined = dbProfile
    ? {
        name: dbProfile.name,
        title: dbProfile.title,
        bio: dbProfile.bio,
        location: dbProfile.location,
        status: dbProfile.status,
        photoPlaceholder: dbProfile.photoUrl || "✦",
        specialty: dbProfile.specialty ?? undefined,
        discipline: dbProfile.discipline ?? undefined,
        timezone: dbProfile.timezone ?? undefined,
      }
    : undefined;

  const skills: Skill[] | undefined =
    dbSkills && dbSkills.length > 0
      ? dbSkills.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          iconKey: s.iconKey,
          iconUrl: s.iconUrl ?? undefined,
          description: s.description,
          order: s.order,
          showOnHomepage: s.showOnHomepage,
        }))
      : undefined;

  const posts: Post[] | undefined =
    dbFeaturedPosts && dbFeaturedPosts.length > 0
      ? dbFeaturedPosts.map((p) => {
          let tags: string[] = [];
          let tools: string[] = [];
          try {
            tags = JSON.parse(p.tags);
          } catch {
            tags = [];
          }
          try {
            tools = JSON.parse(p.tools);
          } catch {
            tools = [];
          }

          return {
            id: p.id,
            title: p.title,
            slug: p.slug,
            summary: p.summary,
            category: p.category as Post["category"],
            date: p.createdAt.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
            tags,
            role: p.role,
            tools,
            featured: p.featured,
            glyph: p.glyph,
            externalLink: p.externalLink || undefined,
            githubLink: p.githubLink || undefined,
            thumbnailUrl: p.thumbnailUrl || undefined,
          };
        })
      : undefined;

  const contacts: ContactLink[] | undefined =
    dbContacts && dbContacts.length > 0
      ? dbContacts.map((c) => ({
          id: c.id,
          platform: c.platform,
          label: c.label,
          url: c.url,
          iconKey: c.iconKey,
        }))
      : undefined;

  return (
    <>
      <Navbar profileName={profile?.name} />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 w-full py-8 space-y-4">
        {/* Profile & Biodata Section */}
        <InformationSection profile={profile} />

        {/* Mastered Skills Grid */}
        <SkillGrid skills={skills} />

        <GothicDivider label="Arcane Archives" variant="runic" />

        {/* Posts Preview Section */}
        <PostsPreviewSection posts={posts} totalCount={postsCount} />

        <GothicDivider label="Send Dispatch" variant="simple" />

        {/* Contact & Channels Section */}
        <ContactSection contacts={contacts} />
      </main>
    </>
  );
}

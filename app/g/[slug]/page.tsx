import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import GuestPageRenderer from "./GuestPageRenderer";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const guestPage = await db.guestPage.findUnique({
    where: { slug },
    select: { title: true },
  });

  if (!guestPage) {
    return { title: "Page Not Found" };
  }

  return {
    title: guestPage.title,
    robots: "noindex, nofollow", // Don't index guest pages
  };
}

export default async function PublicGuestPage({ params }: Props) {
  const { slug } = await params;

  const guestPage = await db.guestPage.findUnique({
    where: { slug },
    include: {
      property: {
        select: { name: true },
      },
    },
  });

  if (!guestPage || !guestPage.published) {
    notFound();
  }

  return (
    <GuestPageRenderer
      slug={slug}
      title={guestPage.title}
      propertyName={guestPage.property.name}
      blocks={guestPage.blocks as GuestPageBlock[]}
    />
  );
}

// Type for blocks
type GuestPageBlock =
  | { type: "welcome"; message: string }
  | { type: "wifi"; networkName: string; password: string }
  | { type: "rules"; content: string }
  | { type: "eco"; message: string; enabled: boolean }
  | { type: "links"; links: Array<{ label: string; url: string }> }
  | { type: "checkout_time"; time: string };

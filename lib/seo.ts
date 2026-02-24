import type { Metadata } from "next";

export const SITE_NAME = "FlowOps";

const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "https://flowops.agency";

export const SITE_URL = RAW_SITE_URL.endsWith("/")
  ? RAW_SITE_URL.slice(0, -1)
  : RAW_SITE_URL;

export const DEFAULT_OG_IMAGE = "/og/flowops-og.svg";

export const DEFAULT_DESCRIPTION =
  "FlowOps helps businesses eliminate manual operational chaos through AI-driven workflow automation, CRM integration, and system architecture consulting.";

export const PRIMARY_KEYWORDS = [
  "business process automation",
  "AI automation consulting",
  "workflow automation",
  "CRM automation",
  "operational optimization",
  "automation systems architecture",
  "automation consulting services",
  "AI workflow systems",
  "business system design",
  "process optimization consulting",
] as const;

const SOCIAL_PROFILES = [
  process.env.NEXT_PUBLIC_LINKEDIN_URL,
  process.env.NEXT_PUBLIC_X_URL,
  process.env.NEXT_PUBLIC_YOUTUBE_URL,
].filter((value): value is string => Boolean(value));

function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  keywords = PRIMARY_KEYWORDS,
  noindex = false,
}: PageMetadataInput): Metadata {
  const canonical = toAbsoluteUrl(path);
  const ogImage = toAbsoluteUrl(DEFAULT_OG_IMAGE);

  return {
    title,
    description,
    keywords: [...keywords],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "FlowOps - AI Business Automation Consulting",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function getOrganizationSchema() {
  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: toAbsoluteUrl("/logo.svg"),
    },
    description: DEFAULT_DESCRIPTION,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        url: toAbsoluteUrl("/contact"),
        availableLanguage: ["English"],
      },
    ],
  } as Record<string, unknown>;

  if (SOCIAL_PROFILES.length > 0) {
    organization.sameAs = SOCIAL_PROFILES;
  }

  return organization;
}

const SERVICE_DEFINITIONS = [
  {
    slug: "sales-automation",
    name: "Sales Automation",
    serviceType: "CRM automation and workflow automation",
    description:
      "AI workflow systems for lead routing, CRM automation, follow-up orchestration, and conversion analytics.",
  },
  {
    slug: "operations-automation",
    name: "Operations Automation",
    serviceType: "business process automation and operational optimization",
    description:
      "Automation consulting services for process optimization, approvals, reporting, and cross-team execution.",
  },
  {
    slug: "ai-upgrade",
    name: "AI Upgrade",
    serviceType: "automation systems architecture and business system design",
    description:
      "Practical AI automation consulting for integrating language models, data workflows, and decision support systems.",
  },
] as const;

export function getServiceSchemas() {
  return SERVICE_DEFINITIONS.map((service) => ({
    "@type": "Service",
    "@id": `${SITE_URL}/services#${service.slug}`,
    name: service.name,
    serviceType: service.serviceType,
    description: service.description,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    areaServed: "Global",
    url: `${SITE_URL}/services`,
  }));
}

export function getProfessionalServiceSchema() {
  return {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#professional-service`,
    name: SITE_NAME,
    url: SITE_URL,
    image: toAbsoluteUrl(DEFAULT_OG_IMAGE),
    description: DEFAULT_DESCRIPTION,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    serviceType: [
      "business process automation",
      "AI automation consulting",
      "workflow automation",
      "CRM automation",
      "automation systems architecture",
    ],
    areaServed: "Global",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Automation Consulting Services",
      itemListElement: getServiceSchemas(),
    },
  };
}

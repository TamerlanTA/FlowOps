import {
  getOrganizationSchema,
  getProfessionalServiceSchema,
  getServiceSchemas,
} from "@/lib/seo";

function JsonLd({ id, data }: { id: string; data: Record<string, unknown> }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function GlobalStructuredData() {
  return (
    <JsonLd
      id="flowops-global-schema"
      data={{
        "@context": "https://schema.org",
        "@graph": [getOrganizationSchema(), getProfessionalServiceSchema()],
      }}
    />
  );
}

export function ServiceStructuredData() {
  return (
    <JsonLd
      id="flowops-service-schema"
      data={{
        "@context": "https://schema.org",
        "@graph": getServiceSchemas(),
      }}
    />
  );
}

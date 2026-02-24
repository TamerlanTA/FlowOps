import Head from "next/head";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <>
      <Head>
        <title>Thank You | FlowOps</title>
        <meta
          name="description"
          content="Your FlowOps audit request has been received."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://flowops.agency/thank-you" />
      </Head>

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background:
            "radial-gradient(ellipse 90% 70% at 50% 35%, #141a2e 0%, #0c1020 70%, #070a14 100%)",
          color: "#eef3ff",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: "720px",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.12)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 48%, rgba(255,255,255,0.07) 100%)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.32)",
            backdropFilter: "blur(20px)",
            padding: "40px 32px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#93c5fd",
            }}
          >
            FlowOps
          </p>

          <h1 style={{ margin: "12px 0 10px", fontSize: "34px", lineHeight: 1.15 }}>
            Request received
          </h1>

          <p
            style={{
              margin: "0 auto",
              maxWidth: "560px",
              color: "#c8d4eb",
              lineHeight: 1.7,
            }}
          >
            Thank you for submitting your process audit request. Our team is now
            reviewing your details and will contact you within one business day
            with the next steps.
          </p>

          <div style={{ marginTop: "28px" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "14px",
                background: "#3b82f6",
                color: "#fff",
                padding: "12px 20px",
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 10px 24px rgba(59,130,246,0.3)",
              }}
            >
              Back to main site
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export function HomepageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://deepseekaiagent.com/#website",
        url: "https://deepseekaiagent.com",
        name: "Seedance",
        description:
          "Create stunning AI videos, images, avatars, and music with Seedance AI Creative Suite.",
        publisher: {
          "@id": "https://deepseekaiagent.com/#organization",
        },
        inLanguage: "en",
      },
      {
        "@type": "Organization",
        "@id": "https://deepseekaiagent.com/#organization",
        name: "Seedance",
        url: "https://deepseekaiagent.com",
        sameAs: [],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://deepseekaiagent.com/#app",
        name: "Seedance AI Creative Suite",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        url: "https://deepseekaiagent.com",
        description:
          "All-in-one AI creative suite for generating videos, images, avatars, and music. Features Seedance 2.0 for video and Seedream 5.0 for images.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

import React from "react";

export function JsonLd() {
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MyTaalim",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "description": "Organize YouTube playlists and track learning progress",
    "url": "https://www.mytaalim.xyz",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MyTaalim",
    "url": "https://www.mytaalim.xyz",
    "logo": "https://www.mytaalim.xyz/logo.png",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
    </>
  );
}

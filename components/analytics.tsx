import Script from 'next/script';

/**
 * Matja e vizitave, opsionale. Ndizet vetëm nëse vendoset njëra nga variablat;
 * pa to nuk ngarkohet asnjë skript i jashtëm.
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN — Plausible (pa cookie, pa banner pëlqimi)
 *   NEXT_PUBLIC_GA_ID            — Google Analytics 4
 */
export function Analytics() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src={process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? 'https://plausible.io/js/script.js'}
          strategy="afterInteractive"
        />
      )}
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
          </Script>
        </>
      )}
    </>
  );
}

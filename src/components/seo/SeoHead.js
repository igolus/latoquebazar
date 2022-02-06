import React from 'react';
import Head from 'next/head';

function SeoHead({metaDesc, metaTitle, metaImg}) {
  return (
    <Head>
      <title>{metaTitle}</title>
      <meta
        name="description"
        content={metaDesc}
      />
      <meta
        name="title"
        content={metaTitle}
      />
      <meta
        name="robots"
        content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content={
          metaImg ||
          "https://firebasestorage.googleapis.com/v0/b/latoqueprod.appspot.com/o/ogImageLatoque.png?alt=media&token=c0bbbe13-960a-4e83-a848-a408de5d7cb7"
        }
      />
      <meta
        property="og:title"
        content={metaTitle}
      />
      <meta
        property="og:description"
        content={metaDesc}
      />
      {/*<meta*/}
      {/*  property="og:url"*/}
      {/*  content="https://latoquemagique.com/"*/}
      {/*/>*/}
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <link
        href="https://fonts.googleapis.com/css2?family=Lobster:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

    </Head>
  );
}

export default SeoHead;
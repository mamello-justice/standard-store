// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://mamello-justice.github.io",
  base: `/standard-store/`,
  integrations: [
    starlight({
      title: "Standard Store",
      favicon: `/favicon.ico`,
      defaultLocale: "root",
      locales: {
        root: {
          label: "English",
          lang: "en", // lang is required for root locales
        },
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/mamello-justice/standard-store",
        },
      ],
      sidebar: [
        {
          label: "Documentation",
          items: [
            { label: "Installation", link: `/getting-started/installation/` },
            { label: "Quick Start", link: `/getting-started/quick-start/` },
            { label: "Core Concepts", link: `/getting-started/concepts/` },
          ],
        },
        {
          label: "Guides",
          items: [
            { label: "Creating a Store", link: `/guides/creating-store/` },
            { label: "Persistence & Adapters", link: `/guides/adapters/` },
            { label: "Middleware", link: `/guides/middleware/` },
            { label: "React Integration", link: `/guides/react-integration/` },
            { label: "Router Integration", link: `/guides/router-integration/` },
          ],
        },
        {
          label: "API Reference",
          items: [
            { label: "createStore", link: `/api/create-store/` },
            { label: "createStoreHook", link: `/api/create-store-hook/` },
            { label: "Storage Adapters", link: `/api/adapters/` },
            { label: "Middleware", link: `/api/middleware/` },
          ],
        },
      ],
    }),
  ],
});

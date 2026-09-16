// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

const basePath = "/standard-store";

// https://astro.build/config
export default defineConfig({
  site: "https://mamello-justice.github.io",
  base: `${basePath}/`,
  integrations: [
    starlight({
      title: "Standard Store",
      favicon: `${basePath}/favicon.ico`,
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
            { label: "Installation", link: `${basePath}/getting-started/installation/` },
            { label: "Quick Start", link: `${basePath}/getting-started/quick-start/` },
            { label: "Core Concepts", link: `${basePath}/getting-started/concepts/` },
          ],
        },
        {
          label: "Guides",
          items: [
            { label: "Creating a Store", link: `${basePath}/guides/creating-store/` },
            { label: "Persistence & Adapters", link: `${basePath}/guides/adapters/` },
            { label: "Middleware", link: `${basePath}/guides/middleware/` },
            { label: "React Integration", link: `${basePath}/guides/react-integration/` },
            { label: "Router Integration", link: `${basePath}/guides/router-integration/` },
          ],
        },
        {
          label: "API Reference",
          items: [
            { label: "createStore", link: `${basePath}/api/create-store/` },
            { label: "createStoreHook", link: `${basePath}/api/create-store-hook/` },
            { label: "Storage Adapters", link: `${basePath}/api/adapters/` },
            { label: "Middleware", link: `${basePath}/api/middleware/` },
          ],
        },
      ],
    }),
  ],
});

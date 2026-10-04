export const seo = (title: string, description: string) => () => ({
  meta: [
    { title: `${title} — Similia PMS` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — Similia PMS` },
    { property: "og:description", content: description },
  ],
});

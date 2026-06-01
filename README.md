# AEdocs

AEdocs unifies the After Effects expression reference and scripting guide from [docsforadobe](https://github.com/docsforadobe) into one modern Fumadocs site — same content, better reading experience.

Instead of maintaining two separate mkdocs sites, this project rebuilds both the [expression reference](https://github.com/docsforadobe/after-effects-expression-reference) and the [scripting guide](https://github.com/docsforadobe/after-effects-scripting-guide) into a single, searchable, unified docs tree.

---

This is a Next.js application generated with [Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Explore

In the project, you can see:

- `lib/fumadocs/source.ts`: Code for content source adapter, [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `lib/fumadocs/layout.shared.tsx`: Shared options for layouts, optional but preferred to keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

### Fumadocs MDX

A `source.config.ts` config file has been included, you can customise different options like frontmatter schema.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs

## License

The documentation content is sourced from [docsforadobe](https://github.com/docsforadobe)'s [after-effects-expression-reference](https://github.com/docsforadobe/after-effects-expression-reference) and [after-effects-scripting-guide](https://github.com/docsforadobe/after-effects-scripting-guide), and is copyright Adobe Systems Incorporated. This project exists for educational purposes only, and is not affiliated with or endorsed by Adobe. Concerns can be raised via [GitHub issues](https://github.com/ritmo-v0/aedocs/issues).

# Portfolio design direction

The page should help a prospective client understand Usman's craft, inspect real work, and start a conversation.

References: [Cuberto](https://cuberto.com/) for the emphasis on work, [REJOUICE](https://www.rejouice.com/services) for numbered capabilities, and [Dennis Snellenberg](https://dennissnellenberg.com/) for a confident personal voice and closing invitation. These inform hierarchy, not copied layouts or assets.

- Keep the portrait, notch navigation, real project recordings, and gray/emerald identity.
- Lead with large project media and clear project names. Keep previews and external website links keyboard accessible.
- Use an editorial type scale, short introductions, numbered sections, fine rules, and selective enclosing panels. Project cards use contrasting gray-green surfaces so white website previews retain a clear boundary. Reserve italic serif for emphasis. All small section labels use the shared `section-label` style: Geist Sans, highlighted emerald text, a short leading rule, and consistent spacing. Labels have no pill background or border.
- Give services a clear numbered rhythm, the personal approach a contrasting green chapter, and contact a large closing headline above the working form.
- Motion should explain entrances, previews, and interaction. Avoid repeating shine on every heading. Respect reduced motion; never require hover to access information.
- On mobile, use a single reading column, normal document flow, readable text, and touch targets of at least 44px. Keep light and dark themes readable.
- Verify type checking, lint, contact tests, and production build. Browser checks should cover 320, 768, 1024, and 1440px, both themes, previews, navigation, keyboard focus, and reduced motion when a browser connection is available.

Main section headings share one responsive type scale through `--section-heading-size`, leading, and tracking tokens. The copyright row precedes a full-width dark emerald footer with a two-row name: usman above sarfraz. Following the supplied REJOUICE recording, letters drop from above a word-level mask in a short stagger once on scroll. Horizontal padding protects glyph edges; letters are never individually clipped. There is no looping movement. Reduced motion shows a static name immediately.

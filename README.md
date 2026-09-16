# OUR classroom

An accessible, private-by-default, evidence-informed Living Learning Manifesto tool for graduate classrooms. It is a plain HTML, CSS, and JavaScript project designed for GitHub Pages. It has no build step, backend, account system, analytics, or external runtime dependency.

## What is included

- Evidence and provenance for the seeded co-design approach
- Contextual power and positionality framing, including the Academic Wheel of Privilege as a reflection heuristic
- Transparent co-design boundaries and shared legal, ethical, accessibility, academic, and institutional floor
- All 17 source categories and all 52 source seed statements
- Keep, Edit, Delete, and Add interactions
- Local browser saving, visible progress, and category navigation
- The complete eight-stage repair pathway
- A versioned, print-ready assembled manifesto
- Direct PDF download plus browser printing
- Responsive layouts, keyboard focus, WCAG-conscious contrast, semantic controls, and reduced-motion support

## Run locally

Open `index.html` directly in a modern browser. For the most production-like test, serve the folder with any local static web server and open the displayed address.

No personal data is transmitted. Drafts are stored in `localStorage` under `living-manifesto-draft-v1` in the current browser profile.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload the contents of this folder to the repository root and commit them.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. GitHub will show the public URL after deployment completes.

The repository must keep `index.html`, `styles.css`, `app.js`, `manifesto-data.js`, and the `assets` folder together at the published root.

## Use in a class

Individual students or small groups can work through the tool privately, enter the course or section name, and use **Print / Save as PDF**. Those PDFs can be submitted through the course's usual channel for instructor review and whole-class deliberation.

The tool deliberately does not automate consensus. Whole-class adoption still requires a clear process, such as broad consent with recorded reservations. Once adopted, set the document to Version 1.0 and print or save it as a PDF. Later amendments can be recorded as Version 1.1, 1.2, or 2.0, with a revised date. Before using the same browser for another classroom, print or save the current version and choose **Start a new classroom**.

## Academic Wheel image and public reuse

The Academic Wheel image is included as `assets/academic-wheel-of-privilege.png` and attributed in the site to Middleton, S. L., Sulik, J., Iley, B., Elsherif, M. M., and Azevedo, F. (2026), *The Academic Wheel of Privilege: An Equity-Based Tool for Authorship Order*, https://osf.io/preprints/metaarxiv/af4nk_v2. The image is identified as CC BY 4.0, and the site preserves the licence link beside the citation.

## Files

- `index.html`: content and semantic structure
- `styles.css`: visual identity, responsive layout, focus states, reduced motion, and print design
- `content-expansion.css`: purpose, design-principle, and language-choice sections
- `manifesto-data.js`: the 17 categories, 52 seeds, provenance summaries, and repair pathway
- `app.js`: builder state, local saving, assembly, versioning, and printing
- `assets/academic-wheel-of-privilege.png`: supplied reflection image
- `assets/jspdf.umd.min.js`: vendored jsPDF 2.5.1 for text-native, private PDF creation in the browser

## Accessibility and privacy review before launch

- Confirm the wheel's rights and attribution, and replace its alt text if the image changes.
- Test the published site with keyboard-only navigation and a screen reader used by your institution.
- Confirm institutional policy and resource names in the shared-floor and escalation language.
- Explain that browser storage is device and profile specific, and clear it on shared computers.
- Do not ask students to put private identity, health, immigration, financial, or trauma information into additions or submitted PDFs.

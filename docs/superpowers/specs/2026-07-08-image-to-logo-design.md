# Image To Logo Tool Site Design

## Product Positioning

Product name: LogoMorph

Slogan: Let every image grow into a brand mark.

Chinese site line: 让每张图片，长成一个品牌标志。

LogoMorph is a lightweight AI tool site for designers, founders, ecommerce sellers, and creators who already have a reference image but need a usable logo direction quickly. The first screen should be the working upload experience, not a marketing-only hero.

## Scope

Build a static, runnable frontend MVP with a production-shaped structure:

- Accept `.png`, `.jpg`, and `.jpeg` files.
- Reject files over 10MB.
- Support click upload and drag-and-drop upload.
- Show clear drag-over visual feedback.
- Preview the uploaded image and simulate logo generation results.
- Include case examples, workflow, service capabilities, pricing-style service tiers, about-us content, and FAQ.
- Leave a clean integration point for a future real AI generation API.

Out of scope for this iteration:

- Real model inference.
- User accounts.
- Payment.
- Server-side file storage.

## User Experience

The page opens with the upload studio visible immediately. The user can click the upload area or drag an image into it. During drag-over, the upload area should visibly brighten, lift, and show a stronger border/glow so users know the drop target is active.

After a valid upload, the page displays:

- Original image preview.
- File name, type, and size.
- A short simulated analysis state.
- Three generated logo directions, each with a distinct style label.
- Download/export buttons as UI affordances.

Validation errors should be plain and actionable:

- Unsupported format: "Please upload PNG, JPG, or JPEG."
- Too large: "Image must be 10MB or smaller."

## Page Structure

1. Sticky navigation with product mark, anchors, and primary CTA.
2. Upload studio as the first viewport signal.
3. Trust/status strip showing supported formats, max size, and output style range.
4. Case gallery with several before-to-logo examples.
5. Workflow section: upload, analyze, generate, refine/export.
6. Capability section: brand extraction, vector-ready direction, palette suggestions, style systems.
7. Service platform section: API-ready, brand kit, batch processing, team review.
8. Pricing/service tiers to make the platform feel complete.
9. About us section.
10. FAQ and footer.

## Visual Direction

Use a 2026-oriented minimal AI product feel:

- Clean white/near-white base with precise contrast.
- Subtle glass panels and hairline borders.
- Bento-style information density without nesting cards inside cards.
- Crisp typography and compact controls.
- A controlled accent palette, avoiding a single-hue purple/blue theme.
- Soft motion for drag-over, generation loading, and result reveal.

The interface should feel modern and utilitarian, not like a generic landing page. Uploading and inspecting results must be the center of the product experience.

## Technical Direction

Use a no-dependency static implementation:

- `index.html` for semantic structure.
- `styles.css` for responsive layout and visual system.
- `script.js` for upload validation, drag/drop interaction, preview, simulated generation, and future API boundary.

Future API boundary:

```js
async function generateLogoFromImage(file, options) {
  // Later replace simulation with a POST request to /api/generate-logo.
}
```

## Verification

Manual verification should cover:

- Click upload opens file picker.
- Drag enter/over changes upload-zone appearance.
- Dropping a PNG/JPG/JPEG under 10MB previews and generates simulated results.
- Unsupported formats show an error.
- Files over 10MB show an error.
- Layout is usable on desktop and mobile widths.

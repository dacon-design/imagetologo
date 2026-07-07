# LogoMorph

LogoMorph is a static image-to-logo tool site prototype.

## Features

- Supports PNG, JPG, and JPEG uploads.
- Validates images at 10MB or smaller.
- Supports click upload and drag-and-drop upload.
- Shows drag-over visual feedback.
- Previews the uploaded image in the browser.
- Simulates three logo directions and leaves a future AI API boundary in `script.js`.
- Includes cases, workflow, platform capability, service tiers, about, FAQ, and footer sections.

## Run Locally

Open `index.html` directly in a browser, or run a local static server:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Future API Boundary

Replace the body of `generateLogoFromImage(file, options)` in `script.js` with a request to a real image generation service, for example:

```js
async function generateLogoFromImage(file, options) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("options", JSON.stringify(options));

  const response = await fetch("/api/generate-logo", {
    method: "POST",
    body: formData,
  });

  return response.json();
}
```

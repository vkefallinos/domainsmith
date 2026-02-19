# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>` or CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
```

## Font Usage

- **Headings:** Space Grotesk (weights 500, 600, 700)
- **Body text:** Inter (weights 400, 500, 600, 700)
- **Code/technical:** JetBrains Mono (weights 400, 500)

## CSS Font Families

```css
:root {
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

## Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        sans: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      }
    }
  }
}
```

## Usage Examples

```html
<!-- Heading -->
<h1 class="font-heading font-bold text-2xl">Page Title</h1>

<!-- Body text -->
<p class="font-sans text-slate-700">Body paragraph</p>

<!-- Code -->
<code class="font-mono text-sm bg-slate-100 px-2 py-1 rounded">code snippet</code>
```

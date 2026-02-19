# Tailwind Color Configuration

## Color Choices

- **Primary:** `violet` — Used for buttons, links, key accents, and active navigation states
- **Secondary:** `amber` — Used for hover states, destructive actions, and subtle highlights
- **Neutral:** `slate` — Used for backgrounds, text, borders, and UI chrome

## Usage Examples

### Primary Actions
```css
/* Primary button */
bg-violet-600 hover:bg-violet-700 text-white

/* Active nav item */
bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border-l-4 border-violet-500

/* Primary link */
text-violet-600 hover:text-violet-700
```

### Secondary / Destructive
```css
/* Logout button */
text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20

/* Badge / tag */
bg-amber-100 text-amber-800
```

### Neutral Text & Backgrounds
```css
/* Body text */
text-slate-700 dark:text-slate-300

/* Muted text */
text-slate-500 dark:text-slate-400

/* Background */
bg-slate-50 dark:bg-slate-950

/* Border */
border-slate-200 dark:border-slate-800
```

## Tailwind Config (if needed)

If you're using a custom Tailwind config, these colors are available as default Tailwind classes:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // violet, amber, and slate are built-in to Tailwind
        // No custom configuration needed
      }
    }
  }
}
```

# Epoverse

Epoverse is a digital news and editorial platform. It takes the content management side of traditional news sites and wraps it in a modern, magazine-style frontend that actually looks good to read. The idea is simple: present quality articles across categories like technology, finance, investing, international affairs, and entertainment, and make the experience of reading them feel premium rather than cluttered.

The project is currently in **active development**.

## What Epoverse Does

At a high level, Epoverse is a full-stack content platform. An admin publishes articles through a separate backend CMS, and this frontend consumes that content via REST APIs and renders it for readers.

Here is what a user can do on the platform right now:

- Browse a homepage with a dynamic, multi-layout article feed (hero cards, stacked grids, editorial rivers, and bento-style blocks that cycle through different visual patterns as you scroll).
- Navigate categories through a mega-menu in the header that pre-loads article previews on hover, with local caching so repeated hovers do not fire additional network requests.
- Read articles in a custom editorial reader with print-inspired typography including drop caps on the opening paragraph, styled pull quotes, and custom list markers.
- Toggle between light and dark mode at any time. The dark mode handling goes deeper than just swapping background colors; it overrides inline styles injected by the backend's rich-text editor so that content always renders cleanly.
- Create an account, log in, and manage a profile with editable name, email, and phone number fields.
- Bookmark articles and manage them from a dedicated profile page.
- Comment on articles (requires login).
- Report articles for issues like spam, fake news, copyright violations, or misleading content (requires login).
- Vote on interactive polls embedded in article sidebars, with the ability to change your vote after submitting.
- Share articles directly to WhatsApp.
- Browse "News Stories" in a horizontally scrollable, Instagram-style story carousel with gradient-bordered thumbnails.

## How the Frontend is Structured

The codebase follows the Next.js App Router convention. Pages live inside `src/app/`, and components are split between `src/components/` (for app-level shared components) and a top-level `components/` directory (for page-specific layouts like the footer, hero section, and category views).

```
epoverse_website/
├── components/                  # Page-specific component groups
│   ├── ArticlesSlugePage/       # Breadcrumb, share buttons for the reader
│   ├── CategoryPage.tsx/        # Breadcrumb, popular posts for category views
│   ├── Footer/                  # Global footer with newsletter, modals
│   ├── Hero/                    # Homepage hero blocks and breaking news bar
│   └── Login/                   # Login and registration modal components
│
├── src/
│   ├── app/
│   │   ├── page.tsx             # Homepage (client component, ~477 lines)
│   │   ├── articles/[slug]/     # Article reader page (server component)
│   │   ├── category/[slug]/     # Category listing page (server component)
│   │   ├── profile/             # User profile with bookmarks and settings
│   │   └── globals.css          # Tailwind config + editorial prose overrides
│   │
│   ├── components/
│   │   ├── ArticleSlugPage/     # Reader widgets: comments, reports, polls,
│   │   │                        #   bookmarks, stories, top-of-week sidebar
│   │   ├── Header/              # Global nav with mega-menu and skeleton loaders
│   │   ├── Sidebar/             # Ad space, "Follow Us" social block
│   │   └── ui/                  # ToastProvider (toasts, confirms, login prompts)
│   │
│   ├── lib/
│   │   ├── axios.ts             # Public and private Axios instances
│   │   ├── categories.ts        # Category fetching helpers
│   │   └── categoriesById.ts    # Category-by-ID lookup
│   │
│   ├── providers/               # React context providers (theme, etc.)
│   │
│   ├── services/                # API layer (one file per domain)
│   │   ├── articleService.ts    # CRUD for articles, fetch by slug/category
│   │   ├── bookmarkService.ts   # Save, remove, list bookmarks
│   │   ├── categoryService.ts   # Fetch all categories
│   │   ├── login.ts             # Login endpoint
│   │   ├── register.ts          # Registration endpoint
│   │   ├── pollService.ts       # Get polls, create votes, change votes
│   │   ├── popularnews.ts       # Fetch popular/trending articles
│   │   ├── profile.ts           # Get and update user profile
│   │   ├── storyService.ts      # Fetch stories and story items
│   │   ├── topweek.ts           # Fetch top articles of the week
│   │   └── userService.ts       # User-related utilities
│   │
│   └── types/
│       ├── article.ts           # Article and Category type definitions
│       └── category.ts          # Category interface
```

## Tech Stack

- **Next.js 14** with the App Router. Server components are used for the article reader and category pages (good for SEO), while the homepage and interactive widgets are client components.
- **React 18** for the UI layer.
- **TypeScript** across the entire codebase.
- **Tailwind CSS 3.4** with the Typography plugin (`@tailwindcss/typography`) as a baseline for article body styling.
- **Custom CSS overrides** in `globals.css` defining the `.editorial-prose` class that layers on top of Tailwind's prose classes. This handles drop caps, pull quotes with decorative quotation marks, arrow-style list markers, triple-dot separators for horizontal rules, and ambient shadow effects on images.
- **Axios** for all HTTP communication, split into two instances: `publicApi` (no auth) for reading content and `privateApi` (attaches JWT from localStorage) for actions like commenting, reporting, and bookmarking.
- **next-themes** for light/dark mode toggling with system preference detection.
- **Lucide React** and **React Icons** for iconography.

## The Notification System

Instead of using native browser alerts, Epoverse uses a custom `ToastProvider` context that powers three types of UI feedback:

1. **Toast notifications** that slide in from the top-right corner with auto-dismiss after 3.5 seconds. They support success, error, warning, and info variants with matching icons.
2. **Confirmation modals** that return a Promise, so the calling code can `await` the user's decision. Used for things like logout confirmation.
3. **Login prompt modals** that appear when an unauthenticated user tries to perform a protected action (commenting, voting, reporting, bookmarking). These offer a "Login" button that redirects to the auth flow with a return URL, or a "Cancel" to dismiss.

## How Authentication Works

Authentication is modal-based. Login and registration forms appear as overlays on the current page rather than navigating away. On successful login, a JWT token is stored in localStorage. The private Axios instance reads this token and attaches it as a Bearer token in the Authorization header for every request.

The header component checks for the token on mount and conditionally renders either Login/Register buttons or Profile/Logout icons.

## Homepage Layout Patterns

The homepage is not a simple list of articles. It uses a rotating set of layout patterns to keep the page visually dynamic as content scales:

1. **Hero block**: A large featured article with a gradient overlay, flanked by two vertically stacked medium cards and a sidebar column of four compact thumbnail items.
2. **Featured horizontal card**: A wide split-layout card with an image on the left and editorial text on the right.
3. **Dual symmetric grid**: Two equal-width cards side by side.
4. **Editorial river**: Horizontal cards with image-left, text-right layout.
5. **Magazine bento**: The bottom section cycles through three layout patterns in a loop: (a) one large card + two stacked small cards, (b) three equal columns, (c) two compact side-by-side cards. This prevents visual monotony regardless of how many articles exist.

## Article Reader

The article detail page (`/articles/[slug]`) is a server component that fetches article data by slug before rendering. It includes:

- A category pill badge.
- The headline in large, tracked-tight typography.
- An author block with generated initials avatar, author name, and formatted publication date.
- A share/bookmark action bar (WhatsApp share + bookmark with loading spinner).
- A featured image with hover-scale effect.
- The article body rendered via `dangerouslySetInnerHTML` with the `.editorial-prose` class applied for premium typography.
- Below the article: a report form with reason categories and a comment section.
- In the sidebar: popular posts, top articles of the week, and an interactive voting poll.

## Environment Variables

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for the backend REST API |
| `NEXT_PUBLIC_SITE_URL` | Frontend URL, used when generating share links |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/TheKrishLabs/epoverse_website.git
cd epoverse_website

# Install dependencies
npm install

# Create your environment file
# Add NEXT_PUBLIC_API_URL and NEXT_PUBLIC_SITE_URL
cp .env.example .env

# Start the dev server
npm run dev
```

Then open `http://localhost:3000`.

Note: The backend API is hosted on Render's free tier and may take 30-60 seconds to wake up on the first request after a period of inactivity. If you see connection errors on initial load, wait a moment and refresh.

## Available Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Next.js development server on port 3000 |
| `npm run build` | Creates a production-optimized build |
| `npm run start` | Serves the production build locally |
| `npm run lint` | Runs ESLint for code quality checks |

## Backend

The backend is a separate Node.js REST API (not included in this repository). It handles:

- Article and category CRUD operations
- User registration and login with JWT issuance
- Bookmark management per user
- Comment and report storage
- Poll creation, vote tracking, and vote changes
- Story and story item management

The frontend communicates with it exclusively through the Axios service layer in `src/services/`.

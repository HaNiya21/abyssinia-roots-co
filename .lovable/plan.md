# Abyssinia Roots & Co. Ecommerce Build Plan

## Goal
Build a complete, premium Ethiopian-inspired ecommerce storefront for Abyssinia Roots & Co., powered by Inkthreadable for fulfillment, with a custom admin dashboard for catalog and order management.

## Decisions from clarifying questions
- **Backend / fulfillment:** Inkthreadable directly (not Shopify). You have API credentials ready.
- **First delivery:** Full storefront look & feel (home, collections, product pages, cart, checkout flow).
- **Admin:** Custom dashboard on the site for products, collections, orders, and fulfillment-source management.
- **Product imagery:** Generate tasteful brand placeholders now; swap in your real photos later without code changes.

## Phase 1 — Visual direction
Generate 3 distinct design directions as rendered prototypes. You pick one. All directions will be:
- Modern, premium, warm, and contemporary Ethiopian (not generic African marketplace).
- Editorial layouts with strong typography, generous spacing, and subtle Ethiopian-inspired accents.
- Mobile-first and responsive.

## Phase 2 — Foundation
- Enable Lovable Cloud for database, auth, and server functions.
- Set up the design system in `src/styles.css` with an Ethiopian earth / coffee / gold palette using oklch tokens.
- Create shared layout components: header, navigation, footer, newsletter banner.

## Phase 3 — Storefront routes
Create separate, SEO-ready routes for:
- `/` — Home with hero, featured collections, best sellers, new arrivals, Amharic designs, culture story, reviews, newsletter.
- `/shop` — Shop all with filters (category, collection, price, size, color, newest, best selling) and sorting.
- `/collections/:handle` — Apparel, Hats & Bags, Home & Living, Amharic Collection, Ethiopian Culture & Gifts, New Arrivals, Best Sellers.
- `/products/:handle` — Product detail with images, variants, size/color selectors, quantity, Add to Cart, Buy Now, details, materials, care, shipping, related products.
- `/cart` — Cart page with line items, quantities, removals, subtotal, checkout CTA.
- `/checkout` — Checkout flow using Inkthreadable order placement (or a secure payment layer if Inkthreadable does not expose checkout directly).
- `/about`, `/contact`, `/faq`, `/shipping-returns`, `/privacy-policy`, `/terms-and-conditions`.
- `/account` — Customer account, order history, wishlist, recently viewed.
- Search, wishlist, and 404 pages.

## Phase 4 — Product data model
- Lovable Cloud (Postgres) tables for products, variants, collections, categories, inventory, reviews, orders, customers.
- Every product carries a `fulfillment_source` field: Own Brand, Inkthreadable, Amazon, Third Party, Dropship Supplier.
- Orders can contain items from multiple fulfillment sources; admin shows source per line item.
- Flexible category/collection architecture so new categories can be added without structural changes.

## Phase 5 — Inkthreadable integration
- Store your Inkthreadable API credentials as Lovable secrets.
- Build a server-side integration layer that:
  - Fetches product/catalog data if the API supports it.
  - Places orders to Inkthreadable for items sourced to them.
  - Falls back to a manual queue if an endpoint is unavailable.
- Do not invent API endpoints; use only documented Inkthreadable API behavior.

## Phase 6 — Admin dashboard
- Protected `/admin` area with role-based access.
- Manage products, collections, variants, prices, inventory, and fulfillment sources.
- Feature products and manage homepage sections.
- View orders, update order status, and see fulfillment source per item.
- Create discount codes.

## Phase 7 — Customer experience
- Search with autocomplete.
- Wishlist (saved to account).
- Recently viewed products.
- Product reviews.
- Newsletter email signup.

## Phase 8 — SEO & polish
- Unique `head()` metadata on every route.
- Open Graph, structured data, sitemap, and robots.txt.
- Target keywords: Ethiopian gifts, Ethiopian clothing, Amharic shirts, Habesha clothing, Ethiopian home décor, Amharic typography, Ethiopian culture gifts.
- Test navigation, browsing, product details, cart, checkout, search, filters, mobile layout, admin, auth, and empty/error states.

## What I need from you later
- Your Inkthreadable API credentials (stored securely via Lovable secrets).
- Any real product photos/designs when ready (replacing generated placeholders).

## What you will get first
A fully designed, responsive storefront with generated brand imagery, real page structure, and working navigation — ready to wire to Inkthreadable and the admin dashboard in following steps.

# Admin Implementation Roadmap

## Phase 1: Foundation

Create the app foundation before page details.

Tasks:

- Add `src/data/user.json`, `product.json`, `banner.json`, and `content.json`.
- Add basic routing for `/dashboard`, `/users`, `/products`, and `/banners`.
- Add shared layout components for sidebar, topbar, content area, and footer.
- Add shared UI components for cards, buttons, inputs, dropdowns, tabs, tables, modals, and badges.
- Add admin session state.
- Add admin login modal that checks `user.json`.

Done when:

- App opens to the admin login modal.
- Valid admin credentials unlock the dashboard.
- Invalid credentials show an error.
- Sidebar navigation can switch between the four planned pages.

## Phase 2: Dashboard

Tasks:

- Compute totals from JSON data.
- Render dashboard metric cards.
- Add overview trend section.
- Add leads by source section.
- Add top performing cities.
- Add recent activity.
- Add system summary.

Done when:

- Dashboard has no hardcoded business metrics.
- Empty data does not break the page.
- Date range and refresh controls have frontend states.

## Phase 3: User Management

Tasks:

- Build user metric cards from `user.json`.
- Add search, role, status, and city filters.
- Add tabs for user groups.
- Add paginated user table.
- Add action menu.
- Add confirmation modal for risky actions.

Done when:

- Admin can filter and search users.
- Admin can open row actions.
- Local state updates for verify, suspend, deactivate, and delete.
- No business rows are hardcoded.

## Phase 4: Product Management

Tasks:

- Build product metric cards from `product.json`.
- Add product filters.
- Add product tabs.
- Add paginated product table.
- Add pinned products by city panel.
- Add bulk selection and bulk action control.
- Add quick action buttons for add, import, category management, and brand management.

Done when:

- Admin can search and filter products.
- Admin can select multiple products.
- Admin can pin and unpin products locally.
- Pin limits are read from JSON.

## Phase 5: Banner Management

Tasks:

- Build banner metric cards from `banner.json`.
- Add banner filters.
- Add banner tabs.
- Add banner table.
- Add pinned banners by city panel.
- Add banner performance panel.
- Add quick actions.
- Add banner guidelines from `content.json`.

Done when:

- Admin can search and filter banners.
- Admin can see scheduled, draft, expired, inactive, pinned, and active banners.
- Admin can update local banner status.
- Banner guideline content is read from JSON.

## Phase 6: Polish and Future API Readiness

Tasks:

- Add loading states around service calls, even if data is local.
- Add empty states for every table.
- Add consistent error states.
- Add formatters for currency, dates, compact numbers, and percentages.
- Keep JSON loading behind service modules.
- Add comments only where future backend replacement points are not obvious.

Done when:

- Services can later switch from JSON imports to API calls without changing page component contracts.
- Shared components are reusable by future admin modules.
- The app structure can support Shops, Reviews, Orders / Leads, Reports, Payouts, Disputes, Support Tickets, System Settings, and Audit Logs.

## Suggested Route Map

```js
[
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'dashboard' },
  { path: '/users', name: 'users' },
  { path: '/products', name: 'products' },
  { path: '/banners', name: 'banners' }
]
```

## Suggested Service Map

```text
adminAuthService.login(email, password)
adminAuthService.logout()
adminAuthService.getCurrentAdmin()

userService.listUsers(filters)
userService.updateUser(userId, patch)
userService.deleteUser(userId)

productService.listProducts(filters)
productService.updateProduct(productId, patch)
productService.bulkUpdateProducts(productIds, patch)

bannerService.listBanners(filters)
bannerService.updateBanner(bannerId, patch)
bannerService.reorderBanners(city, orderedBannerIds)

contentService.getAppContent()
```


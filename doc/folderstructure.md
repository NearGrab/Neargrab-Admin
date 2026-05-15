# Neargrab Admin Folder Structure

## Goal

The admin panel should be organized so new modules can be added without rewriting the app. Each major admin area should own its page, local sections, helpers, and data mapping while shared UI remains reusable.

The current project is a Vue 3 + Vite app.

## Recommended Structure

```text
Neargrab-Admin/
  doc/
    Admin.md
    folderstructure.md
    data-contracts.md
    implementation-roadmap.md
  public/
    favicon.svg
    icons.svg
  src/
    App.vue
    main.js
    style.css
    assets/
      images/
      icons/
    components/
      common/
        AppButton.vue
        AppCard.vue
        AppDropdown.vue
        AppInput.vue
        AppModal.vue
        AppTable.vue
        Badge.vue
        ConfirmDialog.vue
        EmptyState.vue
        MetricCard.vue
        SearchInput.vue
        StatusBadge.vue
      layout/
        AdminLayout.vue
        AdminSidebar.vue
        AdminTopbar.vue
        AdminFooter.vue
      charts/
        AreaChart.vue
        DonutChart.vue
        MiniTrendChart.vue
      auth/
        AdminLoginModal.vue
        AdminRouteGuard.vue
    data/
      user.json
      product.json
      banner.json
      content.json
    pages/
      dashboard/
        DashboardPage.vue
        components/
          DashboardMetricGrid.vue
          LeadsBySource.vue
          OverviewChart.vue
          RecentActivity.vue
          SystemSummary.vue
          TopCities.vue
        dashboard.helpers.js
      users/
        UsersPage.vue
        components/
          UserActionMenu.vue
          UserFilters.vue
          UserMetricGrid.vue
          UserTable.vue
        users.helpers.js
      products/
        ProductsPage.vue
        components/
          ProductActionMenu.vue
          ProductFilters.vue
          ProductMetricGrid.vue
          ProductPinnedPanel.vue
          ProductTable.vue
        products.helpers.js
      banners/
        BannersPage.vue
        components/
          BannerActionMenu.vue
          BannerFilters.vue
          BannerMetricGrid.vue
          BannerPinnedPanel.vue
          BannerPerformance.vue
          BannerTable.vue
        banners.helpers.js
    router/
      index.js
      routes.js
    services/
      adminAuthService.js
      userService.js
      productService.js
      bannerService.js
      contentService.js
    stores/
      adminSessionStore.js
      uiStore.js
    utils/
      date.js
      filters.js
      formatters.js
      ids.js
      permissions.js
    constants/
      adminRoles.js
      routes.js
      statuses.js
    styles/
      base.css
      tokens.css
      layout.css
      components.css
```

## Folder Responsibilities

### `doc/`

Planning and implementation documentation for the admin panel. Keep product decisions, folder conventions, data contracts, and roadmap notes here.

### `src/components/common/`

Shared UI components that are not tied to one page. These should be reusable across Dashboard, Users, Products, and Banners.

Examples:

- Buttons
- Inputs
- Dropdowns
- Tables
- Cards
- Modals
- Badges
- Empty states

### `src/components/layout/`

The persistent admin shell. The sidebar, topbar, footer, and main layout belong here.

### `src/components/auth/`

Admin access components. The login modal and route guard belong here because authentication is used across every page.

### `src/components/charts/`

Reusable chart display components. Keep chart visuals here and page-specific data mapping inside each page helper file.

### `src/data/`

Frontend-only JSON data source for the first build.

Required files:

- `user.json`
- `product.json`
- `banner.json`
- `content.json`

These files act as mock API responses. Components should not hardcode business data that belongs here.

### `src/pages/`

Route-level pages grouped by feature. Each page folder owns its private sections and helper functions.

Use this rule:

- Shared by many pages: put it in `components/common/`
- Used only by one page: keep it inside that page's `components/`
- Data transformation for one page: keep it in that page's helper file

### `src/router/`

Route definitions and navigation guards.

The first active routes should be:

- `/dashboard`
- `/users`
- `/products`
- `/banners`

Future routes can be added without changing layout components.

### `src/services/`

Data access layer. During the frontend-only phase, these services read from JSON files. Later they should call backend APIs.

Components should call services or stores instead of importing JSON directly when possible. This makes the backend migration cleaner.

### `src/stores/`

Simple app state. Because the project currently only depends on Vue, the first build can use Vue reactive modules. Pinia can be introduced later if app state grows.

Recommended stores:

- `adminSessionStore.js` for logged-in admin state
- `uiStore.js` for sidebar, modals, and shared UI state

### `src/utils/`

Pure helper functions with no Vue dependency.

Examples:

- Date formatting
- Currency formatting
- Percentage formatting
- Search/filter helpers
- Permission checks

### `src/constants/`

Stable labels and enums used across the admin app.

Examples:

- Roles
- Status values
- Route names
- Permission keys

### `src/styles/`

Split CSS once the app grows beyond the current single `style.css`.

Recommended CSS files:

- `tokens.css` for colors, spacing, shadows, typography
- `base.css` for reset and document-level rules
- `layout.css` for app shell layout
- `components.css` for reusable component styling

## Naming Rules

Use PascalCase for Vue components:

- `UsersPage.vue`
- `AdminLoginModal.vue`
- `MetricCard.vue`

Use camelCase for JavaScript modules:

- `adminAuthService.js`
- `users.helpers.js`
- `formatters.js`

Use kebab-case only for static assets when useful:

- `empty-banner.png`
- `neargrab-logo.svg`

## Component Rules

Page components should orchestrate data and layout. They should not contain large table-row logic or repeated UI blocks.

Reusable components should receive data through props and emit events. They should not import page JSON directly.

Action menus should emit action names with ids:

```js
emit('action', { action: 'suspend-user', userId })
```

Do not emit row indexes because sorting, filtering, and pagination will change them.

## Data Rules

Do not hardcode business data inside Vue files.

Business data belongs in:

- `src/data/user.json`
- `src/data/product.json`
- `src/data/banner.json`
- `src/data/content.json`

Page components can define UI state such as selected filters, active tabs, modal visibility, and selected ids.

## Future Module Expansion

The sidebar already shows future modules. When a new page is added, use the same pattern:

```text
src/pages/module-name/
  ModuleNamePage.vue
  components/
  moduleName.helpers.js
```

This keeps the app scalable without turning `components/` into a mixed folder of unrelated page sections.


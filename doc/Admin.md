# Neargrab Admin Panel Plan

## Purpose

The Neargrab admin panel is the internal control center for monitoring marketplace health, managing users, reviewing products, and controlling promotional banners. The first build will be frontend-only and data-driven from local JSON files so the admin experience can be designed, tested, and reviewed before connecting the backend APIs.

The first release includes four pages:

- Dashboard
- User Management
- Product Management
- Banner Management

Authentication is also required before the admin can access these pages. For now, the login modal checks admin email and password from `src/data/user.json`.

## Admin Authentication Modal

### Why Admin Needs It

The admin panel contains sensitive marketplace controls: user suspension, product visibility, banner placement, and system-level metrics. Even during the frontend-only phase, the app should behave like a protected admin surface so future backend authentication can be added without redesigning the flow.

### Modal Behavior

The app should open with an admin verification modal if no active admin session exists.

The modal contains:

- Email input
- Password input
- Submit button
- Inline validation messages
- Loading state for the future API transition
- Error state for invalid credentials

### Frontend-Only Execution

Credentials are checked against admin records in `src/data/user.json`.

Recommended user data fields:

```json
{
  "id": "admin-001",
  "name": "Admin User",
  "email": "admin@neargrab.in",
  "password": "admin123",
  "role": "super_admin",
  "status": "active",
  "avatarInitials": "AD"
}
```

Only users with an admin role and active status should pass the check.

Accepted admin roles:

- `admin`
- `super_admin`
- `support_admin`
- `content_admin`

Session handling for the frontend-only phase can use a small local state store and optionally `localStorage` with the logged-in admin id. Do not store the password in browser storage.

When backend authentication is added later, the modal should call an auth service instead of reading `user.json`, but the modal UI and route guard behavior should remain the same.

## Global Admin Layout

All four pages share the same shell:

- Fixed left sidebar with Neargrab logo and navigation
- Top bar with menu toggle, global search, notifications, messages, admin avatar, and account menu
- Main content area with page title and page-level actions
- Footer with copyright, system time, and app version

### Sidebar Navigation

The full sidebar can show future modules from the design, but only four routes should be active in the first build:

- Dashboard
- Users
- Products
- Banner Management under Ad & Promotions

Future modules can remain hidden
- Shops
- Reviews
- Orders / Leads
- Reports
- Payouts
- Disputes
- Support Tickets
- System Settings
- Audit Logs

## Page 1: Dashboard

### Usage

The dashboard gives admins a fast operational summary of Neargrab. It answers: how many users, shops, products, reviews, and leads exist; how growth is trending; which cities are performing; and what needs attention.

### Why Admin Needs It

Admins need a first screen that highlights marketplace health without forcing them to open every module. The dashboard should help them notice growth, suspicious drops, pending work, and city-level activity.

### Data Sources

Primary data should come from:

- `src/data/user.json`
- `src/data/product.json`
- `src/data/banner.json`
- `src/data/content.json`

Dashboard cards should be computed from data where possible instead of hardcoded. For example, total users comes from `user.json`, total products from `product.json`, and banner activity from `banner.json`.

### Main Sections

Metric cards:

- Total Users
- Total Shops
- Total Products
- Total Reviews
- Total Leads / Directions

Charts and insights:

- Overview trend for users, shops, and leads
- Leads by source
- Top performing cities
- New users trend
- New shops trend
- Products added trend
- Recent activity
- System summary

### Execution Notes

The first implementation can use lightweight computed values and simple chart components. If a chart library is added later, keep chart data mapping inside page-specific helpers so the UI components remain reusable.

Empty states should appear if JSON files have no data.

## Page 2: User Management

### Usage

The User Management page lets admins view, search, filter, add, verify, suspend, deactivate, reset passwords, and update user metadata.

### Why Admin Needs It

Neargrab has both customers and shopkeepers. Admins need to resolve account issues, review suspicious users, verify shopkeepers, and support users who cannot access their accounts.

### Data Source

All user table data comes from `src/data/user.json`.

No table rows, counts, roles, statuses, cities, usernames, or emails should be hardcoded in Vue components.

### Main Sections

Metric cards:

- Total Users
- Customers
- Shopkeepers
- Suspended Users
- New This Week

Filters:

- Search by name, username, phone, or email
- Role filter
- Status filter
- City filter
- More filters

Tabs:

- All Users
- Customers
- Shopkeepers
- Verified Users
- Suspended Users

Table columns:

- Select checkbox
- User
- Role
- Username
- Phone
- Email
- City
- Status
- Joined On
- Actions

Actions:

- View Profile
- Edit User
- Change Username
- Change Role
- Verify User
- Suspend User
- Deactivate User
- Reset Password
- Delete User

### Execution Notes

The first build can update local reactive state only. Later, every action should map to an API endpoint and write an audit log entry.

User actions should require confirmation for risky operations:

- Suspend User
- Deactivate User
- Reset Password
- Delete User

## Page 3: Product Management

### Usage

The Product Management page lets admins review, approve, pin, unpin, filter, and manage products listed by shops.

### Why Admin Needs It

Product quality directly affects user trust. Admins need to manage stock visibility, remove flagged products, approve new listings, and promote important products in specific cities.

### Data Source

Product records come from `src/data/product.json`.

Related shop and owner information can be referenced by ids from `src/data/user.json` when the shopkeeper data lives there. If shops become a separate resource later, this can move to `src/data/shop.json`.

### Main Sections

Metric cards:

- Total Products
- In Stock Products
- Out of Stock
- Products Pinned
- Shops with Products

Filters:

- Search by product name, SKU, or shop name
- Category
- Shop
- Status
- Stock status
- City
- More filters

Tabs:

- All Products
- Pending Approval
- Flagged
- Out of Stock
- Pinned Products

Table columns:

- Select checkbox
- Product
- Shop
- Category
- Price
- Stock
- Status
- City
- Added On
- Actions

Right panel:

- Pinned products by city
- Bulk actions
- Quick actions

Actions:

- Add Product
- Edit Product
- Approve Product
- Flag Product
- Pin Product
- Unpin Product
- Mark Out of Stock
- Delete Product
- Import Products
- Manage Categories
- Manage Brands

### Execution Notes

Pinned product limits should be configurable by city. The design shows a limit like `10 / 10`, so the JSON model should support `pinLimit` and a product-level `isPinned` flag or city-level pinned ordering.

Bulk actions should be implemented through selected product ids, not row indexes.

## Page 4: Banner Management

### Usage

The Banner Management page lets admins create, schedule, pin, review, and analyze promotional banners shown across the Neargrab app.

### Why Admin Needs It

Banners influence what users see first. Admins need control over city targeting, section placement, device visibility, campaign timing, and paid promotion performance.

### Data Source

Banner records come from `src/data/banner.json`.

Static page copy, banner guidelines, section labels, plan names, and helper content should come from `src/data/content.json`.

### Main Sections

Metric cards:

- Total Banners
- Active Banners
- Pinned Banners
- Total Views This Month
- Clicks This Month
- Revenue This Month

Filters:

- Search by banner title or shop name
- City
- Section
- Status
- Device
- Plan
- More filters

Tabs:

- All Banners
- Pinned Banners
- Scheduled
- Drafts
- Expired
- Inactive

Table columns:

- Drag handle for ordering
- Banner image
- Title and shop
- City
- Section
- Devices
- Status
- Schedule
- Views
- Clicks
- Revenue
- Actions

Right panel:

- Pinned banners by city
- Banner performance
- Quick actions
- Banner guidelines

Actions:

- Create Banner
- Edit Banner
- Upload Banner
- Bulk Upload
- Use Banner Template
- Pin Banner
- Unpin Banner
- Schedule Banner
- Deactivate Banner
- View Analytics
- Audit Log

### Execution Notes

Banner ordering should use a stable `sortOrder` field. Dragging rows should update the local order in state during the frontend-only phase.

The banner model should support both mobile and desktop device targeting.

## Data-Driven Rule

No business data should be hardcoded inside components.

Allowed hardcoded values:

- Route paths
- Component names
- Generic UI labels when they are not business content
- Design token names

Data must come from:

- `src/data/user.json`
- `src/data/product.json`
- `src/data/banner.json`
- `src/data/content.json`

If a component needs display content that may change, place it in `content.json`.

## Recommended First Build Order

1. Create data files and seed realistic sample data.
2. Create admin auth modal and route guard.
3. Build the shared admin layout.
4. Build reusable UI components.
5. Build Dashboard using computed JSON data.
6. Build User Management with filters, tabs, table, and actions.
7. Build Product Management with filters, pinned products, and bulk selection.
8. Build Banner Management with scheduling, pinned city limits, and right panels.
9. Add empty states, loading states, and confirmation modals.
10. Prepare service layer replacement points for future backend APIs.

## Future Backend Transition

When APIs are ready, replace JSON imports with service functions. Page components should not care whether data came from JSON or HTTP.

Recommended transition path:

- Keep `src/services/adminAuthService.js`
- Keep `src/services/userService.js`
- Keep `src/services/productService.js`
- Keep `src/services/bannerService.js`
- Replace local JSON reads inside services with API calls
- Keep component props and return shapes stable


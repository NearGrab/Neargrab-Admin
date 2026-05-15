# Admin Data Contracts

## Purpose

The first admin build is frontend-only. These JSON files should behave like mock API responses so the UI can later move to backend services with minimal changes.

Required data files:

- `src/data/user.json`
- `src/data/product.json`
- `src/data/banner.json`
- `src/data/content.json`

## General Rules

Every item must have a stable `id`.

Use ids for relationships instead of duplicating full objects.

Use ISO date strings for dates:

```text
2026-05-15T10:30:00+05:30
```

Use lowercase machine values for statuses and roles:

```text
active
suspended
pending
shopkeeper
super_admin
```

Format labels in the UI layer, not in JSON.

## `user.json`

Used by:

- Admin authentication modal
- Dashboard metrics
- User Management page
- Product shop/owner references when needed

Recommended shape:

```json
{
  "users": [
    {
      "id": "user-001",
      "name": "Rohan Patel",
      "username": "rohan_patel",
      "email": "rohan.patel21@gmail.com",
      "phone": "+91 98765 43210",
      "role": "customer",
      "status": "active",
      "city": "Surat",
      "avatarUrl": "/avatars/rohan.png",
      "verified": true,
      "joinedAt": "2026-05-15T10:30:00+05:30"
    }
  ],
  "admins": [
    {
      "id": "admin-001",
      "name": "Admin User",
      "email": "admin@neargrab.com",
      "password": "admin123",
      "role": "super_admin",
      "status": "active",
      "avatarInitials": "AD",
      "permissions": ["users:manage", "products:manage", "banners:manage"]
    }
  ]
}
```

Valid user roles:

- `customer`
- `shopkeeper`
- `admin`
- `super_admin`
- `support_admin`
- `content_admin`

Valid user statuses:

- `active`
- `pending`
- `suspended`
- `deactivated`

## `product.json`

Used by:

- Dashboard metrics
- Product Management page
- Banner page when banners target products

Recommended shape:

```json
{
  "products": [
    {
      "id": "product-001",
      "name": "Amul Taaza Milk 1L",
      "sku": "MILK001",
      "shopId": "shop-001",
      "shopName": "Patel General Store",
      "category": "dairy",
      "brand": "Amul",
      "city": "Surat",
      "price": 70,
      "mrp": 80,
      "currency": "INR",
      "stockStatus": "in_stock",
      "status": "active",
      "isPinned": true,
      "isFlagged": false,
      "imageUrl": "/products/amul-taaza-1l.png",
      "addedAt": "2026-05-15T10:30:00+05:30"
    }
  ],
  "categories": [
    {
      "id": "category-dairy",
      "name": "Dairy",
      "status": "active"
    }
  ],
  "brands": [
    {
      "id": "brand-amul",
      "name": "Amul",
      "status": "active"
    }
  ],
  "pinRules": [
    {
      "city": "Surat",
      "pinLimit": 10
    }
  ]
}
```

Valid product statuses:

- `active`
- `pending_approval`
- `flagged`
- `inactive`
- `deleted`

Valid stock statuses:

- `in_stock`
- `out_of_stock`

## `banner.json`

Used by:

- Dashboard metrics
- Banner Management page

Recommended shape:

```json
{
  "banners": [
    {
      "id": "banner-001",
      "title": "Fresh Groceries",
      "shopId": "shop-001",
      "shopName": "Patel General Store",
      "city": "Surat",
      "section": "top_hero",
      "status": "pinned",
      "devices": ["mobile", "desktop"],
      "plan": "premium",
      "imageUrl": "/banners/fresh-groceries.png",
      "startAt": "2026-05-01T00:00:00+05:30",
      "endAt": "2026-05-30T23:59:59+05:30",
      "views": 125430,
      "clicks": 4825,
      "revenue": 28450,
      "currency": "INR",
      "sortOrder": 1,
      "createdAt": "2026-04-28T09:00:00+05:30"
    }
  ],
  "pinRules": [
    {
      "city": "Surat",
      "pinLimit": 10
    }
  ]
}
```

Valid banner sections:

- `top_hero`
- `top_carousel`
- `middle_banner`
- `bottom_banner`

Valid banner statuses:

- `draft`
- `scheduled`
- `active`
- `pinned`
- `expired`
- `inactive`

Valid devices:

- `mobile`
- `desktop`

## `content.json`

Used by:

- Static labels that may change
- Banner guidelines
- Dashboard system summary labels
- Empty state messages
- Filter option labels
- Sidebar labels if product wants them configurable

Recommended shape:

```json
{
  "app": {
    "name": "Neargrab",
    "panelName": "Admin Panel",
    "version": "v2.1.0"
  },
  "bannerGuidelines": {
    "recommendedSize": "1920x600 px",
    "maxFileSize": "2MB",
    "formats": ["JPG", "PNG", "WebP"]
  },
  "emptyStates": {
    "users": "No users found.",
    "products": "No products found.",
    "banners": "No banners found."
  },
  "cities": ["Surat", "Navsari", "Valsad", "Vapi", "Bharuch"]
}
```

## Security Note

Plain-text passwords are acceptable only for the frontend-only mock phase. Before production, admin authentication must move to backend-managed password hashing, secure sessions, and role-based authorization.


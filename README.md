# E-Shop — Full-Stack E-Commerce Marketplace

A role-based e-commerce application where buyers can browse products and place orders, vendors can manage their catalogues, and administrators can manage vendors.

## Features

- JWT authentication with `buyer`, `vendor`, and `admin` roles
- Product catalogue with image upload, inventory, and vendor ownership
- Buyer cart, saved delivery addresses, checkout, orders, and payments
- Vendor dashboard, product management, and order management
- Admin dashboard with vendor freeze/unfreeze controls
- Frozen vendor products stay visible to buyers as **Out of stock** and cannot be added to cart or ordered

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JSON Web Tokens and bcrypt

## Project structure

```text
.
├── backend/       # Express API and MongoDB models
└── frontend/      # React client
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Installation

Clone the repository and install dependencies for both applications:

```bash
git clone <your-repository-url>
cd "E-commerce backend"

cd backend
npm install

cd ../frontend
npm install
```


## Create the admin account

From the `backend` folder, run:

```bash
npm run seed:admin
```

This command creates the admin account if it does not exist, or updates the existing account with the same email. The password is hashed before it is stored. Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## Run locally

Open two terminals.

Start the backend:

```bash
cd backend
npm run dev
```

The API runs at `http://localhost:5000`.

Start the frontend:

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Available scripts

| Location | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm run dev` | Start the API with nodemon |
| `backend` | `npm start` | Start the API |
| `backend` | `npm run seed:admin` | Create or update the admin account |
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run build` | Build the frontend for production |

## Main API routes

All API routes start with `/api`. Protected endpoints require `Authorization: Bearer <token>`.

| Area | Base path | Examples |
| --- | --- | --- |
| Authentication | `/auth` | `POST /register`, `POST /login`, `GET /profile` |
| Products | `/products` | `GET /`, `GET /:id`, vendor product CRUD |
| Cart | `/cart` | Add, view, update, remove, or clear cart items |
| Orders | `/orders` | Create an order, view buyer/vendor/admin orders |
| Payments | `/payments` | Make a payment and view payment records |
| Dashboards | `/dashboard` | `GET /vendor`, `GET /admin` |
| Admin | `/admin` | `GET /vendors`, `PUT /vendors/:vendorId/freeze` |

## Roles and permissions

| Role | Capabilities |
| --- | --- |
| Buyer | Browse products, manage cart and addresses, place orders, make payments |
| Vendor | Create, edit, and delete own products; manage own orders |
| Admin | View admin dashboard and freeze/unfreeze vendors |

When a vendor is frozen, they cannot manage products. Their products remain visible in the buyer storefront as out of stock, and the API prevents buyers from adding them to the cart or ordering them.





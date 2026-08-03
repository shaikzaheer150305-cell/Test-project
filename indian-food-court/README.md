# Indian Food Court - Real-time E-commerce

A full-stack real-time food ordering platform built with the MERN stack + Socket.io.

## Features

- **Customer**: Browse restaurants, order food, real-time order tracking, reviews
- **Vendor**: Manage restaurant, menu items, accept/process orders
- **Delivery**: Accept deliveries, live GPS tracking, update order status
- **Admin**: Dashboard with stats, manage users/restaurants/orders

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Socket.io Client, Axios |
| Backend | Node.js, Express, Socket.io, JWT Auth |
| Database | MongoDB with Mongoose |
| Real-time | Socket.io (order tracking, delivery location) |

## Project Structure

```
indian-food-court/
├── server/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, file upload
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── socket/          # Socket.io handlers
│   ├── index.js         # Server entry
│   └── .env             # Environment variables
├── client/
│   ├── public/
│   └── src/
│       ├── components/  # Navbar, FoodCard
│       ├── context/     # Auth, Cart providers
│       ├── pages/       # All page components
│       └── utils/       # API, Socket helpers
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### 1. Install Backend Dependencies
```bash
cd indian-food-court/server
npm install
```

### 2. Install Frontend Dependencies
```bash
cd indian-food-court/client
npm install
```

### 3. Configure Environment
Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/indian_food_court
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000
```

### 4. Start MongoDB
```bash
# If using local MongoDB
mongod
```

### 5. Start Backend Server
```bash
cd server
npm run dev
```

### 6. Start Frontend
```bash
cd client
npm start
```

The app will be running at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Restaurants
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/:id` - Get restaurant + menu
- `POST /api/restaurants` - Create restaurant (vendor)
- `PUT /api/restaurants/:id` - Update restaurant
- `PUT /api/restaurants/:id/toggle-open` - Toggle open/closed

### Food Items
- `GET /api/restaurants/:restaurantId/items` - Get menu items
- `POST /api/restaurants/items` - Add food item (vendor)
- `PUT /api/restaurants/items/:id` - Update food item
- `DELETE /api/restaurants/items/:id` - Delete food item

### Orders
- `POST /api/orders` - Place order (customer)
- `GET /api/orders/my` - My orders
- `GET /api/orders/:id` - Order details
- `PUT /api/orders/:id/status` - Update status
- `PUT /api/orders/:id/cancel` - Cancel order

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/restaurant/:id` - Restaurant reviews
- `PUT /api/reviews/:id/reply` - Vendor reply

### Admin
- `GET /api/admin/dashboard` - Stats overview
- `GET /api/admin/users` - All users
- `GET /api/admin/orders` - All orders
- `GET /api/admin/restaurants` - All restaurants

## Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `order_placed` | Client→Server | Customer places order |
| `new_order` | Server→Vendor | Notify new order |
| `order_confirmed` | Vendor→Server | Vendor confirms |
| `order_status_update` | Server→Customer | Status change notification |
| `order_ready` | Vendor→Server | Order ready for pickup |
| `new_delivery` | Server→Delivery | New delivery available |
| `delivery_accepted` | Delivery→Server | Partner accepted order |
| `delivery_location` | Delivery→Server | Live GPS location |
| `delivery_tracking` | Server→Customer | Location update |

## User Roles

| Role | Capabilities |
|------|-------------|
| Customer | Browse, order, track, review |
| Vendor | Manage restaurant, menu, process orders |
| Delivery | Accept deliveries, track location |
| Admin | Full management of platform |

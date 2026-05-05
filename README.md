# Ecommerce de Ropa - Ricky Riccardi

Proyecto fullstack de ecommerce para venta de ropa online. Incluye backend con API REST y frontend con React.

## Tecnologías

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de datos**: MongoDB con Mongoose
- **Autenticación**: JWT (jsonwebtoken)
- **Seguridad**: bcryptjs para hasheo de contraseñas

### Frontend
- **Framework**: React 19
- **Build**: Vite
- **Estilos**: Tailwind CSS v4
- **Enrutamiento**: React Router v7
- **HTTP**: Axios

## Estructura del Proyecto

```
Ecomerces/
├── backend/
│   ├── config/
│   │   └── db.js              # Conexión a MongoDB
│   ├── controllers/
│   │   ├── userController.js  # Lógica de usuarios
│   │   ├── productController.js # Lógica de productos
│   │   └── orderController.js # Lógica de pedidos
│   ├── middleware/
│   │   └── auth.js           # JWT y verificación admin
│   ├── models/
│   │   ├── User.js           # Esquema de usuario
│   │   ├── Product.js        # Esquema de producto
│   │   └── Order.js         # Esquema de pedido
│   ├── routes/
│   │   ├── userRoutes.js     # Endpoints /api/users
│   │   ├── productRoutes.js # Endpoints /api/products
│   │   └── orderRoutes.js   # Endpoints /api/orders
│   ├── seed.js              # Datos de ejemplo
│   ├── server.js          # Punto de entrada
│   └── .env              # Variables de entorno
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx    # Navegación
    │   │   ├── Footer.jsx    # Pie de página
    │   │   └── ProductCard.jsx # Tarjeta producto
    │   ├── context/
    │   │   ├── AuthContext.jsx # Autenticación global
    │   │   └── CartContext.jsx # Carrito global
    │   ├── pages/
    │   │   ├── Home.jsx          # Inicio
    │   │   ├── Shop.jsx         # Catálogo
    │   │   ├── ProductDetail.jsx # Detalle producto
    │   │   ├── Cart.jsx        # Carrito
    │   │   ├── Checkout.jsx    # Pago
    │   │   ├── Login.jsx       # Inicio sesión
    │   │   ├── Register.jsx    # Registro
    │   │   ├── Orders.jsx      # Historial pedidos
    │   │   └── AdminDashboard.jsx # Panel admin
    │   ├── utils/
    │   │   └── api.js         # Utilidades API
    │   ├── App.jsx           # Componente raíz
    │   ├── main.jsx          # Entry point
    │   └── index.css        # Estilos globales
    ├── vite.config.js       # Config Vite
    └── package.json
```

## Cómo Ejecutar

### Requisitos Previos
- Node.js instalado
- MongoDB corriendo en localhost:27017

### Backend

```bash
cd backend
npm install
npm run dev
```
El servidor corre en http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```
El frontend corre en http://localhost:5173

### Sembrar Base de Datos

```bash
cd backend
node seed.js
```
Crea 7 productos de ejemplo.

## Endpoints de la API

### /api/users
| Método | Path | Descripción | Autenticación |
|-------|------|-------------|--------------|
| POST | /login | Iniciar sesión | No |
| POST | /register | Crear cuenta | No |
| GET | /profile | Ver perfil | JWT |
| GET | / | Listar usuarios | JWT + Admin |
| DELETE | /:id | Eliminar usuario | JWT + Admin |
| PUT | /:id | Actualizar usuario | JWT + Admin |

### /api/products
| Método | Path | Descripción | Autenticación |
|-------|------|-------------|--------------|
| GET | / | Listar productos | No |
| GET | /:id | Ver producto | No |
| GET | /categories | Listar categorías | No |
| POST | / | Crear producto | JWT + Admin |
| PUT | /:id | Actualizar producto | JWT + Admin |
| DELETE | /:id | Eliminar producto | JWT + Admin |

### /api/orders
| Método | Path | Descripción | Autenticación |
|-------|------|-------------|--------------|
| POST | / | Crear pedido | JWT |
| GET | /myorders | Mis pedidos | JWT |
| GET | /:id | Ver pedido | JWT |
| PUT | /:id/pay | Marcar pagado | JWT |
| PUT | /:id/deliver | Marcar entregado | JWT + Admin |

## Modelos de Datos

### User
- name: String (requerido)
- email: String (único, requerido)
- password: String (requerido, hasheado)
- isAdmin: Boolean (default: false)
- createdAt, updatedAt: Date

### Product
- name: String
- description: String
- price: Number
- images: Array[String]
- category: String (enum: camisetas, pantalones, vestidos, faldas, chaquetas, zapatos, accesorios)
- sizes: Array[String]
- colors: Array[String]
- brand: String
- stock: Number
- rating, numReviews: Number

### Order
- user: ObjectId (ref: User)
- orderItems: Array[{ name, qty, image, price, size, color, product }]
- shippingAddress: { address, city, postalCode, country }
- paymentMethod: String (enum: tarjeta, paypal, transferencia)
- paymentResult: Object
- itemsPrice, taxPrice, shippingPrice, totalPrice: Number
- isPaid, isDelivered: Boolean
- paidAt, deliveredAt: Date

## Características

### Frontend
- Navegación con React Router v7
- Carrito persists en localStorage
- Sesión de usuario en localStorage
- Timer de oferta (15 minutos) en ProductDetail
- Paginación enShop
- Filtros por categoría
- Panel de administración para CRUD de productos

### Autenticación
- JWT con expiración de 30 días
- Contraseñas hasheadas con bcrypt
- Rutas protegidas por token
- Rutas solo admin verificadas
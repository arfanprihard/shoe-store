import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import { catRouter, brandRouter } from "./routes/catalog.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import shippingRoutes from "./routes/shipping.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import promoRoutes from "./routes/promo.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/images/products", express.static(path.join(__dirname, "../../../public/images/products")));

// Routes
app.get("/api", (req, res) =>
  res.json({ message: "🏬 StepLuxe API v1.0", status: "running" }),
);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", catRouter);
app.use("/api/brands", brandRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/promos", promoRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`StepLuxe API running on http://localhost:${PORT}`);
  console.log(
    `Routes: /api/auth, /api/products, /api/categories, /api/brands, /api/cart, /api/wishlist, /api/orders, /api/admin, /api/shipping, /api/payment`,
  );
});

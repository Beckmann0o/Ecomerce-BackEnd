import { Router } from "express";

import carritoManager from "../carritoManager.js";

const router = Router();
const manager = new carritoManager();

router.post("/", async (req, res) => {
  try {
    const carritoNuevo = await manager.crearCarrito();
    res.json({ message: "Carrito creado: ", carritoNuevo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const carritoId = await manager.getCarritoById(req.params);
    res.json(carritoId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const result = await manager.addProduct(req.params);
    if (result.error) {
      res.status(500).json({ error: result.error });
    } else {
      res.json({ message: "Producto agregado al carrito" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
//fin

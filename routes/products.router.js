import { Router } from "express";

import ProductManager from "../entregableClase5.js";

const router = Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
  const productsArray = await manager.readFromFile(req.query);

  res.json({ message: "Productos encontrados: ", productsArray });
});

router.get("/:pid", async (req, res) => {
  const productId = await manager.getProductById(req.params);
  res.json({ productId });
});

router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category } = req.body;
    const thumbnails = req.body.thumbnails || [];
    const status = req.body.status || true;
    const newProduct = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    await manager.addProduct(newProduct);
    res
      .status(201)
      .json({ message: "Producto agregado exitosamente", newProduct });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  await manager.updateProduct(req.params, req.body);

  res.status(201).json({ message: "Producto modificado exitosamente" });
});

router.delete("/:pid", async (req, res) => {
  try {
    await manager.deleteProduct(req.params);
    console.log(req.params);
    res.status(200).send("Producto eliminado correctamente");
  } catch (error) {
    res.status(500).send("Error al eliminar el producto");
  }
});

export default router;

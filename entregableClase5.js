import { json } from "express";
import * as fs from "fs";

class ProductManager {
  constructor() {
    this.path = "Productos.json";
    this.autoId = 1;
    this.definirId();
  }

  async definirId() {
    try {
      const productos = await this.readFromFile();
      this.autoId =
        productos.reduce((maxId, product) => Math.max(maxId, product.id), 0) +
        1;
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  async readFromFile(infoQuery) {
    debugger;
    if (fs.existsSync(this.path)) {
      if (infoQuery) {
        const { limit } = infoQuery;
      }

      const productosArchivo = await fs.promises.readFile(this.path, "utf-8");
      const productosJS = JSON.parse(productosArchivo);

      if (limit) {
        return productosJS.slice(0, limit);
      }

      return productosJS;
    } else {
      return [];
    }
  }

  async readFromFile() {
    if (fs.existsSync(this.path)) {
      const productosArchivo = await fs.promises.readFile(this.path, "utf-8");
      const productosJS = JSON.parse(productosArchivo);

      return productosJS;
    } else {
      return [];
    }
  }

  async addProduct(objAdd) {
    try {
      const arrayProducts = await this.readFromFile();

      const existe = arrayProducts.find(
        (product) => product.code === objAdd.code
      );

      if (existe) {
        throw new Error(`Ya existe item con codigo: ${objAdd.code}`);
        return;
      }

      objAdd.id = this.autoId++;
      arrayProducts.push(objAdd);

      await fs.promises.writeFile(this.path, JSON.stringify(arrayProducts));
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  async getProductById({ pid: id }) {
    try {
      const idNumber = Number(id);
      const arrayProducts = await this.readFromFile();
      const productFind = arrayProducts.find(
        ({ id: productId }) => productId === idNumber
      );

      if (!productFind) {
        throw new Error(`No se encuentra el producto con id ${idNumber}`);
      }
      return productFind;
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  async updateProduct(id, objUpdate) {
    try {
      const arrayProducts = await this.readFromFile();
      const modificar = await this.getProductById(id);
      console.log(objUpdate);
      if (modificar) {
        for (const [key] of Object.entries(modificar)) {
          if (objUpdate[key]) modificar[key] = objUpdate[key];
        }

        const index = arrayProducts.findIndex(
          (product) => product.id === modificar.id
        );
        arrayProducts.splice(index, 1, modificar);

        await fs.promises.writeFile(this.path, JSON.stringify(arrayProducts));
      } else {
        throw new Error(`No se encontro el producto con id ${id}`);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  async deleteProduct({ pid: id }) {
    try {
      const arrayProducts = await this.readFromFile();
      console.log(arrayProducts);

      const newArray = arrayProducts.filter((product) => product.id != id);

      await fs.promises.writeFile(this.path, JSON.stringify(newArray));
      return true;
    } catch (error) {
      console.log(`Error: ${error}`);
      return false;
    }
  }
}

export default ProductManager;

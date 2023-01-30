import { json } from "express";
import * as fs from "fs";

class carritoManager {
  constructor() {
    this.path = "carrito.json";
    this.autoId = 1;
    this.arrayCarritos = [];
  }

  async crearCarrito() {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const arrayObj = JSON.parse(data);
    await this.definirId();
    const nuevoCarrito = { id: this.autoId, products: [] };
    arrayObj.push(nuevoCarrito);
    this.setArrayCarritos(arrayObj);
    await this.saveCarritos();
    return nuevoCarrito;
  }

  async readFromFile() {
    if (fs.existsSync(this.path)) {
      const carritoArchivo = await fs.promises.readFile(this.path, "utf-8");
      return carritoArchivo;
    } else {
      return [];
    }
  }

  async saveCarritos() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.arrayCarritos)
      );
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  async definirId() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const arrayObj = JSON.parse(data);
      this.autoId =
        arrayObj.reduce((maxId, objCart) => Math.max(maxId, objCart.id), 0) + 1;
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  //hola
  async addProduct({ cid: carritoId, pid: productId }) {
    try {
      const arrayC = await this.readFromFile();
      const arrayCjs = JSON.parse(arrayC);

      const carritoSeleccionado = arrayCjs.find(
        ({ id }) => id === Number(carritoId)
      );

      console.log(carritoSeleccionado);

      if (!carritoSeleccionado) {
        throw new Error(`No se encuentra el carrito con id ${carritoId}`);
      }

      const productoExistente = carritoSeleccionado.products.find(
        (product) => product.id === productId
      );

      console.log(productoExistente);
      if (productoExistente) {
        productoExistente.quantity += 1;
      } else {
        carritoSeleccionado.products.push({
          id: productId,
          quantity: 1,
        });
      }

      this.setArrayCarritos(arrayCjs);

      await this.saveCarritos();
      if (!carritoSeleccionado) {
        return { error: `No se encuentra el carrito con id ${carritoId}` };
      }

      this.setArrayCarritos(arrayCjs);
      await this.saveCarritos();
      return {};
    } catch (error) {
      console.log(`Error: ${error}`);
      return { error: error.message };
    }
  }

  async getCarritoById({ cid: id }) {
    try {
      const idNumber = Number(id);
      const arrayCarrito = JSON.parse(await this.readFromFile());
      const carritoFind = arrayCarrito.find(
        ({ id: carritoId }) => carritoId === idNumber
      );

      if (!carritoFind) {
        throw new Error(`No se encuentra el carrito con id ${idNumber}`);
      }
      return carritoFind.products;
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  setArrayCarritos(arrayCarritos) {
    this.arrayCarritos = arrayCarritos;
  }
}

export default carritoManager;

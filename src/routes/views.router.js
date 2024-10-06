import express from "express";
import ProductManager from "../managers/product-manager.js";

const router = express.Router();
const manager = new ProductManager("./src/data/productos.json");


router.get("/products", async (req, res) => {
    try {
        const productos = await manager.getProducts();

        res.render("home", { productos });
    }

    catch (error) {
        res.status(500).send("Error interno del servidor")
    }
})



router.get("/realtimeproducts", (req, res) => {
    try {
        res.render("realtimeproducts");
    }

    catch (error) {
        res.status(500).send("Error interno del servidor")
    }
})



export default router;



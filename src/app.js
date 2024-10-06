import express from 'express';
import exphbs from 'express-handlebars';
import { Server as SocketServer } from 'socket.io';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './managers/product-manager.js';

const app = express();
const PUERTO = 8080;
const manager = new ProductManager("./src/data/productos.json");



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));


// Configuración de Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");



// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);


app.get('/', (req, res) => {
    return res.send('Segunda preentrega - Programación Backend I');
})


const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);
})




const io = new SocketServer(httpServer);



io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");

    socket.emit("productos", await manager.getProducts());


    socket.on("addProduct", async (newProduct) => {
        try {

            const productToAdd = {
                title: newProduct.title,
                description: newProduct.description,
                price: newProduct.price,
                img: newProduct.img || "default-image.jpg",
                code: newProduct.code || `CODE${Date.now()}`,
                stock: newProduct.stock || 100,
                category: newProduct.category || "General"
            };

            await manager.addProduct(productToAdd);
            const productosActualizados = await manager.getProducts();
            io.emit("productos", productosActualizados);
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    });


    socket.on("deleteProduct", async (productId) => {
        try {
            const idParsed = parseInt(productId);
            await manager.deleteProduct(idParsed);
            const productosActualizados = await manager.getProducts();
            io.emit("productos", productosActualizados);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    });

});
import { createServer } from "node:http";
import createDebug from "debug";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { NextFunction, Request, Response } from "express";
import { Server } from "node:http";

//------------------CREACIÓN LIBRERÍA DEBUG-------------------//
const debug = createDebug("myapp:index");
debug("Iniciando servidor...");

//-------------------PUERTO DEL SERVIDOR---------------------//
const PORT = 3000;

//------------------------PRODUCTO-------------------------//
//Entidad del producto
type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

let products: Product[] = [];


//--------------------------------------------------------//
//Función para buscar todos los productos
function findAll() {
  debug("Buscando todos los productos");
  return products;
}


//Función para buscar el producto por ID
function findById(id: string) {
  debug("Buscando producto con id: ", id);
  return products.find((product) => product.id === id);
}


//Función para Crear
function create(data: Product) {
  debug("Creando product: ", data);
  data.id = Math.random().toString(36);
  products.push(data);
  return data;
}


//Función para modificar
function modifiById(id: string, data: Product) {
  debug("Borrando product con id: ", id);
  let product = products.find((product) => product.id === id);
  if (product !== undefined) {
    product.name = data.name;
    product.price = data.price;
    product.stock = data.stock;
    product.created_at = data.created_at;
    product.updated_at = data.updated_at;
  }

  return product;
}


//Función para borrar
function deleteById(id: string) {
  debug("Borrando product con id: ", id);
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) {
    return false;
  }
  products.splice(index, 1);
  return true;
}

//--------------------------------------------------------//
//Obtener productos
const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(products);
  } catch (error) {
    next(error);
  }
};

//Obtener productos por Id
const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const product = findById(productId);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

//Crear Producto
const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestData = req.body;
    const product = create(requestData);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Actualizar Producto
const patchProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const requestData = req.body;
    const product = modifiById(productId, requestData);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

//Borrar producto
const deleteProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const product = deleteById(productId);
    res.json(product);
  } catch (error) {
    next(error);
  }
};


//------------------CREACIÓN EXPRESS-------------------//
const app = express();


//---------------------MIDDLEWARE----------------------//
//Middleware para debuggear las peticiones HTTP
const debugLogger = (req: Request, _res: Response, next: NextFunction) => {
  const debug = createDebug("myapp:middlewareDebugLogger");
  debug("Petición HTTP", req.method, req.url);
  next();
};


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(debugLogger);

//---------------------RUTAS----------------------//
app.get("/products", getProducts);
app.get("/products/:id", getProductById);
app.post("/products", createProduct);
app.patch("/products/:id", patchProduct);
app.delete("/products/:id", deleteProductById);


//---------------ARRANQUE DEL SERVIDOR-----------------//
try {
  const server = createServer(app);
  server.listen(PORT);
} catch (err) {
  console.error("Server Error:", err);
  process.exit(1);
}

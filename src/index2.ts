import { createServer } from "node:http";
import createDebug from "debug";
import express from "express";
import bodyParser from "body-parser";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { Server } from "node:http";
import { PrismaClient, Product } from "@prisma/client";

//------------------CREACIÓN LIBRERÍA DEBUG-------------------//
const debug = createDebug("myapp:index");
debug("Iniciando servidor...");

//------------------PUERTO DEL SERVIDOR-------------------//
const PORT = 3000;


//-----------DTO PARA CREAR/REGISTRAR PRODUCTO-----------//
const ProductDTO = z.object({
  name: z.string().nonempty(),
  price: z.number().min(1),
  stock: z.number().min(0),
  is_active: z.boolean(),
});

//Nueva instancia del tipo ProductDTO
type ProductDTO = z.infer<typeof ProductDTO>;


//------------------CAPA REPOSITORIO------------------//
class ProdutRepository {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  //Buscar todos los productos
  findAll = async () => {
    const products = await this.prisma.product.findMany();
    return products;
  };

  //Buscar un producto
  findById = async (id: string) => {
    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    return product;
  };

  //Crear un producto
  create = async (product: Product) => {
    debug("product", product);
    const createdProduct = await this.prisma.product.create({
      data: product,
    });
    debug("createdProduct", createdProduct);
    return createdProduct;
  };

  modifiById = async (id: string, data: Product) => {
    const updatedProduct = await this.prisma.product.update({
      where: {
        id: id,
      },
      data: data,
    });
    return updatedProduct;
  };

  deleteById = async (id: string) => {
    const product = await this.prisma.product.delete({
      where: {
        id: id,
      },
    });
    return product;
  };


}

//Instanciar la clase ProdutRepository
const productRepositoryInstance = new ProdutRepository();


//------------------CAPA CONTROLADORA------------------//
class ProductController {
    //
  getProducts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await productRepositoryInstance.findAll);
    } catch (error) {
      next(error);
    }
  };
  // Método para obtener una película por id
  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id;
      const product = await productRepositoryInstance.findById(productId);
      res.json(product);
    } catch (error) {
      next(error);
    }
  };

  // Método para crear una pelicula
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestData = req.body;
      ProductDTO.parse(requestData);
      const product = await productRepositoryInstance.create(requestData);
      res.json(product);
    } catch (error) {
      next(error);
    }
  };

  // Método para actualizar una película por id
  patchProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id;
      const requestData = req.body;
      ProductDTO.parse(requestData);
      const product = await productRepositoryInstance.modifiById(
        productId,
        requestData,
      );
      res.json(product);
    } catch (error) {
      next(error);
    }
  };

  // Método para eliminar una película por id
  deleteProductById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const productId = req.params.id;
      const product = await productRepositoryInstance.deleteById(productId);
      res.json(product);
    } catch (error) {
      next(error);
    }
  };
}


//Instancia de la Clase ProductController
const productControllerInstance = new ProductController();


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

app.get("/products", productControllerInstance.getProducts);
app.get("/products/:id", productControllerInstance.getProductById);
app.post("/products", productControllerInstance.create);
app.patch('/products/:id', productControllerInstance.patchProduct);
app.delete('/products/:id', productControllerInstance.deleteProductById);



//---------------ARRANQUE DEL SERVIDOR-----------------//

try {
  const server = createServer(app);
  server.listen(PORT);
} catch (err) {
  console.error("Server Error:", err);
  process.exit(1);
}

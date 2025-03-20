# ExamenModulo2

Práctico
Antes de empezar: DESACTIVA COPILOT en VSCode. No puedes utilizarlo en este examen.

Primera parte (6 puntos)
El objetivo del examen es realizar un PROTOTIPO de una API REST que permita realizar operaciones CRUD sobre una entidad Product. Para la implementación de la API se debe utilizar TypeScript, Node y el framework Express.js. Puedes añadir cualquier librería que consideres muy necesaria.

La entidad Product debe tener los siguientes campos:

id (string)
name (string)
price (number)
stock (number)
is_active (boolean)
created_at (datetime)
updated_at (datetime)
La API debe tener los siguientes endpoints:

GET /products: Debe devolver la lista de productos.
GET /products/:id: Debe devolver un producto por su id.
POST /products: Debe crear un producto.
PATCH /products/:id: Debe actualizar un producto por su id.
DELETE /products/:id: Debe eliminar un producto por su id.
Los datos se almacenarán en memoria, no es necesario utilizar una base de datos. Para que existan datos inicialmente se utilizada un mock de productos, almacenado en un fichero TS.

Todo el código debe estar en un solo fichero, excepto el mock de productos que puede estar en otro fichero. Hazlo lo mas compacto posible, sin crear ninguna capa innecesaria

Documenta el código EXHAUSTIVAMENTE con comentarios explicativos, indicando la funcionalidad de todo lo que haces. No lo consideres como algo opcional, es obligatorio documentar cada parte del código. No se trata de los comentarios que harías en un código real, sino de explicar cada paso que haces. y demostrar los conocimientos teóricos y prácticos adquiridos en el curso.

Dentro de tu repositorio de GitHub, crea una carpeta llamada prototipo y dentro de ella crea un fichero llamado server1.ts con el código de la API.

Comprueba que la API funciona correctamente utilizando Postman. Crea en Postman una colección con los endpoints de la API y realiza pruebas de cada uno de ellos. Exporta la colección de Postman y guárdala en la carpeta prototipo con el nombre postman.json.

Criterios de evaluación (1)
Funcionamiento correcto de la API: 2 puntos.
Estructura del código: 1 punto.
Documentación exhaustiva del código: 2 puntos.
Pruebas en Postman: 1 punto.
Segunda parte (4 puntos)
SOLO si has terminado la primera parte, incluida la documentación exhaustiva realiza la segunda parte.

El objetivo de la segunda parte es añadir una arquitectura en capas a la API y persistencia en una DB.

Utiliza un patrón de diseño MVC para la estructura del proyecto.
Añade una capa de servicios que se encargue de la lógica de negocio.
Añade una capa de repositorios que se encargue de la persistencia en una base de datos.
Después de añadir la arquitectura en capas, añade una base de datos SQLite a la API. Utiliza PRISMA para la conexión con la base de datos. Puedes utilizar Zod para la validación de los datos.

Criterios de evaluación (2)
Estructura del código: 2 punto.
Acceso a la base de datos: 1 puntos.
Funcionamiento correcto de la API: 1 puntos.
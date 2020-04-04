# TAREA 6 - CONTENEDORES (1/2)
#### **Esteban David Alvarez Bor - 201313872**


La tarea #6 del laboratorio de Software Avanzado consistio en el desarrollo de un servidor utilizando NodeJS y MongoDB dicha aplicacion cuenta con un servicio principal en la ruta **__/getall__** la cual consulta la base de datos y luego despliega los resultados obtenidos en formato JSON.


## Servicio
El servicio Obtener Usuarios se encarga de consultar la base de datos y luego obtener todos los usuarios disponibles y desplegarlos en la get **__/getall__**. Utiliza una funcion asincrona para consultar a la base de datos mediante el modelo **Usuario**.

```js
/**
 * GET ROUTE
 */
app.get('/getall', function(req, res) {

    const all = getAll().then(u => {        
        res.json(u)
    }).catch(er => {
        console.log(er);
    });

});
/**
 * ASYNC FUNCTION TO GET ALL DOCUMENTS IN USUARIOS COLLECTION
 */
async function getAll() {
    let usrs = await Usuario.find();
    return usrs;

}
```
## Contenedores

### docker-compose

El archivo docker compose sera utilizado para ejecutar la aplicacion utilizando los multiples contenedores necesarios para el funcionamiento de nuestro servidor.

```yml
version: '2'
services: 
    mongo:
        image: mongo
        container_name: mongo   
        ports: 
            - '27017:27017'

    mongo-seed:
        build: ./dbseed     
        links: 
        - mongo    
                            
    node: 
        container_name: node
        restart: always
        build: .
        ports:
            - '80:3000'
        links:
            - mongo
```

En este archivo se definen 3 servicios, **mongo** el cual utilizara como imagen mongo en su version mas reciente. El nombre que tomara el contenedor sera **__mongo_** y realizaremos un mapeo del servicio en el puerto **27017**.

 El servicio **mongo-seed** sera encargado de ejecutar el Dockerfile ubicado en la carpeta dbseed para poblar la base de datos.

 ```Dockerfile
 FROM mongo

COPY init.json /init.json

CMD mongoimport --host mongo --db usuarios --collection usuarios --type json --file /init.json --jsonArray
 ``` 

El Dockerfile copiara el archivo init.json en la raiz del servidor de la base de datos para luego ejecutar el comando __mongoimport__ utilizando la base de datos **usuarios**. Los datos se encuentran definidos en un array tipo JSON.

El ultimo servicio definido en el docker-compose tiene el nombre **node** y este es encargado de crear el contenedor con NodeJs en el cual correra nuestra aplicacion de consulta. El nombre para el contenedor es **__node__**, ademas debera buscar en la raiz el Dockerfile dedicado para la configuracion de la aplicacion de NodeJS. Tambien mapearemos el puerto **3000** definido en el Dockerfile al puerto **80** local para poder acceder.

```Dockerfile
FROM node:12.16-alpine

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
```

El Dockerfile definine el uso de NodeJS en su version __12.16-alpine__ definiendo el directorio de trabajo en la raiz. Se copiaran los archivos de configuracion del package*json para luego ejecutrar el comando **npm install**. Se copiara todo el contenido de la carpeta Tarea6 y expondremos el puerto **3000**. Por ultimo ejecutaremos el comando **__star_** definido en el package.json el cual arrancara el servidor.

```json
    "scripts": {
        "start": "node server/server.js",
        //CODE
    },
```


## Iniciar los Contenedores

1. Nos ubicaremos en la carpeta de la tarea (TARA6) y ejecutaremos el comando:
```cmd
docker-compose up --build
```
Este comando se encargara de construir y levantar los contenedores definidos.
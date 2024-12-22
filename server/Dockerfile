# Especifica la imagen base
FROM node:14

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo package.json al contenedor
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Expone el puerto que usará la aplicación
EXPOSE 5000

# Define el comando para correr la aplicación
CMD [ "node", "index.js" ]

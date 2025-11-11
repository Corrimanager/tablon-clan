# Imagen base de Node
FROM node:18

# Crear carpeta de la app
WORKDIR /app

# Copiar los archivos del proyecto
COPY package*.json ./
COPY backend ./backend

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]

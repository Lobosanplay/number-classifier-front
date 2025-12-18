# 🎨 Number Classifier - MNIST Digit Recognition

Aplicación web interactiva para dibujar y clasificar dígitos numéricos utilizando un modelo de reconocimiento de dígitos MNIST.

## ✨ Características

- 🖌️ **Interfaz de dibujo intuitiva**: Cuadrícula 28x28 para dibujar dígitos
- 🧹 **Herramientas de edición**: Pintar y borrar con clic izquierdo/derecho
- 🤖 **Clasificación en tiempo real**: Envío al backend para predicción
- 🎯 **Feedback visual claro**: Muestra el número reconocido
- ⚡ **Indicadores de carga**: Spinner durante la clasificación
- ❓ **Panel de ayuda**: Instrucciones interactivas

## 🛠️ Tecnologías Utilizadas

- **React** con TypeScript
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **Fetch API** para comunicación con backend

## 📁 Estructura del Proyecto

```
src/
├── App.tsx           # Componente principal
├── App.css          # Estilos globales
├── main.tsx         # Punto de entrada
├── index.css        # Configuración de Tailwind
└── assets/
    └── react.svg    # Assets estáticos
```

## 🚀 Cómo Ejecutar el Proyecto

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd number-classifier-front
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:5173
```

## 🔗 Backend

⚠️ **Importante**: Este proyecto requiere el backend para funcionar correctamente.

El backend está disponible en un repositorio separado:
👉 [number-classifier-back](https://github.com/Lobosanplay/number-classifier-back)

### Requisitos del Backend:
- Servidor corriendo en `http://localhost:8000`
- Endpoint `/` que acepta POST requests con datos de imagen
- Modelo MNIST entrenado para clasificación de dígitos

## 🎮 Cómo Usar

### Dibujar un Número:
1. **Pintar**: Haz clic izquierdo y arrastra sobre la cuadrícula
2. **Borrar**: Usa clic derecho o mantén Ctrl/Shift mientras pintas
3. **Enviar**: Presiona el botón "ENVIAR" para clasificar
4. **Limpiar**: Usa "LIMPIAR" para reiniciar el canvas

### Controles Alternativos:
- **Click normal**: Activa píxeles
- **Click derecho/Shift/Ctrl**: Desactiva píxeles
- **Arrastrar**: Dibujar líneas continuas

## 🎯 Especificaciones Técnicas

- **Resolución de entrada**: 28x28 píxeles (estándar MNIST)
- **Valores de píxel**: 0 (negro) a 255 (blanco)
- **Formato de datos**: Array lineal de 784 valores
- **Comunicación**: JSON sobre HTTP POST

## 🧪 Ejemplo de Request

```json
{
  "numbers": [0, 0, 255, 0, ..., 0, 255, 0]
}
```

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

- El componente `Node` representa cada píxel en la cuadrícula
- El estado `isNodeActive` almacena valores de 0 a 255
- La animación de dibujo se maneja con eventos de mouse
- El diseño es completamente responsive

## 🐛 Solución de Problemas

### "Error de conexión con el backend"
- Verifica que el backend esté corriendo en `localhost:8000`
- Asegúrate de haber clonado el repositorio del backend

### "No puedo dibujar"
- Verifica que no tengas bloqueadores de scripts
- Intenta recargar la página
- Asegúrate de usar clic izquierdo para pintar

### "El resultado no es preciso"
- Dibuja el número centrado en la cuadrícula
- Usa trazos claros y definidos
- Evita dibujos demasiado pequeños o grandes

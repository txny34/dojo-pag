# 🗺️ Mapa Gratuito - OpenStreetMap

## **✅ Solución Implementada: OpenStreetMap**

Tu página web del dojo ahora usa **OpenStreetMap**, que es **completamente gratuito** y no requiere API keys.

### **Características del mapa implementado:**

- ✅ **100% Gratuito** - Sin costos ocultos
- ✅ **Sin API Keys** - No necesitas registrarte en ningún servicio
- ✅ **Mapa Interactivo** - Zoom, navegación y marcadores
- ✅ **Diseño Responsivo** - Funciona en móviles y desktop
- ✅ **Estilo Consistente** - Combina con tu diseño del dojo
- ✅ **Botón de Direcciones** - Enlace directo a OpenStreetMap

## **📍 Cómo personalizar las coordenadas:**

En el archivo `app/page.tsx`, actualiza las coordenadas:

```tsx
<StaticMap
  center={{ lat: 40.7128, lng: -74.0060 }} // Cambia estas coordenadas
  zoom={15}
  className="w-full"
  title="Fighting Spirit Dojo"
  address="123 Calle Guerrero, Distrito Dojo, Ciudad 12345"
/>
```

### **Para obtener las coordenadas de tu dojo:**

1. Ve a [OpenStreetMap](https://www.openstreetmap.org/)
2. Busca la dirección de tu dojo
3. Haz clic derecho en el marcador
4. Selecciona "Mostrar dirección"
5. Copia las coordenadas (lat, lng)

## **🚀 Ventajas de OpenStreetMap:**

### **✅ Ventajas:**
- **Completamente gratuito** para siempre
- **Sin límites** de uso
- **Datos actualizados** por la comunidad
- **Sin registro** requerido
- **Código abierto** y transparente
- **Sin costos** ocultos

### **⚠️ Limitaciones:**
- **Menos detalle** en algunas áreas
- **Menos funcionalidades** avanzadas
- **Depende de la comunidad** para actualizaciones

## **🎨 Personalización del Mapa:**

Puedes personalizar el mapa editando `components/StaticMap.tsx`:

### **Cambiar el estilo del marcador:**
```tsx
// Cambiar el color del marcador
<div className="w-3 h-3 bg-red-400 rounded-full"></div>
```

### **Cambiar la información del marcador:**
```tsx
title="Tu Dojo"
address="Tu dirección real"
```

### **Cambiar el zoom:**
```tsx
zoom={12} // Número más bajo = más zoom
```

## **📱 Funcionalidades Incluidas:**

- ✅ **Mapa interactivo** con zoom y navegación
- ✅ **Marcador personalizado** para tu dojo
- ✅ **Información del dojo** debajo del mapa
- ✅ **Botón de direcciones** que abre OpenStreetMap
- ✅ **Diseño responsivo** para todos los dispositivos
- ✅ **Carga rápida** sin dependencias externas

## **🔧 Solución de Problemas:**

### **El mapa no se carga:**
- Verifica que las coordenadas sean válidas
- Asegúrate de que tengas conexión a internet
- Revisa la consola del navegador para errores

### **Las coordenadas no son exactas:**
- Usa OpenStreetMap para obtener coordenadas precisas
- O usa Google Maps y transfiere las coordenadas

### **El mapa se ve diferente:**
- OpenStreetMap tiene un estilo diferente a Google Maps
- Es normal y funciona perfectamente para mostrar ubicaciones

## **🎯 Próximos Pasos:**

1. **Actualiza las coordenadas** con la ubicación real de tu dojo
2. **Personaliza la información** del marcador
3. **Prueba el mapa** en diferentes dispositivos
4. **Verifica que funcione** correctamente

## **💡 Recomendación:**

**OpenStreetMap es perfecto** para sitios web de dojos porque:
- Es completamente gratuito
- Funciona perfectamente para mostrar ubicaciones
- No requiere configuración compleja
- Es confiable y estable
- No tiene costos ocultos

¡Tu mapa ya está funcionando y es completamente gratuito! 🎉 
class ProductoService {
    constructor() {
        this.apiService = apiService;
    }

    async getProductos() {
        try {
            return await this.apiService.getProductos();
        } catch (error) {
            console.error('Error obteniendo productos:', error);
            throw error;
        }
    }

    async getProductosDisponibles() {
        try {
            return await this.apiService.getProductosDisponibles();
        } catch (error) {
            console.error('Error obteniendo productos disponibles:', error);
            throw error;
        }
    }

    async getProductoPorId(id) {
        try {
            const productos = await this.getProductos();
            return productos.find(producto => producto.idProducto === id);
        } catch (error) {
            console.error('Error obteniendo producto por ID:', error);
            throw error;
        }
    }

    async getProductosPorCategoria(idCategoria) {
        try {
            const productos = await this.getProductos();
            return productos.filter(producto => producto.categoria.idCategoria === idCategoria);
        } catch (error) {
            console.error('Error obteniendo productos por categoría:', error);
            throw error;
        }
    }

    async buscarProductos(nombre) {
        try {
            const productos = await this.getProductos();
            return productos.filter(producto => 
                producto.nombreProducto.toLowerCase().includes(nombre.toLowerCase())
            );
        } catch (error) {
            console.error('Error buscando productos:', error);
            throw error;
        }
    }

    async getProductosPorTipo(tipo) {
        try {
            const productos = await this.getProductos();
            return productos.filter(producto => producto.categoria.tipo === tipo);
        } catch (error) {
            console.error('Error obteniendo productos por tipo:', error);
            throw error;
        }
    }

    async getEstadisticasProductos() {
        try {
            const productos = await this.getProductos();
            const disponibles = productos.filter(p => p.disponible).length;
            const noDisponibles = productos.filter(p => !p.disponible).length;
            
            const precioPromedio = productos.length > 0 ? 
                productos.reduce((sum, p) => sum + p.precio, 0) / productos.length : 0;

            const productosPorCategoria = {};
            productos.forEach(producto => {
                const categoria = producto.categoria.nombreCategoria;
                if (!productosPorCategoria[categoria]) {
                    productosPorCategoria[categoria] = 0;
                }
                productosPorCategoria[categoria]++;
            });

            return {
                total: productos.length,
                disponibles,
                noDisponibles,
                precioPromedio: Math.round(precioPromedio),
                productosPorCategoria
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas de productos:', error);
            throw error;
        }
    }

    async getProductosMasVendidos() {
        try {
            // En una implementación real, esto vendría del backend
            // Por ahora simulamos datos
            return [
                { nombre: 'Chuleta Valluna', ventas: 45 },
                { nombre: 'Sancocho de Gallina', ventas: 38 },
                { nombre: 'Jugo de Naranja', ventas: 32 },
                { nombre: 'Hamburguesa Clásica', ventas: 28 },
                { nombre: 'Postre de Tres Leches', ventas: 25 }
            ];
        } catch (error) {
            console.error('Error obteniendo productos más vendidos:', error);
            throw error;
        }
    }

    async crearProducto(productoData) {
        try {
            // Simular creación de producto
            console.log('Creando producto:', productoData);
            
            // En una implementación real, haríamos:
            // return await this.apiService.crearProducto(productoData);
            
            // Por ahora retornamos un objeto simulado
            return {
                ...productoData,
                idProducto: Date.now(),
                fechaCreacion: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error creando producto:', error);
            throw error;
        }
    }

    async actualizarProducto(id, productoData) {
        try {
            console.log('Actualizando producto:', id, productoData);
            
            // Simulación de actualización
            return {
                ...productoData,
                idProducto: id
            };
        } catch (error) {
            console.error('Error actualizando producto:', error);
            throw error;
        }
    }

    async eliminarProducto(id) {
        try {
            console.log('Eliminando producto:', id);
            // Simulación de eliminación
            return { success: true, message: 'Producto eliminado correctamente' };
        } catch (error) {
            console.error('Error eliminando producto:', error);
            throw error;
        }
    }

    async validarProducto(productoData) {
        const errors = [];

        if (!productoData.nombreProducto || productoData.nombreProducto.trim() === '') {
            errors.push('El nombre del producto es requerido');
        }

        if (!productoData.precio || productoData.precio <= 0) {
            errors.push('El precio debe ser mayor a 0');
        }

        if (!productoData.idCategoria) {
            errors.push('Debe seleccionar una categoría');
        }

        if (productoData.stock !== undefined && productoData.stock < 0) {
            errors.push('El stock no puede ser negativo');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    async formatearPrecio(precio) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(precio);
    }

    async getCategorias() {
        try {
            // Simular obtención de categorías
            return [
                { idCategoria: 1, nombreCategoria: 'Platos Fuertes', tipo: 'comida' },
                { idCategoria: 2, nombreCategoria: 'Bebidas', tipo: 'bebida' },
                { idCategoria: 3, nombreCategoria: 'Postres', tipo: 'comida' },
                { idCategoria: 4, nombreCategoria: 'Entradas', tipo: 'comida' }
            ];
        } catch (error) {
            console.error('Error obteniendo categorías:', error);
            throw error;
        }
    }
}

const productoService = new ProductoService();
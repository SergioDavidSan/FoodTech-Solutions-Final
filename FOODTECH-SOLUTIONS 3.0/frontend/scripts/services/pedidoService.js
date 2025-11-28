class PedidoService {
    constructor() {
        this.apiService = apiService;
        this.authService = authService;
    }

    /**
     * CREAR NUEVO PEDIDO
     */
    async crearPedido(pedidoData) {
        try {
            // Validar pedido antes de enviar
            const validacion = await this.validarPedido(pedidoData);
            if (!validacion.isValid) {
                throw new Error(validacion.errors.join(', '));
            }

            // Preparar datos para backend
            const pedidoParaBackend = {
                id_mesa: parseInt(pedidoData.idMesa),
                id_usuario: this.authService.getUserId(),
                detalles: pedidoData.detalles.map(detalle => ({
                    id_producto: parseInt(detalle.idProducto),
                    cantidad: parseInt(detalle.cantidad),
                    precio_unitario: parseFloat(detalle.precioUnitario),
                    subtotal: parseFloat(detalle.subtotal),
                    notas: detalle.notas || ''
                })),
                total: parseFloat(pedidoData.total),
                notas: pedidoData.notas || ''
            };

            console.log('📤 Enviando pedido al backend:', pedidoParaBackend);
            
            const resultado = await this.apiService.crearPedido(pedidoParaBackend);
            
            console.log('✅ Pedido creado exitosamente:', resultado);
            return resultado;
            
        } catch (error) {
            console.error('❌ Error creando pedido:', error);
            throw new Error(`Error al crear pedido: ${error.message}`);
        }
    }

    /**
     * OBTENER PEDIDOS ACTIVOS
     */
    async getPedidosActivos() {
        try {
            const pedidos = await this.apiService.getPedidosActivos();
            console.log(`📋 Obtenidos ${pedidos.length} pedidos activos`);
            return pedidos;
        } catch (error) {
            console.error('❌ Error obteniendo pedidos activos:', error);
            throw new Error('No se pudieron cargar los pedidos activos');
        }
    }

    /**
     * OBTENER PEDIDO POR ID
     */
    async getPedidoPorId(id) {
        try {
            const pedidos = await this.apiService.getPedidos();
            const pedido = pedidos.find(p => p.id_pedido === parseInt(id));
            
            if (!pedido) {
                throw new Error(`Pedido #${id} no encontrado`);
            }
            
            return pedido;
        } catch (error) {
            console.error(`❌ Error obteniendo pedido #${id}:`, error);
            throw error;
        }
    }

    /**
     * ACTUALIZAR ESTADO DE PEDIDO
     */
    async updatePedidoEstado(id, estado) {
        try {
            const estadoBackend = this.mapearEstadoFrontendABackend(estado);
            console.log(`🔄 Actualizando pedido #${id} a estado: ${estadoBackend}`);
            
            const resultado = await this.apiService.updatePedidoEstado(id, estadoBackend);
            
            console.log(`✅ Estado del pedido #${id} actualizado a: ${estadoBackend}`);
            return resultado;
            
        } catch (error) {
            console.error(`❌ Error actualizando estado del pedido #${id}:`, error);
            throw new Error(`Error al actualizar estado: ${error.message}`);
        }
    }

    /**
     * CANCELAR PEDIDO
     */
    async cancelarPedido(id, motivo = '') {
        try {
            console.log(`❌ Cancelando pedido #${id}`, motivo ? `Motivo: ${motivo}` : '');
            return await this.updatePedidoEstado(id, 'cancelado');
        } catch (error) {
            console.error(`❌ Error cancelando pedido #${id}:`, error);
            throw error;
        }
    }

    /**
     * MARCAR PEDIDO COMO LISTO
     */
    async marcarPedidoListo(id) {
        try {
            console.log(`✅ Marcando pedido #${id} como listo`);
            return await this.updatePedidoEstado(id, 'listo');
        } catch (error) {
            console.error(`❌ Error marcando pedido #${id} como listo:`, error);
            throw error;
        }
    }

    /**
     * MARCAR PEDIDO COMO ENTREGADO
     */
    async marcarPedidoEntregado(id) {
        try {
            console.log(`📦 Marcando pedido #${id} como entregado`);
            return await this.updatePedidoEstado(id, 'entregado');
        } catch (error) {
            console.error(`❌ Error marcando pedido #${id} como entregado:`, error);
            throw error;
        }
    }

    /**
     * OBTENER PEDIDOS POR MESA
     */
    async getPedidosPorMesa(idMesa) {
        try {
            const pedidos = await this.apiService.getPedidos();
            const pedidosMesa = pedidos.filter(pedido => 
                pedido.id_mesa === parseInt(idMesa)
            );
            
            console.log(`🍽️ Obtenidos ${pedidosMesa.length} pedidos para mesa ${idMesa}`);
            return pedidosMesa;
        } catch (error) {
            console.error(`❌ Error obteniendo pedidos para mesa ${idMesa}:`, error);
            throw error;
        }
    }

    /**
     * OBTENER PEDIDOS POR ESTADO
     */
    async getPedidosPorEstado(estado) {
        try {
            const pedidos = await this.apiService.getPedidos();
            const estadoFrontend = this.mapearEstadoBackendAFrontend(estado);
            const pedidosFiltrados = pedidos.filter(pedido => 
                pedido.estado === estadoFrontend
            );
            
            console.log(`📊 Obtenidos ${pedidosFiltrados.length} pedidos en estado: ${estado}`);
            return pedidosFiltrados;
        } catch (error) {
            console.error(`❌ Error obteniendo pedidos por estado ${estado}:`, error);
            throw error;
        }
    }

    /**
     * OBTENER PEDIDOS DEL DÍA ACTUAL
     */
    async getPedidosDelDia() {
        try {
            const pedidos = await this.apiService.getPedidos();
            const hoy = new Date().toDateString();
            
            const pedidosHoy = pedidos.filter(pedido => {
                const fechaPedido = new Date(pedido.fecha_pedido || pedido.fecha_creacion).toDateString();
                return fechaPedido === hoy;
            });
            
            console.log(`📅 Obtenidos ${pedidosHoy.length} pedidos del día de hoy`);
            return pedidosHoy;
        } catch (error) {
            console.error('❌ Error obteniendo pedidos del día:', error);
            throw error;
        }
    }

    /**
     * MAPEO DE ESTADOS: Frontend → Backend
     */
    mapearEstadoFrontendABackend(estadoFrontend) {
        const mapeo = {
            'pendiente': 'PENDIENTE',
            'confirmado': 'CONFIRMADO',
            'preparacion': 'EN_PREPARACION',
            'listo': 'LISTO',
            'entregado': 'ENTREGADO',
            'cancelado': 'CANCELADO',
            'pagado': 'PAGADO'
        };
        
        const estado = mapeo[estadoFrontend.toLowerCase()] || estadoFrontend.toUpperCase();
        console.log(`🔄 Mapeando estado: ${estadoFrontend} → ${estado}`);
        return estado;
    }

    /**
     * MAPEO DE ESTADOS: Backend → Frontend
     */
    mapearEstadoBackendAFrontend(estadoBackend) {
        const mapeo = {
            'PENDIENTE': 'pendiente',
            'CONFIRMADO': 'confirmado',
            'EN_PREPARACION': 'preparacion',
            'LISTO': 'listo',
            'ENTREGADO': 'entregado',
            'CANCELADO': 'cancelado',
            'PAGADO': 'pagado'
        };
        
        const estado = mapeo[estadoBackend] || estadoBackend.toLowerCase();
        console.log(`🔄 Mapeando estado: ${estadoBackend} → ${estado}`);
        return estado;
    }

    /**
     * CALCULAR TOTAL DEL PEDIDO
     */
    calcularTotalPedido(items) {
        const total = items.reduce((sum, item) => {
            const precio = parseFloat(item.precio) || parseFloat(item.precioUnitario) || 0;
            const cantidad = parseInt(item.cantidad) || 0;
            return sum + (precio * cantidad);
        }, 0);
        
        console.log(`💰 Total calculado: $${total.toFixed(2)}`);
        return total;
    }

    /**
     * VALIDAR DATOS DEL PEDIDO
     */
    async validarPedido(pedidoData) {
        const errors = [];

        // Validar mesa
        if (!pedidoData.idMesa || isNaN(parseInt(pedidoData.idMesa))) {
            errors.push('Debe seleccionar una mesa válida');
        }

        // Validar detalles
        if (!pedidoData.detalles || !Array.isArray(pedidoData.detalles) || pedidoData.detalles.length === 0) {
            errors.push('El pedido debe tener al menos un producto');
        } else {
            // Validar cada detalle
            pedidoData.detalles.forEach((detalle, index) => {
                if (!detalle.idProducto || isNaN(parseInt(detalle.idProducto))) {
                    errors.push(`Producto #${index + 1}: ID de producto inválido`);
                }
                
                if (!detalle.cantidad || isNaN(parseInt(detalle.cantidad)) || parseInt(detalle.cantidad) <= 0) {
                    errors.push(`Producto #${index + 1}: Cantidad debe ser mayor a 0`);
                }
                
                const precio = parseFloat(detalle.precioUnitario) || parseFloat(detalle.precio) || 0;
                if (precio <= 0) {
                    errors.push(`Producto #${index + 1}: Precio debe ser mayor a 0`);
                }
            });
        }

        // Validar total
        const totalCalculado = this.calcularTotalPedido(pedidoData.detalles);
        const totalEnviado = parseFloat(pedidoData.total) || 0;
        
        if (Math.abs(totalCalculado - totalEnviado) > 0.01) {
            errors.push(`El total calculado ($${totalCalculado.toFixed(2)}) no coincide con el enviado ($${totalEnviado.toFixed(2)})`);
        }

        console.log(`🔍 Validación de pedido: ${errors.length} errores encontrados`, errors);
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * OBTENER ESTADÍSTICAS DE PEDIDOS
     */
    async getEstadisticasPedidos() {
        try {
            const pedidos = await this.apiService.getPedidos();
            const pedidosHoy = await this.getPedidosDelDia();
            
            const estadisticas = {
                total: pedidos.length,
                hoy: pedidosHoy.length,
                pendientes: pedidos.filter(p => p.estado === 'pendiente').length,
                preparacion: pedidos.filter(p => p.estado === 'preparacion').length,
                listos: pedidos.filter(p => p.estado === 'listo').length,
                entregados: pedidos.filter(p => p.estado === 'entregado').length,
                cancelados: pedidos.filter(p => p.estado === 'cancelado').length,
                ingresosHoy: pedidosHoy.reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0)
            };
            
            console.log('📈 Estadísticas de pedidos:', estadisticas);
            return estadisticas;
            
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            throw error;
        }
    }

    /**
     * OBTENER PRODUCTOS MÁS VENDIDOS
     */
    async getProductosMasVendidos(limite = 5) {
        try {
            const pedidos = await this.apiService.getPedidos();
            const productosMap = new Map();
            
            pedidos.forEach(pedido => {
                pedido.detalles?.forEach(detalle => {
                    const idProducto = detalle.id_producto;
                    const cantidad = parseInt(detalle.cantidad) || 0;
                    
                    if (productosMap.has(idProducto)) {
                        productosMap.set(idProducto, productosMap.get(idProducto) + cantidad);
                    } else {
                        productosMap.set(idProducto, cantidad);
                    }
                });
            });
            
            // Convertir a array y ordenar
            const productosMasVendidos = Array.from(productosMap.entries())
                .map(([id, cantidad]) => ({ id_producto: id, cantidad_vendida: cantidad }))
                .sort((a, b) => b.cantidad_vendida - a.cantidad_vendida)
                .slice(0, limite);
            
            console.log(`🏆 Top ${limite} productos más vendidos:`, productosMasVendidos);
            return productosMasVendidos;
            
        } catch (error) {
            console.error('❌ Error obteniendo productos más vendidos:', error);
            throw error;
        }
    }
}

// Crear instancia global
const pedidoService = new PedidoService();
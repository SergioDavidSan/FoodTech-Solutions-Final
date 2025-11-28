class FacturaService {
    constructor() {
        this.apiService = apiService;
    }

    async generarFactura(facturaData) {
        try {
            return await this.apiService.generarFactura(facturaData.idPedido, facturaData);
        } catch (error) {
            console.error('Error generando factura:', error);
            throw error;
        }
    }

    async getFacturas() {
        try {
            return await this.apiService.getFacturas();
        } catch (error) {
            console.error('Error obteniendo facturas:', error);
            throw error;
        }
    }

    async getFacturaPorId(id) {
        try {
            const facturas = await this.getFacturas();
            return facturas.find(factura => factura.idFactura === id);
        } catch (error) {
            console.error('Error obteniendo factura por ID:', error);
            throw error;
        }
    }

    async getFacturasPorFecha(fechaInicio, fechaFin) {
        try {
            const facturas = await this.getFacturas();
            return facturas.filter(factura => {
                const fechaFactura = new Date(factura.fechaEmision);
                return fechaFactura >= fechaInicio && fechaFactura <= fechaFin;
            });
        } catch (error) {
            console.error('Error obteniendo facturas por fecha:', error);
            throw error;
        }
    }

    async getEstadisticasFacturacion() {
        try {
            const facturas = await this.getFacturas();
            const hoy = new Date().toDateString();
            
            const facturasHoy = facturas.filter(factura => 
                new Date(factura.fechaEmision).toDateString() === hoy
            );

            const totalHoy = facturasHoy.reduce((sum, factura) => sum + factura.total, 0);
            const totalGeneral = facturas.reduce((sum, factura) => sum + factura.total, 0);

            return {
                totalFacturas: facturas.length,
                facturasHoy: facturasHoy.length,
                totalHoy: totalHoy,
                totalGeneral: totalGeneral,
                promedioFactura: facturas.length > 0 ? totalGeneral / facturas.length : 0
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas de facturación:', error);
            throw error;
        }
    }

    async calcularTotales(items, descuento = 0) {
        const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const impuestos = subtotal * 0.08; // 8% IVA
        const totalDescuento = subtotal * (descuento / 100);
        const total = subtotal + impuestos - totalDescuento;

        return {
            subtotal,
            impuestos,
            descuento: totalDescuento,
            total
        };
    }

    async generarNumeroFactura() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `FACT-${timestamp}-${random}`;
    }

    async validarFactura(facturaData) {
        const errors = [];

        if (!facturaData.idPedido) {
            errors.push('Debe seleccionar un pedido');
        }

        if (!facturaData.metodoPago) {
            errors.push('Debe seleccionar un método de pago');
        }

        if (facturaData.metodoPago === 'efectivo' && (!facturaData.efectivoRecibido || facturaData.efectivoRecibido < facturaData.total)) {
            errors.push('El efectivo recibido debe ser mayor o igual al total');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    async imprimirFactura(facturaData) {
        // Simular impresión de factura
        const ventanaImpresion = window.open('', '_blank');
        const contenido = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Factura ${facturaData.numeroFactura}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
                    .details { margin: 20px 0; }
                    .total { font-weight: bold; font-size: 1.2em; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>FOODTECH SOLUTIONS</h1>
                    <h2>FACTURA ${facturaData.numeroFactura}</h2>
                </div>
                <div class="details">
                    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Método de Pago:</strong> ${facturaData.metodoPago}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${facturaData.items.map(item => `
                            <tr>
                                <td>${item.nombre}</td>
                                <td>${item.cantidad}</td>
                                <td>$${item.precio.toLocaleString()}</td>
                                <td>$${(item.precio * item.cantidad).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="total">
                    <p>TOTAL: $${facturaData.total.toLocaleString()}</p>
                </div>
            </body>
            </html>
        `;
        
        ventanaImpresion.document.write(contenido);
        ventanaImpresion.print();
        ventanaImpresion.close();
    }
}

const facturaService = new FacturaService();
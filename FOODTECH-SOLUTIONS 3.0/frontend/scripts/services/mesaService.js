class MesaService {
    constructor() {
        this.apiService = apiService;
    }

    async getMesas() {
        try {
            return await this.apiService.getMesas();
        } catch (error) {
            console.error('Error obteniendo mesas:', error);
            throw error;
        }
    }

    async getMesasDisponibles() {
        try {
            const mesas = await this.apiService.getMesas();
            return mesas.filter(mesa => mesa.estado === 'disponible');
        } catch (error) {
            console.error('Error obteniendo mesas disponibles:', error);
            throw error;
        }
    }

    async getMesaPorId(id) {
        try {
            const mesas = await this.getMesas();
            return mesas.find(mesa => mesa.idMesa === id);
        } catch (error) {
            console.error('Error obteniendo mesa por ID:', error);
            throw error;
        }
    }

    async updateMesaEstado(id, estado) {
        try {
            return await this.apiService.updateMesaEstado(id, estado);
        } catch (error) {
            console.error('Error actualizando estado de mesa:', error);
            throw error;
        }
    }

    async ocuparMesa(id) {
        return this.updateMesaEstado(id, 'ocupada');
    }

    async liberarMesa(id) {
        return this.updateMesaEstado(id, 'disponible');
    }

    async getEstadisticasMesas() {
        try {
            const mesas = await this.getMesas();
            const total = mesas.length;
            const disponibles = mesas.filter(m => m.estado === 'disponible').length;
            const ocupadas = mesas.filter(m => m.estado === 'ocupada').length;
            
            return {
                total,
                disponibles,
                ocupadas,
                porcentajeOcupacion: total > 0 ? Math.round((ocupadas / total) * 100) : 0
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas de mesas:', error);
            throw error;
        }
    }

    async getMesasPorUbicacion() {
        try {
            const mesas = await this.getMesas();
            const porUbicacion = {};
            
            mesas.forEach(mesa => {
                if (!porUbicacion[mesa.ubicacion]) {
                    porUbicacion[mesa.ubicacion] = [];
                }
                porUbicacion[mesa.ubicacion].push(mesa);
            });
            
            return porUbicacion;
        } catch (error) {
            console.error('Error agrupando mesas por ubicación:', error);
            throw error;
        }
    }
}

const mesaService = new MesaService();
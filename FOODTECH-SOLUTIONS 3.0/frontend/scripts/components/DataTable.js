class DataTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.data = [];
        this.columns = [];
    }

    static get observedAttributes() {
        return ['data', 'columns'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data') {
            this.data = JSON.parse(newValue);
        }
        if (name === 'columns') {
            this.columns = JSON.parse(newValue);
        }
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                .data-table th {
                    background: #f8f9fa;
                    padding: 12px;
                    text-align: left;
                    font-weight: 600;
                    color: #2c3e50;
                    border-bottom: 2px solid #e0e0e0;
                }
                
                .data-table td {
                    padding: 12px;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .data-table tr:hover {
                    background: #f8f9fa;
                }
                
                .empty-state {
                    text-align: center;
                    padding: 40px;
                    color: #7f8c8d;
                }
            </style>
            
            <table class="data-table">
                <thead>
                    <tr>
                        ${this.columns.map(col => `<th>${col.header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${this.data.length > 0 ? 
                        this.data.map(row => `
                            <tr>
                                ${this.columns.map(col => `<td>${row[col.field]}</td>`).join('')}
                            </tr>
                        `).join('') : 
                        `<tr><td colspan="${this.columns.length}" class="empty-state">No hay datos disponibles</td></tr>`
                    }
                </tbody>
            </table>
        `;
    }
}

customElements.define('data-table', DataTable);
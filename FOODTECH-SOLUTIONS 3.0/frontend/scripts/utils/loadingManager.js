class LoadingManager {
    constructor() {
        this.loadingStates = new Map();
        this.loadingOverlay = this.createLoadingOverlay();
    }

    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'global-loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(3px);
        `;

        const spinner = document.createElement('div');
        spinner.style.cssText = `
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

        document.head.appendChild(style);
        overlay.appendChild(spinner);
        document.body.appendChild(overlay);

        return overlay;
    }

    showGlobalLoading() {
        this.loadingOverlay.style.display = 'flex';
    }

    hideGlobalLoading() {
        this.loadingOverlay.style.display = 'none';
    }

    async withLoading(operation, options = {}) {
        const { globalLoading = false, buttonElement = null } = options;

        try {
            if (globalLoading) {
                this.showGlobalLoading();
            }

            if (buttonElement) {
                this.disableButton(buttonElement);
            }

            const result = await operation();
            return result;

        } catch (error) {
            throw error;
        } finally {
            if (globalLoading) {
                this.hideGlobalLoading();
            }

            if (buttonElement) {
                this.enableButton(buttonElement);
            }
        }
    }

    disableButton(button) {
        button.disabled = true;
        button.setAttribute('data-original-text', button.textContent);
        button.textContent = '⏳ Procesando...';
        button.style.opacity = '0.7';
    }

    enableButton(button) {
        button.disabled = false;
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.textContent = originalText;
        }
        button.style.opacity = '1';
    }

    setLoadingState(key, isLoading) {
        this.loadingStates.set(key, isLoading);
    }

    getLoadingState(key) {
        return this.loadingStates.get(key) || false;
    }
}

const loadingManager = new LoadingManager();
class Validators {
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePassword(password) {
        return password.length >= 6;
    }

    static validateNumber(value) {
        return !isNaN(value) && value > 0;
    }

    static validateRequired(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    }

    static validatePhone(phone) {
        const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
        return re.test(phone);
    }

    static validatePrice(price) {
        return !isNaN(price) && price >= 0;
    }

    static validateInteger(value) {
        return Number.isInteger(Number(value)) && value >= 0;
    }

    static validateLength(value, min, max) {
        const length = value ? value.toString().length : 0;
        return length >= min && length <= max;
    }

    static validateDate(date) {
        return !isNaN(Date.parse(date));
    }

    static validateFutureDate(date) {
        const inputDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return inputDate >= today;
    }

    static validateForm(formData, rules) {
        const errors = {};
        
        for (const [field, rule] of Object.entries(rules)) {
            const value = formData[field];
            
            if (rule.required && !this.validateRequired(value)) {
                errors[field] = rule.requiredMessage || `${field} es requerido`;
                continue;
            }
            
            if (value && rule.email && !this.validateEmail(value)) {
                errors[field] = 'Email inválido';
            }
            
            if (value && rule.minLength && !this.validateLength(value, rule.minLength, rule.maxLength || 255)) {
                errors[field] = `Debe tener al menos ${rule.minLength} caracteres`;
            }
            
            if (value && rule.number && !this.validateNumber(value)) {
                errors[field] = 'Debe ser un número válido';
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            .trim();
    }
}
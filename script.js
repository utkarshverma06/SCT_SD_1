// Temperature Converter JavaScript

class TemperatureConverter {
    constructor() {
        this.temperatureInput = document.getElementById('temperature');
        this.convertBtn = document.getElementById('convertBtn');
        this.celsiusResult = document.getElementById('celsiusResult');
        this.fahrenheitResult = document.getElementById('fahrenheitResult');
        this.kelvinResult = document.getElementById('kelvinResult');
        this.formulaDisplay = document.getElementById('formulaDisplay');
        this.formulaText = document.getElementById('formulaText');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Convert button click event
        this.convertBtn.addEventListener('click', () => this.convertTemperature());
        
        // Enter key press event
        this.temperatureInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.convertTemperature();
            }
        });
        
        // Real-time conversion on input change
        this.temperatureInput.addEventListener('input', () => {
            if (this.temperatureInput.value !== '') {
                this.convertTemperature();
            } else {
                this.clearResults();
            }
        });
        
        // Scale change event
        const radioButtons = document.querySelectorAll('input[name="fromScale"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                if (this.temperatureInput.value !== '') {
                    this.convertTemperature();
                }
            });
        });
    }
    
    convertTemperature() {
        const inputValue = parseFloat(this.temperatureInput.value);
        
        // Validate input
        if (isNaN(inputValue)) {
            this.showError('Please enter a valid number');
            return;
        }
        
        const fromScale = this.getSelectedScale();
        let celsius, fahrenheit, kelvin;
        let formula = '';
        
        // Convert to Celsius first, then to other scales
        switch(fromScale) {
            case 'celsius':
                celsius = inputValue;
                fahrenheit = this.celsiusToFahrenheit(celsius);
                kelvin = this.celsiusToKelvin(celsius);
                formula = this.getCelsiusFormulas(inputValue);
                break;
                
            case 'fahrenheit':
                fahrenheit = inputValue;
                celsius = this.fahrenheitToCelsius(fahrenheit);
                kelvin = this.celsiusToKelvin(celsius);
                formula = this.getFahrenheitFormulas(inputValue);
                break;
                
            case 'kelvin':
                kelvin = inputValue;
                celsius = this.kelvinToCelsius(kelvin);
                fahrenheit = this.celsiusToFahrenheit(celsius);
                formula = this.getKelvinFormulas(inputValue);
                
                // Validate Kelvin (cannot be negative)
                if (kelvin < 0) {
                    this.showError('Kelvin temperature cannot be negative');
                    return;
                }
                break;
        }
        
        // Validate Kelvin result for other conversions
        if (kelvin < 0) {
            this.showError('Temperature below absolute zero is not possible');
            return;
        }
        
        // Display results
        this.displayResults(celsius, fahrenheit, kelvin);
        this.displayFormula(formula);
    }
    
    // Conversion methods
    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }
    
    celsiusToKelvin(celsius) {
        return celsius + 273.15;
    }
    
    fahrenheitToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5/9;
    }
    
    kelvinToCelsius(kelvin) {
        return kelvin - 273.15;
    }
    
    // Formula generation methods
    getCelsiusFormulas(value) {
        return `°F = (${value} × 9/5) + 32 = ${this.formatNumber(this.celsiusToFahrenheit(value))}°F\n` +
               `K = ${value} + 273.15 = ${this.formatNumber(this.celsiusToKelvin(value))}K`;
    }
    
    getFahrenheitFormulas(value) {
        const celsius = this.fahrenheitToCelsius(value);
        return `°C = (${value} - 32) × 5/9 = ${this.formatNumber(celsius)}°C\n` +
               `K = ${this.formatNumber(celsius)} + 273.15 = ${this.formatNumber(this.celsiusToKelvin(celsius))}K`;
    }
    
    getKelvinFormulas(value) {
        const celsius = this.kelvinToCelsius(value);
        return `°C = ${value} - 273.15 = ${this.formatNumber(celsius)}°C\n` +
               `°F = (${this.formatNumber(celsius)} × 9/5) + 32 = ${this.formatNumber(this.celsiusToFahrenheit(celsius))}°F`;
    }
    
    getSelectedScale() {
        const radioButtons = document.querySelectorAll('input[name="fromScale"]');
        for (const radio of radioButtons) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return 'celsius'; // default
    }
    
    displayResults(celsius, fahrenheit, kelvin) {
        this.celsiusResult.textContent = `${this.formatNumber(celsius)}°C`;
        this.fahrenheitResult.textContent = `${this.formatNumber(fahrenheit)}°F`;
        this.kelvinResult.textContent = `${this.formatNumber(kelvin)}K`;
        
        // Add animation effect
        this.animateResults();
    }
    
    displayFormula(formula) {
        this.formulaText.textContent = formula;
        this.formulaDisplay.classList.add('show');
    }
    
    formatNumber(num) {
        // Round to 2 decimal places and remove trailing zeros
        return parseFloat(num.toFixed(2)).toString();
    }
    
    animateResults() {
        const resultValues = document.querySelectorAll('.result-value');
        resultValues.forEach(element => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = 'fadeIn 0.5s ease-out';
        });
    }
    
    showError(message) {
        // Clear previous results
        this.clearResults();
        
        // Show error message
        alert(message);
        
        // Focus back to input
        this.temperatureInput.focus();
    }
    
    clearResults() {
        this.celsiusResult.textContent = '--';
        this.fahrenheitResult.textContent = '--';
        this.kelvinResult.textContent = '--';
        this.formulaDisplay.classList.remove('show');
    }
}

// Utility functions for additional features
class TemperatureUtils {
    static getTemperatureInfo(celsius) {
        const info = [];
        
        if (celsius === 0) {
            info.push('Water freezing point');
        } else if (celsius === 100) {
            info.push('Water boiling point (at sea level)');
        } else if (celsius === -273.15) {
            info.push('Absolute zero');
        } else if (celsius < -273.15) {
            info.push('Below absolute zero (impossible)');
        } else if (celsius < 0) {
            info.push('Below water freezing point');
        } else if (celsius > 100) {
            info.push('Above water boiling point');
        }
        
        // Human comfort ranges
        if (celsius >= 18 && celsius <= 24) {
            info.push('Comfortable room temperature');
        } else if (celsius >= 36 && celsius <= 38) {
            info.push('Normal human body temperature range');
        }
        
        return info;
    }
    
    static addTemperatureComparison() {
        // This could be extended to show comparisons with common temperatures
        const commonTemperatures = {
            'Absolute Zero': -273.15,
            'Liquid Nitrogen': -196,
            'Dry Ice': -78.5,
            'Water Freezes': 0,
            'Room Temperature': 20,
            'Human Body': 37,
            'Water Boils': 100,
            'Oven Temperature': 200
        };
        
        return commonTemperatures;
    }
}

// Advanced features
class AdvancedConverter extends TemperatureConverter {
    constructor() {
        super();
        this.addAdvancedFeatures();
    }
    
    addAdvancedFeatures() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.clearAll();
            }
        });
        
        // Add copy functionality
        this.addCopyButtons();
    }
    
    addCopyButtons() {
        const resultItems = document.querySelectorAll('.result-item');
        resultItems.forEach(item => {
            const copyBtn = document.createElement('button');
            copyBtn.textContent = '📋';
            copyBtn.className = 'copy-btn';
            copyBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 0.9rem;
                opacity: 0.6;
                transition: opacity 0.2s;
                margin-left: 10px;
            `;
            
            copyBtn.addEventListener('click', () => {
                const resultValue = item.querySelector('.result-value').textContent;
                this.copyToClipboard(resultValue);
                this.showCopyFeedback(copyBtn);
            });
            
            copyBtn.addEventListener('mouseenter', () => {
                copyBtn.style.opacity = '1';
            });
            
            copyBtn.addEventListener('mouseleave', () => {
                copyBtn.style.opacity = '0.6';
            });
            
            item.appendChild(copyBtn);
        });
    }
    
    copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
            document.body.removeChild(textArea);
        }
    }
    
    showCopyFeedback(button) {
        const originalText = button.textContent;
        button.textContent = '✓';
        button.style.color = '#4CAF50';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.color = '';
        }, 1000);
    }
    
    clearAll() {
        this.temperatureInput.value = '';
        this.clearResults();
        this.temperatureInput.focus();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Use the advanced converter for better functionality
    const converter = new AdvancedConverter();
    
    // Add some CSS for copy buttons
    const style = document.createElement('style');
    style.textContent = `
        .copy-btn:hover {
            transform: scale(1.1);
        }
        
        .copy-btn:active {
            transform: scale(0.95);
        }
        
        .result-item {
            position: relative;
        }
        
        @media (max-width: 480px) {
            .copy-btn {
                font-size: 0.8rem !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});

// Export for testing purposes (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TemperatureConverter, TemperatureUtils, AdvancedConverter };
}
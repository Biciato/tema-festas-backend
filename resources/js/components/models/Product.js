export default class Product {
    constructor(product, size, qty, color, theme, number) {    
        this.product = product;
        this.size = size;
        this.qty = qty;
        this.color = color;
        this.theme = theme;
        this.number = number;
    }

    get values() {
        return [
            this.size,
            this.qty,
            this.color,
            this.theme,
            this.number,
        ];
    }
}
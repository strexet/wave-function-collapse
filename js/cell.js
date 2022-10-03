class Cell {
    constructor(options) {
        this.collapsed = false;
    
        if (options instanceof Array) {
            this.options = options;
        }
        else {
            this.options = new Array(options).fill(0).map((_, i) => i);
        }
    }
}
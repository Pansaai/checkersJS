const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

export default class Cell{
    constructor(x, y, size){
        this.piece = false;
        this.selected = false;
        this.x = x;
        this.y = y;
        this.size = size;
    }

    show(fillstyle){
        context.fillStyle = fillstyle;
        context.fillRect(this.x, this.y, this.size, this.size);
    }
}
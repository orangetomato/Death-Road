import Rectangle from './rectangle.js';

export default class Frog extends Rectangle {
    constructor(xPos, yPos, width, height, imageToDraw) {
        super(xPos, yPos, width, height);
        this.name = 'Frog';
        this.step = 0;
        this.lives = 3;
        this.time = 30;
        this.level = 1;
        this.points = 0;
        this.angle = 0;
        this.imageToDraw = imageToDraw;
    }
}
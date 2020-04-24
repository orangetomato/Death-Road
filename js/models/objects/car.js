import Rectangle from './rectangle.js';

export default class Car extends Rectangle {
    constructor(xPos, yPos, width, height, color, speed) {
        super(xPos, yPos, width, height, color);
        this.name = 'Car';
        this.speed = speed;
    }
}
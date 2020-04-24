import Car from './car.js';

export default class Log extends Car {
    constructor(xPos, yPos, width, height, color, speed) {
        super(xPos, yPos, width, height, color, speed);
        this.name = 'Log';
    }
}
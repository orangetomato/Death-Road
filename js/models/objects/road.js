import Rectangle from './rectangle.js';

export default class Road extends Rectangle {
    constructor(xPos, yPos, width, height, color) {
        super(xPos, yPos, width, height, color);
        this.name = 'Road';
    }
}
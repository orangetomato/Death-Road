export default class FinishZone {
    constructor(xPos, yPos, radius, color) {
        this.name = 'Finish Zone';
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;
        this.color = color;

        this.width = radius * 2;
        this.height = radius * 2;
    }
}
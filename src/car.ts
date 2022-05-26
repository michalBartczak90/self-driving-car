import { Controls } from './controls';
import { Sensor } from './sensor';
import { Point, Segment } from './models';
import { polysIntersection } from '~src/utils';

export class Car {
  private sensor: Sensor = new Sensor(this);
  private controls: Controls = new Controls();
  private polygon: Point[] = [];
  private speed = 0;
  private maxSpeed = 3;
  private acceleration = 0.2;
  private friction = 0.05;
  angle = 0;
  damaged = false;

  constructor(
    public x: number,
    public y: number,
    private width: number,
    private height: number
  ) {}

  update(roadBoarders: Segment[]) {
    if (!this.damaged) {
      this.move();
      this.polygon = this.createPolygon();
      this.damaged = this.assessDamaged(roadBoarders);
    }

    this.sensor.update(roadBoarders);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.damaged ? 'gray' : 'black';

    ctx.beginPath();
    const [firstPoint, ...polygonPoints] = this.polygon;

    ctx.moveTo(firstPoint.x, firstPoint.y);
    polygonPoints.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.fill();

    this.sensor.draw(ctx);
  }

  private assessDamaged(roadBoarders: Segment[]): boolean {
    for (let roadBoarder of roadBoarders) {
      if (polysIntersection(this.polygon, roadBoarder)) {
        return true;
      }
    }
    return false;
  }

  /**
   * return Car corners points
   * @private
   */
  private createPolygon(): Point[] {
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    return [
      {
        x: this.x - Math.sin(this.angle - alpha) * rad,
        y: this.y - Math.cos(this.angle - alpha) * rad,
      },
      {
        x: this.x - Math.sin(this.angle + alpha) * rad,
        y: this.y - Math.cos(this.angle + alpha) * rad,
      },
      {
        x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
        y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
      },
      {
        x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
        y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
      },
    ];
  }

  private move() {
    this.updateTraitsOfTheMovement();

    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += flip * 0.03;
      }
      if (this.controls.right) {
        this.angle -= flip * 0.03;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  private updateTraitsOfTheMovement() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }

    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }

    if (this.speed < 0) {
      this.speed += this.friction;
    }

    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
  }
}

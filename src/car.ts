import { Controls, ControlType } from './controls';
import { Sensor } from './sensor';
import { Polygon, Segment } from './models';
import { polysIntersection } from '~src/utils';

export class Car {
  private sensor: Sensor | undefined = undefined;
  private controls: Controls;
  private speed = 0;
  private acceleration = 0.2;
  private friction = 0.05;
  angle = 0;
  polygon: Polygon = [];
  damaged = false;

  constructor(
    public x: number,
    public y: number,
    private width: number,
    private height: number,
    private controlType: ControlType,
    private maxSpeed = 3
  ) {
    this.controls = new Controls(controlType);
    if (controlType === ControlType.Keys) {
      this.sensor = new Sensor(this);
    }
  }

  update(roadBoarders: Segment[], traffic: Car[]) {
    if (!this.damaged) {
      this.move();
      this.polygon = this.createPolygon();
      this.damaged = this.assessDamaged(roadBoarders, traffic);
    }

    this.sensor?.update(roadBoarders, traffic);
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = this.damaged ? 'gray' : color;

    ctx.beginPath();
    const [firstPoint, ...polygonPoints] = this.polygon;

    ctx.moveTo(firstPoint.x, firstPoint.y);
    polygonPoints.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.fill();

    this.sensor?.draw(ctx);
  }

  private assessDamaged(roadBoarders: Segment[], traffic: Car[]): boolean {
    for (let obstacle of [
      ...roadBoarders,
      ...traffic.map((car) => car.polygon),
    ]) {
      if (polysIntersection(this.polygon, obstacle)) {
        return true;
      }
    }
    return false;
  }

  /**
   * return Car corners points
   * @private
   */
  private createPolygon(): Polygon {
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

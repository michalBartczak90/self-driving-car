import { Car } from './car';
import { lineIntersection, lerp } from './utils';
import { Intersection, Point, Segment } from './models';

export class Sensor {
  private rayCount = 3;
  private rayLength = 100;
  private raySpread = Math.PI / 4;
  private rays: Segment[] = [];
  private readings = [];

  constructor(private car: Car) {}

  update(roadBoarders: Segment[]) {
    this.castRays();
    this.readings = [];

    for (const ray of this.rays) {
      this.readings.push(this.getReading(ray, roadBoarders));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i];
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'yellow';
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }

  private castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start: Point = { x: this.car.x, y: this.car.y };
      const end: Point = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  private getReading(
    ray: Segment,
    roadBoarders: Segment[]
  ): Intersection | undefined {
    let touches: (Intersection | undefined)[] = [];

    for (let i = 0; i < roadBoarders.length; i++) {
      const touch = lineIntersection(
        ray[0],
        ray[1],
        roadBoarders[i][0],
        roadBoarders[i][1]
      );

      if (touch) {
        touches.push(touch);
      }
    }
    if (touches.length === 0) {
      return undefined;
    }

    const offsets = touches.map((e) => e.offset);
    const minOffset = Math.min(...offsets);
    return touches.find(({ offset }) => offset === minOffset);
  }
}
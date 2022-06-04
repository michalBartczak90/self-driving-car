import { Controls, ControlType } from './controls';
import { Sensor } from './sensor';
import { Polygon, Segment } from './models';
import { polysIntersection } from './utils';
import { NeuralNetwork } from './neural-network';

export class Car {
  private sensor: Sensor | undefined = undefined;
  private controls: Controls;
  public brain: NeuralNetwork | undefined = undefined;
  private speed = 0;
  private acceleration = 0.2;
  private friction = 0.05;
  angle = 0;
  polygon: Polygon = [];
  damaged = false;
  useBrain: boolean;

  constructor(
    public x: number,
    public y: number,
    private width: number,
    private height: number,
    private controlType: ControlType,
    private maxSpeed = 3
  ) {
    this.useBrain = this.controlType === ControlType.AI;
    this.controls = new Controls(controlType);

    if (controlType !== ControlType.Dummy) {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }
  }

  update(roadBoarders: Segment[], traffic: Car[]) {
    if (!this.damaged) {
      this.move();
      this.polygon = this.createPolygon();
      this.damaged = this.assessDamaged(roadBoarders, traffic);
    }

    if (this.sensor) {
      this.sensor.update(roadBoarders, traffic);

      if (this.useBrain) {
        const offsets = this.sensor.readings.map((s) =>
          !s ? 0 : 1 - s.offset
        );
        const outputs = NeuralNetwork.feedForward(offsets, this.brain);

        this.controls.forward = !!outputs[0];
        this.controls.left = !!outputs[1];
        this.controls.right = !!outputs[2];
        this.controls.reverse = !!outputs[3];
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string, drawSensors = false) {
    ctx.fillStyle = this.damaged ? 'gray' : color;

    ctx.beginPath();
    const [firstPoint, ...polygonPoints] = this.polygon;

    ctx.moveTo(firstPoint.x, firstPoint.y);
    polygonPoints.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.fill();

    if (drawSensors && this.sensor) {
      this.sensor.draw(ctx);
    }
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

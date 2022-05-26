import { Car } from './car';
import { Road } from './road';
import { ControlType } from './controls';

const canvas: HTMLCanvasElement = document.getElementById(
  'myCanvas'
) as HTMLCanvasElement;
canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext('2d');

const road = new Road(canvas.width / 2, canvas.width - 20);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, ControlType.Keys);
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, ControlType.Dummy, 2),
  new Car(road.getLaneCenter(0), -250, 30, 50, ControlType.Dummy, 2),
  new Car(road.getLaneCenter(3), -500, 30, 50, ControlType.Dummy, 2),
];
animate();

function animate() {
  traffic.forEach((trafficCar) => trafficCar.update(road.borders, []));
  car.update(road.borders, traffic);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);

  traffic.forEach((trafficCar) => trafficCar.draw(ctx, 'red'));
  road.draw(ctx);
  car.draw(ctx, 'blue');
  ctx.restore();

  requestAnimationFrame(animate);
}

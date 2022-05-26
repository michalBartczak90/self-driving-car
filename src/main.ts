import { Car } from './car';
import { Road } from './road';

const canvas: HTMLCanvasElement = document.getElementById(
  'myCanvas'
) as HTMLCanvasElement;
canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext('2d');

const road = new Road(canvas.width / 2, canvas.width - 20);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);

animate();

function animate() {
  car.update(road.borders);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);
  road.draw(ctx);
  car.draw(ctx);
  ctx.restore();

  requestAnimationFrame(animate);
}

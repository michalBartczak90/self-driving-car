import { Intersection, Point, Polygon } from '../models';
import { lerp } from './interpolation';

/**
 * Check if lines between points [A, B]  [C, D] intersect
 * offset - ratio of intersection
 * @param A
 * @param B
 * @param C
 * @param D
 */
export function lineIntersection(
  A: Point,
  B: Point,
  C: Point,
  D: Point
): Intersection | undefined {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom !== 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }
  return undefined;
}

export function polysIntersection(poly1: Polygon, poly2: Polygon) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = lineIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if(touch) {
        return true
      }
    }
  }
  return  false
}

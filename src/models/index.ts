export interface Point {
  x: number;
  y: number;
}

export type Segment = [Point, Point];

export interface Intersection extends Point {
  offset: number;
}

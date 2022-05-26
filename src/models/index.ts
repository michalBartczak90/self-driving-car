export interface Point {
  x: number;
  y: number;
}

export type Segment = [Point, Point];
export type Polygon = Point[];

export interface Intersection extends Point {
  offset: number;
}

import p5 from "p5";
import { AbstractBoid } from "./types";
import { createVector } from "src/components/ComputerScience/Algorithms/Routing/GridRouting/useGridGraph";

const DEFAULT_COLOUR = "red";
const DEFAULT_BORDER_WEIGHT = 1;
const DEFAULT_MAX_SPEED = 1.5;
const DEFAULT_MAX_FORCE = 0.5;
const DEFAULT_MIN_FORCE = 0.01;

export default class Boid<T> implements AbstractBoid<T> {
  entity: T;
  label?: string;
  position: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  radius: number;
  colour: string;
  borderWeight: number;
  maxSpeed: number;
  maxForce: number;
  minForce: number;
  environmentalFriction: number;
  grabbed: boolean;

  constructor({
    entity,
    position,
    radius,
    label,
    colour = DEFAULT_COLOUR,
    borderWeight = DEFAULT_BORDER_WEIGHT,
    maxSpeed = DEFAULT_MAX_SPEED,
    maxForce = DEFAULT_MAX_FORCE,
    minForce = DEFAULT_MIN_FORCE,
    environmentalFriction = 0.9,
  }: AbstractBoid<T>) {
    this.entity = entity;
    this.position = position;
    this.label = label;
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.radius = radius;
    this.colour = colour;
    this.borderWeight = borderWeight;
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.minForce = minForce;
    this.environmentalFriction = environmentalFriction;
    this.grabbed = false;
  }

  grab() {
    this.grabbed = true;
    this.velocity.mult(0);
    this.acceleration.mult(0);
  }

  dragged(mousePosition: p5.Vector) {
    if (this.grabbed) {
      this.position = mousePosition;
    }
  }

  releaseGrab() {
    this.grabbed = false;
  }

  applyForce(force: p5.Vector) {
    force.limit(this.maxForce);
    this.acceleration.add(force);
  }

  update(s: p5) {
    if (!this.grabbed && this.acceleration.mag() > this.minForce) {
      this.velocity.add(this.acceleration);
      this.velocity.mult(this.environmentalFriction);
      this.position.add(this.velocity);
    }
    this.acceleration.mult(0);
  }

  draw(s: p5) {
    // Expect to be overridden
    s.strokeWeight(this.borderWeight);
    s.fill(this.colour);
    s.circle(this.position.x, this.position.y, this.radius);
  }

  seek(target: p5.Vector): void {
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);
    desired.sub(this.velocity);
    this.applyForce(desired);
  }

  flee(target: p5.Vector, radius: number = 20): void {
    let desired = p5.Vector.sub(target, this.position);
    if (desired.mag() < radius) {
      desired.normalize();
      desired.mult(-this.maxSpeed);
      desired.sub(this.velocity);
      this.applyForce(desired);
    }
  }

  spring(tether: p5.Vector, springLength: number, tolerance: number) {
    let desired = p5.Vector.sub(tether, this.position);
    let diff = desired.mag() - springLength;
    if (diff < -tolerance) {
      desired.mult(-this.maxSpeed);
      this.applyForce(desired);
    } else if (diff > tolerance) {
      desired.mult(+this.maxSpeed);
      this.applyForce(desired);
    }
  }

  arrive(s: p5, target: p5.Vector, arriveRadius: number): void {
    let desired = p5.Vector.sub(target, this.position);
    let d = desired.mag();
    desired.normalize();
    if (d < arriveRadius) {
      let m = s.map(d, 0, arriveRadius, 0, this.maxSpeed);
      desired.mult(m);
    } else {
      desired.mult(this.maxSpeed);
    }
    desired.sub(this.velocity);
    this.applyForce(desired);
  }

  onScreen(s: p5) {
    const { x, y } = this.position;
    const { width, height } = s;
    return x > 0 && x < width && y > 0 && y < height;
  }
}

import FlowField from "./FlowField";
import Boid from "../../Boid/Boid";

export default class ArrowBoidBoid extends Boid<number> {
  colour: string = "red";

  follow(flow: FlowField) {
    let desired = flow.lookup(this.position);
    desired.mult(this.maxSpeed);
    desired.sub(this.velocity);
    desired.limit(this.maxForce);
    return desired;
  }

  draw() {
    let s = this.sketch;

    let theta = this.velocity.heading() + s.PI / 2;
    s.fill(this.colour);
    s.noStroke();
    s.push();
    s.translate(this.position.x, this.position.y);
    s.rotate(theta);
    s.beginShape();
    s.vertex(0, -this.radius * 2);
    s.vertex(-this.radius, this.radius * 2);
    s.vertex(this.radius, this.radius * 2);
    s.endShape();
    s.pop();
  }
}

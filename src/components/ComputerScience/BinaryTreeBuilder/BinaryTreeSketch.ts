import { AbstractSketch } from "src/components/p5/useSketch";
import BinaryTree from "comp-sci-maths-lib/dist/dataStructures/binaryTree/BinaryTree";
import DataItemBoid from "src/components/p5/Boid/DataItemBoid";
import p5 from "p5";
import { createP5Vector } from "src/components/ComputerScience/Algorithms/Routing/GridRouting/useGridGraph";
import { Config, TreeDirection } from "./types";

const WIDTH = 1024;
const HEIGHT = 500;

const RADIUS = 50;
const SPRING_LENGTH = 120;

const getDefaultConfig = (): Config<any> => ({
  binaryTree: new BinaryTree<any>((a, b) => a - b),
  treeDirection: TreeDirection.down,
  toString: (v) => `${v}`,
});

class BinaryTreeSketch<T> extends AbstractSketch<Config<T>> {
  boids: {
    [id: string]: DataItemBoid<BinaryTree<T>>;
  };
  headLeft: p5.Vector;
  headRight: p5.Vector;

  constructor() {
    super(getDefaultConfig());
    this.boids = {};
    this.headLeft = createP5Vector(-50, 70);
    this.headRight = createP5Vector(50, 70);
  }

  visitBoids(
    sketch: p5,
    treeNode: BinaryTree<T>,
    position: p5.Vector,
    boidReceiver: (boid: DataItemBoid<BinaryTree<T>>) => void,
    id: string,
    parentBoid?: DataItemBoid<BinaryTree<T>>
  ): void {
    if (treeNode.value === undefined) {
      return;
    }

    if (!this.boids[id]) {
      this.boids[id] = new DataItemBoid({
        radius: RADIUS,
        entity: treeNode,
        label: this.config.toString(treeNode.value),
        position,
        lockY: true,
      });
    } else {
      // position = this.boids[id].position;
      this.boids[id].entity = treeNode;
      this.boids[id].label = this.config.toString(treeNode.value);
    }
    const thisBoid = this.boids[id];
    boidReceiver(thisBoid);

    // Draw the line between this boid and it's parents
    if (!!parentBoid) {
      thisBoid.spring(parentBoid.position, SPRING_LENGTH, 10);
      sketch.strokeWeight(3);
      sketch.stroke("black");
      sketch.line(
        thisBoid.position.x,
        thisBoid.position.y,
        parentBoid.position.x,
        parentBoid.position.y
      );

      let midpoint: p5.Vector = (p5.Vector.lerp(
        parentBoid.position,
        thisBoid.position,
        0.5
      ) as unknown) as p5.Vector; // error in p5 type definition

      sketch.fill("white");
      sketch.circle(midpoint.x, midpoint.y, 30);
      sketch.fill("black");
      sketch.strokeWeight(1);
      sketch.textAlign(sketch.CENTER, sketch.CENTER);
      sketch.text(id[id.length - 1], midpoint.x, midpoint.y);
    }

    if (!!treeNode.leftBranch) {
      this.visitBoids(
        sketch,
        treeNode.leftBranch,
        p5.Vector.add(position, this.headLeft),
        boidReceiver,
        id + "L",
        thisBoid
      );
    }
    if (!!treeNode.rightBranch) {
      this.visitBoids(
        sketch,
        treeNode.rightBranch,
        p5.Vector.add(position, this.headRight),
        boidReceiver,
        id + "R",
        thisBoid
      );
    }
  }

  sketch = (s: import("p5")) => {
    const that = this;

    s.setup = function () {
      s.createCanvas(WIDTH, HEIGHT);
      s.colorMode(s.HSB, 255);
      s.textFont("Helvetica", 24);
      s.textAlign(s.CENTER, s.CENTER);
      s.angleMode(s.DEGREES);
    };

    s.mousePressed = function () {
      const mousePosition = s.createVector(s.mouseX, s.mouseY);
      const boid = Object.values(that.boids).find((boid) =>
        boid.isMouseOver(mousePosition)
      );
      if (boid !== undefined) {
        boid.grab();
      }
    };

    s.mouseDragged = function () {
      const mousePosition = s.createVector(s.mouseX, s.mouseY);
      Object.values(that.boids).forEach((boid) => boid.dragged(mousePosition));
    };

    s.mouseReleased = function () {
      Object.values(that.boids).forEach((boid) => boid.releaseGrab());
    };

    s.draw = () => {
      s.background(230);

      const { binaryTree } = that.config;
      s.push();

      const boids: DataItemBoid<BinaryTree<T>>[] = [];
      that.visitBoids(
        s,
        binaryTree,
        s.createVector(s.width / 2, 30),
        (b) => boids.push(b),
        "ROOT"
      );

      boids.forEach((a) => {
        boids
          .filter((b) => a !== b)
          .forEach((b) => a.flee(b.position, RADIUS * 2));
      });

      Object.values(boids)
        .filter((_, i) => i > 0)
        .forEach((b) => b.update(s));
      Object.values(boids).forEach((b) => b.draw(s));

      s.pop();
    };
  };
}

export default BinaryTreeSketch;

class Vector2 {
  constructor(x, y) {
    this.set(x, y);
  }

  add(x, y) {
    if (x instanceof Vector2) {
      this.x += x.x;
      this.y += x.y;
    } else {
      this.x += x || 0;
      this.y += y || 0;
    }
    return this;
  }

  // ## angle
  // ### angle()
  // Returns the angle in radians of this vector
  // relative to the x-axis (counter-clockwise)
  // in the range 0 to 2 * PI.
  // ### angle(radians)
  // Rotates this vector to the given angle in radians.
  // Returns this vector for chaining.
  angle(rad) {
    if (rad !== undefined) { return this.set(this.length(), 0).rotate(rad); }
    let angle = Math.atan2(this.y, this.x);
    if (angle < 0) angle += Math.PI * 2;
    return angle;
  }

  // ## angleDeg
  // ### angleDeg()
  // Same as angle() but in degrees.
  // ### angleDeg(degrees)
  // Same as angle(radians) but in degrees.
  angleDeg(deg) {
    if (deg !== undefined) { return this.angle(deg / 180 * Math.PI); }
    return this.angle() * 180 / Math.PI;
  }

  // ## clone()
  // ## copy()
  // Returns a new identical Vector2.
  clone() {
    return new Vector2(this.x, this.y);
  }

  // ## cross(Vector2)
  // ## cross(x, y)
  // Returns the cross product of this vector and another.
  cross(x, y) {
    if (x instanceof Vector2) { return this.x * x.y - this.y * x.x; }
    return this.x * y - this.y * x;
  }

  // ## distance(Vector2)
  // ## distance(x, y)
  // Returns the distance between this vector and another.
  distance(x, y) {
    const distSq = this.distanceSq(x, y);
    if (distSq === undefined) { return undefined; }
    return Math.sqrt(distSq);
  }

  // ## distanceSq(Vector2)
  // ## distanceSq(x, y)
  // Returns the distance squared of this vector and another.
  distanceSq(x, y) {
    let dx;
    let dy;
    if (x instanceof Vector2) {
      dx = x.x - this.x;
      dy = x.y - this.y;
    } else if (y !== undefined) {
      dx = x - this.x;
      dy = y - this.y;
    } else { return undefined; }
    return dx * dx + dy * dy;
  }

  // ## dot(Vector2)
  // ## dot(x, y)
  // Returns the dot product of this vector and another.
  dot(x, y) {
    if (x instanceof Vector2) { return this.x * x.x + this.y * x.y; }
    return this.x * x + this.y * y;
  }

  // ## equals
  // ### equals(Vector2)
  // Returns true if this and another vector2 are equal.
  // ### equals(Vector2, epsilon)
  // Returns true if this and another vector2 are equal within an epsilon.
  // ### equals(x, y)
  // Returns true if this vector equals given x, y components.
  // ### equals(x, y, epsilon)
  // Returns true if this vector equals given x, y components within an epsilon.
  equals(x, y, epsilon) {
    if (x instanceof Vector2) {
      y = y || 0;
      return Math.abs(this.x - x.x) <= y && Math.abs(this.y - x.y) <= y;
    }
    if (y !== undefined) {
      epsilon = epsilon || 0;
      return Math.abs(this.x - x) <= epsilon && Math.abs(this.y - y) <= epsilon;
    }
    return false;
  }

  // ## length()
  // Returns the length of this vector.
  length() {
    return Math.sqrt(this.lengthSq());
  }

  // ## lengthSq()
  // Returns the length squared of this vector.
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }

  // ## negate()
  // Negates this vector. (Multiplies x and y by -1).
  // Returns this vector for chaining.
  negate() {
    return this.scale(-1);
  }

  // ##normalize()
  // Normalizes this vector.
  // Returns this vector for chaining.
  normalize() {
    return this.scale(1 / this.length());
  }

  // ## rotate(radians)
  // Rotates this vector by an angle in degrees counter-clockwise.
  // Returns this vector for chaining.
  rotate(rad) {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return this.set(this.x * cos - this.y * sin,
      this.x * sin + this.y * cos);
  }

  // ## rotateDeg(degrees)
  // Same as rotate but in degrees.
  rotateDeg(deg) {
    return this.rotate(deg / 180 * Math.PI);
  }

  // ## scale(scale)
  // ## scale(scaleX, scaleY)
  // Scales this vector by a scalar.
  // Second argument to scale y separate from x is optional.
  // Returns this vector for chaining.
  scale(scaleX, scaleY) {
    this.x *= scaleX;
    this.y *= (scaleY || scaleX);
    return this;
  }

  // ## set(Vector2)
  // ## set(x, y)
  // Sets this vector to the given values.
  // Returns this vector for chaining.
  set(x, y) {
    if (x instanceof Vector2) {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x || 0;
      this.y = y || 0;
    }
    return this;
  }

  // ## setPolar(radians, length)
  // Set this vector by angle in degrees and magnitude.
  // Returns this vector for chaining.
  setPolar(rad, length) {
    return this.set(length, 0).rotate(rad);
  }

  // ## setPolarDeg(degrees, length)
  // Same as setPolar but in degrees.
  setPolarDeg(deg, length) {
    return this.setPolar(deg / 180 * Math.PI, length);
  }

  sub(x, y) {
    if (y !== undefined) {
      this.x -= x;
      this.y -= y;
    } else {
      this.x -= x.x;
      this.y -= x.y;
    }
    return this;
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

function isEqual(number1, number2, tolerance) {
  tolerance = tolerance || 0;
  return Math.abs(number1 - number2) < Math.abs(tolerance);
}

const mathUtils = {
  isEqual,

  isZero(number, tolerance) {
    return isEqual(number, 0, tolerance);
  },

  /**
     * Clamps the passed value to the passed bounds (i.e. if value is smaller than min bound it's set to min bound, if bigger than max bound it's set to max bound).
     * @param value
     * @param min
     * @param max
     * @returns {*}
     */
  clamp(value, min, max) {
    if (value > min) {
      return value < max ? value : max;
    }
    return min;
  }
};

const isZero = mathUtils.isZero;
const clamp = mathUtils.clamp;


// The value of 1/3
const inv3 = 1.0 / 3.0;
const origin = new Vector2(0, 0);
// tolerance for number comparison
const tolerance = 0.0001;

// the iterations count after which the result will be 0;
const defaultLoopIterations = 30;

function isArray(array) {
  return Object.prototype.toString.call(array) === '[object Array]';
}


function vectorLikeToVectorPolygon(polygon) {
  if (!isArray(polygon)) {
    throw new Error("Polygon must be an array of points");
  }

  switch (typeof polygon[0]) {
    case 'number': {
      if (polygon.length % 2 !== 0) {
        throw new Error("Polygon that contains array of numbers must has even length ([x0, y0, x1, y1, ...., xn, yn])");
      }

      const result = [];

      for (let i = 0; i < polygon.length; i += 2) {
        result.push(new Vector2(polygon[i], polygon[i + 1]));
      }
      return result;
    }
    case 'object': {
      return polygon.map(
        isArray(polygon[0]) ?
          point => new Vector2(point[0], point[1]) :
          point => new Vector2(point.x, point.y)
      );
    }
    default:
      throw new Error("Passed polygon is not an array of 2D coordinates");
  }
}

function getAreaWeightedCenter(polygon) {
  if (polygon.length === 1) {
    return new Vector2(polygon[0]);
  }

  const ac = new Vector2(0.0, 0.0);

  polygon.forEach(vector => ac.add(vector));
  ac.scale(1 / polygon.length);

  const center = new Vector2();
  let area = 0.0;

  polygon.forEach((vector, index) => {
    const p1 = new Vector2(vector);
    const p2 = new Vector2(index + 1 === polygon.length ? polygon[0] : polygon[index + 1]);


    p1.add(-ac.x, -ac.y);
    p2.add(-ac.x, -ac.y);

    const triangleArea = 0.5 * p1.cross(p2);
    area += triangleArea;

    center.add(p1.add(p2).scale(inv3).scale(triangleArea));
  });

  if (isZero(area, tolerance)) {
    // zero area can only happen if all the points are the same point
    // in which case just return a copy of the first
    return center.set(polygon[0]);
  }

  // return the center
  return center.scale(1 / area).add(ac);
}

function getFarthestPointInDirection(polygon, direction) {
  let farthestPoint = polygon[0];
  let farthestDistance = direction.dot(polygon[0]);
  let tempDist = 0;

  for (let i = 1; i < polygon.length; i++) {
    tempDist = direction.dot(polygon[i]);
    if (tempDist > farthestDistance) {
      farthestDistance = tempDist;
      farthestPoint = polygon[i];
    }
  }
  return new Vector2(farthestPoint);
}

function support(polygon1, polygon2, direction) {
  const point1 = getFarthestPointInDirection(polygon1, direction);
  const point2 = getFarthestPointInDirection(polygon2, direction.negate());
  return new Vector2(point1.sub(point2));
}


function closestPointOnSegmentToOrigin(vector1, vector2) {
  const closest = new Vector2(0.0, 0.0);
  // vector from point to the origin
  const vector1ToOrigin = new Vector2(vector1).negate();
  // vector representing the line
  const lineVector1Vector2 = new Vector2(vector2).sub(vector1);

  // get the length squared of the line
  const lineV1V2Dot = lineVector1Vector2.dot(lineVector1Vector2);
  // if a === b
  if (isZero(lineV1V2Dot, tolerance)) {
    return closest.set(vector1);
  }

  // projection of aToOrigin on lineAB
  const v1ToOrigin_V1V2 = vector1ToOrigin.dot(lineVector1Vector2);
  // get the position from the first line point to the projection
  let t = v1ToOrigin_V1V2 / lineV1V2Dot;
  // make sure t is in between 0.0 and 1.0
  t = clamp(t, 0.0, 1.0);
  return closest.set(lineVector1Vector2.scale(t).add(vector1));
}


function distance(polygon1, polygon2) {
  polygon1 = vectorLikeToVectorPolygon(polygon1);
  polygon2 = vectorLikeToVectorPolygon(polygon2);

  const centerP1 = getAreaWeightedCenter(polygon1);
  const centerP2 = getAreaWeightedCenter(polygon2);


  const direction = centerP2.add(centerP1.negate());

  let a;
  let b;
  let c;

  a = support(polygon1, polygon2, direction);
  b = support(polygon1, polygon2, direction.negate());

  for (let i = 0; i < defaultLoopIterations; i++) {
    const p = closestPointOnSegmentToOrigin(a, b);

    if (isZero(p.length(), tolerance)) {
      // the origin is on the Minkowski Difference
      // I consider this touching/collision
      return 0.0;
    }

    // p.to(origin) is the new direction
    // we normalize here because we need to check the
    // projections along this vector later
    direction.set(p.negate().normalize());
    c = support(polygon1, polygon2, direction);
    // is the point we obtained making progress
    // towards the goal (to get the closest points
    // to the origin)
    const dc = c.dot(direction);
    // you can use a or b here it doesn't matter
    const da = a.dot(direction);

    if (isZero(dc - da, tolerance)) {
      return dc;
    }

    // if we are still getting closer then only keep
    // the points in the simplex that are closest to
    // the origin (we already know that c is closer
    // than both a and b)
    if (a.distanceSq(origin) < b.distanceSq(origin)) {
      b = c;
    } else {
      a = c;
    }
  }

  return 0.0;
}

const gjk = {

  /**
     * Checks if two convex polygons intersects.
     * Polygons must be an arrays with elements of one of next formats:
     * 1. [x1, y2, x2, y2, ..., xn, yn]
     * 2. [{x, y}, {x, y}, ..., {x, y}]
     * 3. [[x, y], [x, y], ..., [x, y]]
     * @param {Array.<Object|Number|Array.<Number>>}polygon1
     * @param {Array.<Object|Number|Array.<Number>>}polygon2
     * @returns {boolean}
     */
  intersect(polygon1, polygon2) {
    return isZero(distance(polygon1, polygon2), tolerance);
  },

  /**
     * Calculates distance between 2 convex polygons.
     * Polygons must be an arrays with elements of one of next formats:
     * 1. [x1, y2, x2, y2, ..., xn, yn]
     * 2. [{x, y}, {x, y}, ..., {x, y}]
     * 3. [[x, y], [x, y], ..., [x, y]]
     * @param {Array.<Object|Number|Array.<Number>>}polygon1
     * @param {Array.<Object|Number|Array.<Number>>}polygon2
     * @returns {number}
     */
  distance
};
export default gjk;

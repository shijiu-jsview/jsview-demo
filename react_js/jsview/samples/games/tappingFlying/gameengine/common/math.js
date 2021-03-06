/**
 * Created by luocf on 2020/5/14.
 */
const math = {

  /**
     * Twice PI.
     * @property {number} Math#PI2
     * @default ~6.283
     */
  PI2: Math.PI * 2,

  /**
     * Half PI.
     * @property {number} Math#HALF_PI
     * @default ~1.570
     */
  HALF_PI: Math.PI * 0.5,

  /**
     * Degrees to Radians factor.
     * @property {number} Math#DEG_TO_RAD
     */
  DEG_TO_RAD: Math.PI / 180,

  /**
     * Degrees to Radians factor.
     * @property {number} Math#RAD_TO_DEG
     */
  RAD_TO_DEG: 180 / Math.PI,

  /**
     * Convert degrees to radians.
     *
     * @method Math#degToRad
     * @param {number} degrees - Angle in degrees.
     * @return {number} Angle in radians.
     */
  degToRad (degrees) {
    return degrees * Math.DEG_TO_RAD;
  },

  /**
     * Convert radians to degrees.
     *
     * @method Math#radToDeg
     * @param {number} radians - Angle in radians.
     * @return {number} Angle in degrees
     */
  radToDeg (radians) {
    return radians * Math.RAD_TO_DEG;
  },

  /**
     * Given a number, this function returns the closest number that is a power of two.
     * This function is from the Starling Framework.
     *
     * @method Math#getNextPowerOfTwo
     * @param {number} value - The value to get the closest power of two from.
     * @return {number} The closest number that is a power of two.
     */
  getNextPowerOfTwo (value) {
    if (value > 0 && (value & (value - 1)) === 0) {
      //  http://goo.gl/D9kPj
      return value;
    }

    let result = 1;

    while (result < value) {
      result <<= 1;
    }

    return result;
  },

  /**
     * Checks if the given dimensions make a power of two texture.
     *
     * @method Math#isPowerOfTwo
     * @param {number} width - The width to check.
     * @param {number} height - The height to check.
     * @return {boolean} True if the width and height are a power of two.
     */
  isPowerOfTwo (width, height) {
    return (width > 0 && (width & (width - 1)) === 0 && height > 0 && (height & (height - 1)) === 0);
  },

  /**
     * Returns a random float in the range `[min, max)`. If these parameters are not in order than they will be put in order.
     * Default is 0 for `min` and 1 for `max`.
     *
     * @method Math#random
     * @param {number} min - The minimum value. Must be a Number.
     * @param {number} max - The maximum value. Must be a Number.
     * @return {number} A floating point number between min (inclusive) and max (exclusive).
     */
  random (min, max) {
    if (min === undefined) { min = 0; }
    if (max === undefined) { max = 1; }

    if (min === max) {
      return min;
    }

    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }

    return (Math.random() * (max - min) + min);
  },

  /**
     * Returns a random integer in the range `[min, max]`. If these parameters are not in order than they will be put in order.
     * Default is 0 for `min` and 1 for `max`.
     *
     * @method Math#between
     * @param {number} min - The minimum value. Must be a Number.
     * @param {number} max - The maximum value. Must be a Number.
     * @return {number} An integer between min (inclusive) and max (inclusive).
     */
  between (min, max) {
    if (min === undefined) { min = 0; }
    if (max === undefined) { max = 1; }

    if (min === max) {
      return min;
    }

    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }

    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
     * Two number are fuzzyEqual if their difference is less than epsilon.
     *
     * @method Math#fuzzyEqual
     * @param {number} a - The first number to compare.
     * @param {number} b - The second number to compare.
     * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
     * @return {boolean} True if |a-b|<epsilon
     */
  fuzzyEqual (a, b, epsilon) {
    if (epsilon === undefined) { epsilon = 0.0001; }

    return Math.abs(a - b) < epsilon;
  },

  /**
     * `a` is fuzzyLessThan `b` if it is less than b + epsilon.
     *
     * @method Math#fuzzyLessThan
     * @param {number} a - The first number to compare.
     * @param {number} b - The second number to compare.
     * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
     * @return {boolean} True if a<b+epsilon
     */
  fuzzyLessThan (a, b, epsilon) {
    if (epsilon === undefined) { epsilon = 0.0001; }

    return a < b + epsilon;
  },

  /**
     * `a` is fuzzyGreaterThan `b` if it is more than b - epsilon.
     *
     * @method Math#fuzzyGreaterThan
     * @param {number} a - The first number to compare.
     * @param {number} b - The second number to compare.
     * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
     * @return {boolean} True if a>b+epsilon
     */
  fuzzyGreaterThan (a, b, epsilon) {
    if (epsilon === undefined) { epsilon = 0.0001; }

    return a > b - epsilon;
  },

  /**
     * Applies a fuzzy ceil to the given value.
     *
     * @method Math#fuzzyCeil
     * @param {number} val - The value to ceil.
     * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
     * @return {number} ceiling(val-epsilon)
     */
  fuzzyCeil (val, epsilon) {
    if (epsilon === undefined) { epsilon = 0.0001; }

    return Math.ceil(val - epsilon);
  },

  /**
     * Applies a fuzzy floor to the given value.
     *
     * @method Math#fuzzyFloor
     * @param {number} val - The value to floor.
     * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
     * @return {number} floor(val+epsilon)
     */
  fuzzyFloor (val, epsilon) {
    if (epsilon === undefined) { epsilon = 0.0001; }

    return Math.floor(val + epsilon);
  },

  /**
     * Averages all values passed to the function and returns the result.
     *
     * @method Math#average
     * @params {...number} The numbers to average
     * @return {number} The average of all given values.
     */
  average (...args) {
    let sum = 0;
    const len = args.length;

    for (let i = 0; i < len; i++) {
      sum += args[i];
    }

    return sum / len;
  },

  /**
     * @method Math#shear
     * @param {number} n
     * @return {number} n mod 1
     */
  shear (n) {
    return n % 1;
  },

  /**
     * Snap a value to nearest grid slice, using rounding.
     *
     * Example: if you have an interval gap of 5 and a position of 12... you will snap to 10 whereas 14 will snap to 15.
     *
     * @method Math#snapTo
     * @param {number} input - The value to snap.
     * @param {number} gap - The interval gap of the grid.
     * @param {number} [start=0] - Optional starting offset for gap.
     * @return {number} The snapped value.
     */
  snapTo (input, gap, start) {
    if (start === undefined) { start = 0; }

    if (gap === 0) {
      return input;
    }

    input -= start;
    input = gap * Math.round(input / gap);

    return start + input;
  },

  /**
     * Snap a value to nearest grid slice, using floor.
     *
     * Example: if you have an interval gap of 5 and a position of 12... you will snap to 10.
     * As will 14 snap to 10... but 16 will snap to 15.
     *
     * @method Math#snapToFloor
     * @param {number} input - The value to snap.
     * @param {number} gap - The interval gap of the grid.
     * @param {number} [start=0] - Optional starting offset for gap.
     * @return {number} The snapped value.
     */
  snapToFloor (input, gap, start) {
    if (start === undefined) { start = 0; }

    if (gap === 0) {
      return input;
    }

    input -= start;
    input = gap * Math.floor(input / gap);

    return start + input;
  },

  /**
     * Snap a value to nearest grid slice, using ceil.
     *
     * Example: if you have an interval gap of 5 and a position of 12... you will snap to 15.
     * As will 14 will snap to 15... but 16 will snap to 20.
     *
     * @method Math#snapToCeil
     * @param {number} input - The value to snap.
     * @param {number} gap - The interval gap of the grid.
     * @param {number} [start=0] - Optional starting offset for gap.
     * @return {number} The snapped value.
     */
  snapToCeil (input, gap, start) {
    if (start === undefined) { start = 0; }

    if (gap === 0) {
      return input;
    }

    input -= start;
    input = gap * Math.ceil(input / gap);

    return start + input;
  },

  /**
     * Round to some place comparative to a `base`, default is 10 for decimal place.
     * The `place` is represented by the power applied to `base` to get that place.
     *
     *     e.g. 2000/7 ~= 285.714285714285714285714 ~= (bin)100011101.1011011011011011
     *
     *     roundTo(2000/7,3) === 0
     *     roundTo(2000/7,2) === 300
     *     roundTo(2000/7,1) === 290
     *     roundTo(2000/7,0) === 286
     *     roundTo(2000/7,-1) === 285.7
     *     roundTo(2000/7,-2) === 285.71
     *     roundTo(2000/7,-3) === 285.714
     *     roundTo(2000/7,-4) === 285.7143
     *     roundTo(2000/7,-5) === 285.71429
     *
     *     roundTo(2000/7,3,2)  === 288       -- 100100000
     *     roundTo(2000/7,2,2)  === 284       -- 100011100
     *     roundTo(2000/7,1,2)  === 286       -- 100011110
     *     roundTo(2000/7,0,2)  === 286       -- 100011110
     *     roundTo(2000/7,-1,2) === 285.5     -- 100011101.1
     *     roundTo(2000/7,-2,2) === 285.75    -- 100011101.11
     *     roundTo(2000/7,-3,2) === 285.75    -- 100011101.11
     *     roundTo(2000/7,-4,2) === 285.6875  -- 100011101.1011
     *     roundTo(2000/7,-5,2) === 285.71875 -- 100011101.10111
     *
     * Note what occurs when we round to the 3rd space (8ths place), 100100000, this is to be assumed
     * because we are rounding 100011.1011011011011011 which rounds up.
     *
     * @method Math#roundTo
     * @param {number} value - The value to round.
     * @param {number} [place=0] - The place to round to.
     * @param {number} [base=10] - The base to round in. Default is 10 for decimal.
     * @return {number} The rounded value.
     */
  roundTo (value, place, base) {
    if (place === undefined) { place = 0; }
    if (base === undefined) { base = 10; }

    const p = base ** -place;

    return Math.round(value * p) / p;
  },

  /**
     * Floors to some place comparative to a `base`, default is 10 for decimal place.
     * The `place` is represented by the power applied to `base` to get that place.
     *
     * @method Math#floorTo
     * @param {number} value - The value to round.
     * @param {number} [place=0] - The place to round to.
     * @param {number} [base=10] - The base to round in. Default is 10 for decimal.
     * @return {number} The rounded value.
     */
  floorTo (value, place, base) {
    if (place === undefined) { place = 0; }
    if (base === undefined) { base = 10; }

    const p = base ** -place;

    return Math.floor(value * p) / p;
  },

  /**
     * Ceils to some place comparative to a `base`, default is 10 for decimal place.
     * The `place` is represented by the power applied to `base` to get that place.
     *
     * @method Math#ceilTo
     * @param {number} value - The value to round.
     * @param {number} [place=0] - The place to round to.
     * @param {number} [base=10] - The base to round in. Default is 10 for decimal.
     * @return {number} The rounded value.
     */
  ceilTo (value, place, base) {
    if (place === undefined) { place = 0; }
    if (base === undefined) { base = 10; }

    const p = base ** -place;
    return Math.ceil(value * p) / p;
  },

  /**
     * Rotates currentAngle towards targetAngle, taking the shortest rotation distance.
     * The lerp argument is the amount to rotate by in this call.
     *
     * @method Math#rotateToAngle
     * @param {number} currentAngle - The current angle, in radians.
     * @param {number} targetAngle - The target angle to rotate to, in radians.
     * @param {number} [lerp=0.05] - The lerp value to add to the current angle.
     * @return {number} The adjusted angle.
     */
  rotateToAngle (currentAngle, targetAngle, lerp) {
    if (lerp === undefined) { lerp = 0.05; }

    if (currentAngle === targetAngle) {
      return currentAngle;
    }

    if (Math.abs(targetAngle - currentAngle) <= lerp || Math.abs(targetAngle - currentAngle) >= (Math.PI2 - lerp)) {
      currentAngle = targetAngle;
    } else {
      if (Math.abs(targetAngle - currentAngle) > Math.PI) {
        if (targetAngle < currentAngle) {
          targetAngle += Math.PI2;
        } else {
          targetAngle -= Math.PI2;
        }
      }

      if (targetAngle > currentAngle) {
        currentAngle += lerp;
      } else if (targetAngle < currentAngle) {
        currentAngle -= lerp;
      }
    }

    return currentAngle;
  },

  /**
     * Gets the shortest angle between `angle1` and `angle2`.
     * Both angles must be in the range -180 to 180, which is the same clamped
     * range that `sprite.angle` uses, so you can pass in two sprite angles to
     * this method, and get the shortest angle back between the two of them.
     *
     * The angle returned will be in the same range. If the returned angle is
     * greater than 0 then it's a counter-clockwise rotation, if < 0 then it's
     * a clockwise rotation.
     *
     * @method Math#getShortestAngle
     * @param {number} angle1 - The first angle. In the range -180 to 180.
     * @param {number} angle2 - The second angle. In the range -180 to 180.
     * @return {number} The shortest angle, in degrees. If greater than zero it's a counter-clockwise rotation.
     */
  getShortestAngle (angle1, angle2) {
    const difference = angle2 - angle1;

    if (difference === 0) {
      return 0;
    }

    const times = Math.floor((difference - (-180)) / 360);

    return difference - (times * 360);
  },

  /**
     * Find the angle of a segment from (x1, y1) -> (x2, y2).
     *
     * @method Math#angleBetween
     * @param {number} x1 - The x coordinate of the first value.
     * @param {number} y1 - The y coordinate of the first value.
     * @param {number} x2 - The x coordinate of the second value.
     * @param {number} y2 - The y coordinate of the second value.
     * @return {number} The angle, in radians.
     */
  angleBetween (x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  },

  /**
     * Find the angle of a segment from (x1, y1) -> (x2, y2).
     *
     * The difference between this method and Math.angleBetween is that this assumes the y coordinate travels
     * down the screen.
     *
     * @method Math#angleBetweenY
     * @param {number} x1 - The x coordinate of the first value.
     * @param {number} y1 - The y coordinate of the first value.
     * @param {number} x2 - The x coordinate of the second value.
     * @param {number} y2 - The y coordinate of the second value.
     * @return {number} The angle, in radians.
     */
  angleBetweenY (x1, y1, x2, y2) {
    return Math.atan2(x2 - x1, y2 - y1);
  },

  /**
     * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
     *
     * @method Math#angleBetweenPoints
     * @param {Point} point1 - The first point.
     * @param {Point} point2 - The second point.
     * @return {number} The angle between the two points, in radians.
     */
  angleBetweenPoints (point1, point2) {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x);
  },

  /**
     * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
     * @method Math#angleBetweenPointsY
     * @param {Point} point1
     * @param {Point} point2
     * @return {number} The angle, in radians.
     */
  angleBetweenPointsY (point1, point2) {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  },

  /**
     * Reverses an angle.
     * @method Math#reverseAngle
     * @param {number} angleRad - The angle to reverse, in radians.
     * @return {number} The reverse angle, in radians.
     */
  reverseAngle (angleRad) {
    return this.normalizeAngle(angleRad + Math.PI, true);
  },

  /**
     * Normalizes an angle to the [0,2pi) range.
     * @method Math#normalizeAngle
     * @param {number} angleRad - The angle to normalize, in radians.
     * @return {number} The angle, fit within the [0,2pi] range, in radians.
     */
  normalizeAngle (angleRad) {
    angleRad %= (2 * Math.PI);
    return angleRad >= 0 ? angleRad : angleRad + 2 * Math.PI;
  },

  /**
     * Adds the given amount to the value, but never lets the value go over the specified maximum.
     *
     * @method Math#maxAdd
     * @param {number} value - The value to add the amount to.
     * @param {number} amount - The amount to add to the value.
     * @param {number} max - The maximum the value is allowed to be.
     * @return {number} The new value.
     */
  maxAdd (value, amount, max) {
    return Math.min(value + amount, max);
  },

  /**
     * Subtracts the given amount from the value, but never lets the value go below the specified minimum.
     *
     * @method Math#minSub
     * @param {number} value - The base value.
     * @param {number} amount - The amount to subtract from the base value.
     * @param {number} min - The minimum the value is allowed to be.
     * @return {number} The new value.
     */
  minSub (value, amount, min) {
    return Math.max(value - amount, min);
  },

  /**
     * Ensures that the value always stays between min and max, by wrapping the value around.
     *
     * If `max` is not larger than `min` the result is 0.
     *
     * @method Math#wrap
     * @param {number} value - The value to wrap.
     * @param {number} min - The minimum the value is allowed to be.
     * @param {number} max - The maximum the value is allowed to be, should be larger than `min`.
     * @return {number} The wrapped value.
     */
  wrap (value, min, max) {
    const range = max - min;

    if (range <= 0) {
      return 0;
    }

    let result = (value - min) % range;

    if (result < 0) {
      result += range;
    }

    return result + min;
  },

  /**
     * Adds value to amount and ensures that the result always stays between 0 and max, by wrapping the value around.
     *
     * Values _must_ be positive integers, and are passed through Math.abs. See {@link Math#wrap} for an alternative.
     *
     * @method Math#wrapValue
     * @param {number} value - The value to add the amount to.
     * @param {number} amount - The amount to add to the value.
     * @param {number} max - The maximum the value is allowed to be.
     * @return {number} The wrapped value.
     */
  wrapValue (value, amount, max) {
    let diff;
    value = Math.abs(value);
    amount = Math.abs(amount);
    max = Math.abs(max);
    diff = (value + amount) % max;

    return diff;
  },

  /**
     * Returns true if the number given is odd.
     *
     * @method Math#isOdd
     * @param {integer} n - The number to check.
     * @return {boolean} True if the given number is odd. False if the given number is even.
     */
  isOdd (n) {
    // Does not work with extremely large values
    return !!(n & 1);
  },

  /**
     * Returns true if the number given is even.
     *
     * @method Math#isEven
     * @param {integer} n - The number to check.
     * @return {boolean} True if the given number is even. False if the given number is odd.
     */
  isEven (n) {
    // Does not work with extremely large values
    return !(n & 1);
  },

  /**
     * Variation of Math.min that can be passed either an array of numbers or the numbers as parameters.
     *
     * Prefer the standard `Math.min` function when appropriate.
     *
     * @method Math#min
     * @return {number} The lowest value from those given.
     * @see {@link http://jsperf.com/math-s-min-max-vs-homemade}
     */
  min (...args) {
    let data = args;
    if (args.length === 1 && typeof args[0] === 'object') {
      data = args[0];
    }
    let min = 0;
    for (let i = 1, len = data.length; i < len; i++) {
      if (data[i] < data[min]) {
        min = i;
      }
    }

    return data[min];
  },

  /**
     * Variation of Math.max that can be passed either an array of numbers or the numbers as parameters.
     *
     * Prefer the standard `Math.max` function when appropriate.
     *
     * @method Math#max
     * @return {number} The largest value from those given.
     * @see {@link http://jsperf.com/math-s-min-max-vs-homemade}
     */
  max (...args) {
    let data = args;
    if (args.length === 1 && typeof args[0] === 'object') {
      data = args[0];
    }
    let max = 0;
    for (let i = 1, len = data.length; i < len; i++) {
      if (data[i] > data[max]) {
        max = i;
      }
    }

    return data[max];
  },

  /**
     * Keeps an angle value between -180 and +180; or -PI and PI if radians.
     *
     * @method Math#wrapAngle
     * @param {number} angle - The angle value to wrap
     * @param {boolean} [radians=false] - Set to `true` if the angle is given in radians, otherwise degrees is expected.
     * @return {number} The new angle value; will be the same as the input angle if it was within bounds.
     */
  wrapAngle (angle, radians) {
    return radians ? this.wrap(angle, -Math.PI, Math.PI) : this.wrap(angle, -180, 180);
  },

  /**
     * A Linear Interpolation Method, mostly used by Tween.
     *
     * @method Math#linearInterpolation
     * @param {Array} v - The input array of values to interpolate between.
     * @param {number} k - The percentage of interpolation, between 0 and 1.
     * @return {number} The interpolated value
     */
  linearInterpolation (v, k) {
    const m = v.length - 1;
    const f = m * k;
    const i = Math.floor(f);

    if (k < 0) {
      return this.linear(v[0], v[1], f);
    }

    if (k > 1) {
      return this.linear(v[m], v[m - 1], m - f);
    }

    return this.linear(v[i], v[i + 1 > m ? m : i + 1], f - i);
  },

  /**
     * A Bezier Interpolation Method, mostly used by Tween.
     *
     * @method Math#bezierInterpolation
     * @param {Array} v - The input array of values to interpolate between.
     * @param {number} k - The percentage of interpolation, between 0 and 1.
     * @return {number} The interpolated value
     */
  bezierInterpolation (v, k) {
    let b = 0;
    const n = v.length - 1;

    for (let i = 0; i <= n; i++) {
      b += ((1 - k) ** (n - i)) * (k ** i) * v[i] * this.bernstein(n, i);
    }

    return b;
  },

  /**
     * A Catmull Rom Interpolation Method, mostly used by Tween.
     *
     * @method Math#catmullRomInterpolation
     * @param {Array} v - The input array of values to interpolate between.
     * @param {number} k - The percentage of interpolation, between 0 and 1.
     * @return {number} The interpolated value
     */
  catmullRomInterpolation (v, k) {
    const m = v.length - 1;
    let f = m * k;
    let i = Math.floor(f);

    if (v[0] === v[m]) {
      if (k < 0) {
        i = Math.floor(f = m * (1 + k));
      }

      return this.catmullRom(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
    }

    if (k < 0) {
      return v[0] - (this.catmullRom(v[0], v[0], v[1], v[1], -f) - v[0]);
    }

    if (k > 1) {
      return v[m] - (this.catmullRom(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
    }

    return this.catmullRom(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
  },

  /**
     * Calculates a linear (interpolation) value over t.
     *
     * @method Math#linear
     * @param {number} p0
     * @param {number} p1
     * @param {number} t - A value between 0 and 1.
     * @return {number}
     */
  linear (p0, p1, t) {
    return (p1 - p0) * t + p0;
  },

  /**
     * @method Math#bernstein
     * @protected
     * @param {number} n
     * @param {number} i
     * @return {number}
     */
  bernstein (n, i) {
    return this.factorial(n) / this.factorial(i) / this.factorial(n - i);
  },

  /**
     * @method Math#factorial
     * @param {number} value - the number you want to evaluate
     * @return {number}
     */
  factorial (value) {
    if (value === 0) {
      return 1;
    }

    let res = value;

    while (--value) {
      res *= value;
    }

    return res;
  },

  /**
     * Calculates a catmum rom value.
     *
     * @method Math#catmullRom
     * @protected
     * @param {number} p0
     * @param {number} p1
     * @param {number} p2
     * @param {number} p3
     * @param {number} t
     * @return {number}
     */
  catmullRom (p0, p1, p2, p3, t) {
    const v0 = (p2 - p0) * 0.5; const v1 = (p3 - p1) * 0.5; const t2 = t * t; const
      t3 = t * t2;

    return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
  },

  /**
     * The absolute difference between two values.
     *
     * @method Math#difference
     * @param {number} a - The first value to check.
     * @param {number} b - The second value to check.
     * @return {number} The absolute difference between the two values.
     */
  difference (a, b) {
    return Math.abs(a - b);
  },

  /**
     * Round to the next whole number _away_ from zero.
     *
     * @method Math#roundAwayFromZero
     * @param {number} value - Any number.
     * @return {integer} The rounded value of that number.
     */
  roundAwayFromZero (value) {
    // "Opposite" of truncate.
    return (value > 0) ? Math.ceil(value) : Math.floor(value);
  },

  /**
     * Generate a sine and cosine table simultaneously and extremely quickly.
     * The parameters allow you to specify the length, amplitude and frequency of the wave.
     * This generator is fast enough to be used in real-time.
     * Code based on research by Franky of scene.at
     *
     * @method Math#sinCosGenerator
     * @param {number} length - The length of the wave
     * @param {number} sinAmplitude - The amplitude to apply to the sine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
     * @param {number} cosAmplitude - The amplitude to apply to the cosine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
     * @param {number} frequency  - The frequency of the sine and cosine table data
     * @return {{sin:number[], cos:number[]}} Returns the table data.
     */
  sinCosGenerator (length, sinAmplitude, cosAmplitude, frequency) {
    if (sinAmplitude === undefined) { sinAmplitude = 1.0; }
    if (cosAmplitude === undefined) { cosAmplitude = 1.0; }
    if (frequency === undefined) { frequency = 1.0; }

    let sin = sinAmplitude;
    let cos = cosAmplitude;
    const frq = frequency * Math.PI / length;

    const cosTable = [];
    const sinTable = [];

    for (let c = 0; c < length; c++) {
      cos -= sin * frq;
      sin += cos * frq;

      cosTable[c] = cos;
      sinTable[c] = sin;
    }

    return { sin: sinTable, cos: cosTable, length };
  },

  /**
     * Returns the length of the hypotenuse connecting two segments of given lengths.
     *
     * @method Math#hypot
     * @param {number} a
     * @param {number} b
     * @return {number} The length of the hypotenuse connecting the given lengths.
     */
  hypot (a, b) {
    return Math.sqrt(a * a + b * b);
  },

  /**
     * Returns the euclidian distance between the two given set of coordinates.
     *
     * @method Math#distance
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @return {number} The distance between the two sets of coordinates.
     */
  distance (x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
  },

  /**
     * Returns the euclidean distance squared between the two given set of
     * coordinates (cuts out a square root operation before returning).
     *
     * @method Math#distanceSq
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @return {number} The distance squared between the two sets of coordinates.
     */
  distanceSq (x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;

    return dx * dx + dy * dy;
  },

  /**
     * Returns the distance between the two given set of coordinates at the power given.
     *
     * @method Math#distancePow
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} [pow=2]
     * @return {number} The distance between the two sets of coordinates.
     */
  distancePow (x1, y1, x2, y2, pow) {
    if (pow === undefined) { pow = 2; }

    return Math.sqrt(((x2 - x1) ** pow) + ((y2 - y1) ** pow));
  },

  /**
     * Force a value within the boundaries by clamping it to the range `min`, `max`.
     *
     * @method Math#clamp
     * @param {float} v - The value to be clamped.
     * @param {float} min - The minimum bounds.
     * @param {float} max - The maximum bounds.
     * @return {number} The clamped value.
     */
  clamp (v, min, max) {
    if (v < min) {
      return min;
    }
    if (max < v) {
      return max;
    }

    return v;
  },

  /**
     * Clamp `x` to the range `[a, Infinity)`.
     * Roughly the same as `Math.max(x, a)`, except for NaN handling.
     *
     * @method Math#clampBottom
     * @param {number} x
     * @param {number} a
     * @return {number}
     */
  clampBottom (x, a) {
    return x < a ? a : x;
  },

  /**
     * Checks if two values are within the given tolerance of each other.
     *
     * @method Math#within
     * @param {number} a - The first number to check
     * @param {number} b - The second number to check
     * @param {number} tolerance - The tolerance. Anything equal to or less than this is considered within the range.
     * @return {boolean} True if a is <= tolerance of b.
     * @see {@link Math.fuzzyEqual}
     */
  within (a, b, tolerance) {
    return (Math.abs(a - b) <= tolerance);
  },

  /**
     * Linear mapping from range <a1, a2> to range <b1, b2>
     *
     * @method Math#mapLinear
     * @param {number} x - The value to map
     * @param {number} a1 - First endpoint of the range <a1, a2>
     * @param {number} a2 - Final endpoint of the range <a1, a2>
     * @param {number} b1 - First endpoint of the range <b1, b2>
     * @param {number} b2 - Final endpoint of the range  <b1, b2>
     * @return {number}
     */
  mapLinear (x, a1, a2, b1, b2) {
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
  },

  /**
     * Smoothstep function as detailed at http://en.wikipedia.org/wiki/Smoothstep
     *
     * @method Math#smoothstep
     * @param {float} x - The input value.
     * @param {float} min - The left edge. Should be smaller than the right edge.
     * @param {float} max - The right edge.
     * @return {float} A value between 0 and 1.
     */
  smoothstep (x, min, max) {
    // Scale, bias and saturate x to 0..1 range
    x = Math.max(0, Math.min(1, (x - min) / (max - min)));

    // Evaluate polynomial
    return x * x * (3 - 2 * x);
  },

  /**
     * Smootherstep function as detailed at http://en.wikipedia.org/wiki/Smoothstep
     *
     * @method Math#smootherstep
     * @param {float} x - The input value.
     * @param {float} min - The left edge. Should be smaller than the right edge.
     * @param {float} max - The right edge.
     * @return {float} A value between 0 and 1.
     */
  smootherstep (x, min, max) {
    x = Math.max(0, Math.min(1, (x - min) / (max - min)));

    return x * x * x * (x * (x * 6 - 15) + 10);
  },

  /**
     * A value representing the sign of the value: -1 for negative, +1 for positive, 0 if value is 0.
     *
     * This works differently from `Math.sign` for values of NaN and -0, etc.
     *
     * @method Math#sign
     * @param {number} x
     * @return {integer} An integer in {-1, 0, 1}
     */
  sign (x) {
    return (x < 0) ? -1 : ((x > 0) ? 1 : 0);
  },

  /**
     * Work out what percentage value `a` is of value `b` using the given base.
     *
     * @method Math#percent
     * @param {number} a - The value to work out the percentage for.
     * @param {number} b - The value you wish to get the percentage of.
     * @param {number} [base=0] - The base value.
     * @return {number} The percentage a is of b, between 0 and 1.
     */
  percent (a, b, base) {
    if (base === undefined) { base = 0; }

    if (a > b || base > b) {
      return 1;
    }
    if (a < base || base > a) {
      return 0;
    }

    return (a - base) / b;
  }
};

export default math;

/**
 * Created by luocf on 2020/9/21.
 */
function Velocity() {
  this.positionQueue = [];
  this.timeQueue = [];
}

Velocity.prototype.reset = function() {
  this.positionQueue = [];
  this.timeQueue = [];
};

Velocity.prototype.pruneQueue = function(ms) {
  // pull old values off of the queue
  while (this.timeQueue.length && this.timeQueue[0] < (Date.now() - ms)) {
    this.timeQueue.shift();
    this.positionQueue.shift();
  }
};

Velocity.prototype.updatePosition = function(position) {
  this.positionQueue.push(position);
  this.timeQueue.push(Date.now());
  this.pruneQueue(50);
};

Velocity.prototype.getVelocity = function() {
  this.pruneQueue(1000);
  const length = this.timeQueue.length;
  if (length < 2) return 0;

  const time = (this.timeQueue[length - 1] - this.timeQueue[0]) / 1000;
  const distance = this.positionQueue[length - 1] - this.positionQueue[0];

  console.log(`getVelocity distance:${distance}， time：${time}, velocity:${distance / time}， this.timeQueue[length-1]：${this.timeQueue[length - 1]}, this.timeQueue[0]:${this.timeQueue[0]}`);
  return distance / time;
};
module.exports = Velocity;
module.exports = (client) => {};
// Rolling mechanism
const rollBox = (weight, message) => {
  let sum = 0;
  // loop through
  weight.forEach(function (chances) {
    // sum add chances
    sum += chances;
  });
  // randomize
  let random = Math.random();
  let chances = 0;
  // if percent less than
  for (let result = 0; result < weight.length; result++) {
    // chance add weight of each item
    // selected by random
    chances += weight[result] / sum;
    // if random number generated is less than chance
    if (random < chances) {
      // return the reward base on order in array
      return result;
    }
  }
  // only needed if some weight is 0 or negative
  // just incase there are bugs to get out of the loop
  // never reach unless sum of probability less than 1
  return -1;
};
module.exports.rollBox = rollBox;

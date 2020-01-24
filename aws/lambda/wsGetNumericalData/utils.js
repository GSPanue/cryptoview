module.exports.createChunks = (array, maxSize) => {
  let results = [];

  while (array.length) {
      results.push(array.splice(0, maxSize));
  }

  return results;
}

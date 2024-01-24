
import React from 'react';
import data from "./data.json"



// calculation mean
function calculateMean(data, property) {
  const sum = data.reduce((acc, entry) => acc + entry[property], 0);
  return parseInt(sum) / data.length;
}
// calculation median
function calculateMedian(data, property) {
  const sortedData = data.map(entry => entry[property]).sort((a, b) => a - b);
  const middle = Math.floor(sortedData.length / 2);

  if (sortedData.length % 2 === 0) {
    return (sortedData[middle - 1] + sortedData[middle]) / 2;
  } else {
    return sortedData[middle];
  }
}

// calculation mode
function calculateMode(data, property) {
  const counts = {};
  let maxCount = 0;
  let mode = null;

  data.forEach(entry => {
    const value = entry[property];
    counts[value] = (counts[value] || 0) + 1;

    if (counts[value] > maxCount) {
      maxCount = counts[value];
      mode = value;
    }
  });

  return mode;
}

// Here we are calculate Alchol class wise ststs
function calculateClasswiseStats(data, property) {
  const classwiseData = {};

  data.forEach(entry => {
    const alcoholClass = entry.Alcohol;

    if (!classwiseData[alcoholClass]) {
      classwiseData[alcoholClass] = [];
    }

    classwiseData[alcoholClass].push(entry);
  });

  const stats = {};

//   Iterate over the keys (alcohol classes) of the classwiseData object using for...in loop

  for (const alcoholClass in classwiseData) {
    const classData = classwiseData[alcoholClass];

    stats[alcoholClass] = {
      mean: calculateMean(classData, property),
      median: calculateMedian(classData, property),
      mode: calculateMode(classData, property),
    };
  }

  return stats;
}

// Calculate gama and insert it into each object with the use of spread operater
function calculateGamma(data) {
  return data.map(entry => ({
    ...entry,
    Gamma: (entry.Ash * entry.Hue) / entry.Magnesium,
  }));
}

const dataWithGamma = calculateGamma(data);
const flavanoidsStats = calculateClasswiseStats(data, 'Flavanoids');
console.log(flavanoidsStats)
const gammaStats = calculateClasswiseStats(dataWithGamma, 'Gamma');

function DisplayTable(stats, property) {
  return (
    <table>
      <thead>
        <tr>
          <th>Measure</th>
          {Object.keys(stats).map(alcoholClass => (
            <th key={alcoholClass}>Class {alcoholClass}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{property} Mean</td>
          {Object.keys(stats).map(alcoholClass => (
            <td key={alcoholClass}>{stats[alcoholClass].mean.toFixed(3)}</td>
          ))}
        </tr>
        <tr>
          <td>{property} Median</td>
          {Object.keys(stats).map(alcoholClass => (
            <td key={alcoholClass}>{stats[alcoholClass].median.toFixed(3)}</td>
          ))}
        </tr>
        <tr>
          <td>{property} Mode</td>
          {Object.keys(stats).map(alcoholClass => (
            <td key={alcoholClass}>{stats[alcoholClass].mode.toFixed(3)}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

function Calculation() {
  return (
    <div>
      <h1>Class-wise Flavanoids Statistics</h1>
      {DisplayTable(flavanoidsStats, 'Flavanoids')}
      <h1>Class-wise Gamma Statistics</h1>
      {DisplayTable(gammaStats, 'Gamma')}
    </div>
  );
}

export default Calculation;



import React from "react";

// Segment data (all 48 rects, fill applied dynamically)
const SEGMENTS = [
  { props: { y: "76.5234", width: "19.2455", height: "6.41516", rx: "3.20758" } },
  { props: { x: "2.71582", y: "64.6104", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(7.91 2.71582 64.6104)" } },
  { props: { x: "6.24268", y: "53.3008", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(14.91 6.24268 53.3008)" } },
  { props: { x: "12.3247", y: "42.1562", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(24.91 12.3247 42.1562)" } },
  { props: { x: "17.9585", y: "33.9082", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(30.91 17.9585 33.9082)" } },
  { props: { x: "25.478", y: "25.6611", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(37.91 25.478 25.6611)" } },
  { props: { x: "33.0176", y: "18.7871", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(45.91 33.0176 18.7871)" } },
  { props: { x: "43.0098", y: "12.3721", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(57.91 43.0098 12.3721)" } },
  { props: { x: "51.4819", y: "7.78906", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(61.91 51.4819 7.78906)" } },
  { props: { x: "62.0356", y: "4.12305", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(72.91 62.0356 4.12305)" } },
  { props: { x: "72.2793", y: "1.83203", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(78.91 72.2793 1.83203)" } },
  { props: { x: "83.8384", y: "0.458008", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(85.91 83.8384 0.458008)" } },
  { props: { x: "94.1846", y: "0.548828", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(94.91 94.1846 0.548828)" } },
  { props: { x: "105.56", y: "2.24023", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(101.91 105.56 2.24023)" } },
  { props: { x: "114.695", y: "4.65723", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(107.91 114.695 4.65723)" } },
  { props: { x: "124.78", y: "8.72266", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(114.91 124.78 8.72266)" } },
  { props: { x: "135.108", y: "14.9385", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(127.91 135.108 14.9385)" } },
  { props: { x: "143.533", y: "21.6387", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(136.91 143.533 21.6387)" } },
  { props: { x: "151.596", y: "29.6602", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(146.91 151.596 29.6602)" } },
  { props: { x: "158.927", y: "37.4502", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(146.91 158.927 37.4502)" } },
  { props: { x: "164.396", y: "46.4932", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(152.91 164.396 46.4932)" } },
  { props: { x: "169.073", y: "55.6211", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(157.91 169.073 55.6211)" } },
  { props: { x: "172.87", y: "66.6172", width: "19.2455", height: "6.41516", rx: "3.20758", transform: "rotate(162.91 172.87 66.6172)" } },
  { props: { x: "174.599", y: "77.0156", width: "19.2455", height: "6.41515", rx: "3.20758", transform: "rotate(169.91 174.599 77.0156)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(1 0 0 -1 0 93.4766)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(0.990485 -0.137617 -0.137617 -0.990485 2.71582 105.39)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(0.966331 -0.257301 -0.257301 -0.966331 6.24268 116.699)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(0.906971 -0.421194 -0.421194 -0.906971 12.3247 127.844)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(0.857975 -0.513691 -0.513691 -0.857975 17.9585 136.092)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(0.788977 -0.614423 -0.614423 -0.788977 25.478 144.339)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(0.695787 -0.718248 -0.718248 -0.695787 33.0176 151.213)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(0.531251 -0.847215 -0.847215 -0.531251 43.0098 157.628)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(0.470858 -0.882209 -0.882209 -0.470858 51.4819 162.211)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(0.293873 -0.955844 -0.955844 -0.293873 62.0356 165.877)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(0.192351 -0.981326 -0.981326 -0.192351 72.2793 168.168)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(0.0713234 -0.997453 -0.997453 -0.0713234 83.8384 169.542)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(-0.0855908 -0.99633 -0.99633 0.0855908 94.1846 169.451)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(-0.206375 -0.978473 -0.978473 0.206375 105.56 167.76)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(-0.307523 -0.951541 -0.951541 0.307523 114.695 165.343)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(-0.421194 -0.90697 -0.90697 0.421194 124.78 161.277)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(-0.614423 -0.788977 -0.788977 0.614423 135.108 155.062)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(-0.730281 -0.683146 -0.683146 0.730281 143.533 148.361)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(-0.837814 -0.545956 -0.545956 0.837814 151.596 140.34)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(-0.837814 -0.545956 -0.545956 0.837814 158.927 132.55)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(-0.890292 -0.455389 -0.455389 0.890292 164.396 123.507)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(-0.926594 -0.376062 -0.376062 0.926594 169.073 114.379)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(-0.955844 -0.293873 -0.293873 0.955844 172.87 104.758)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(-0.984533 -0.175195 -0.175195 0.984533 174.599 93.9004)" } },
  { props: { width: "19.2455", height: "6.41516", rx: "3.20758", transform: "matrix(-0.999819 -0.0190229 -0.0190229 0.999819 175.515 82.0078)" } },
];

// You can adjust these colors as needed:
const FILLED_COLOR = "#0584FE"; // blue
const EMPTY_COLOR = "#EDF3FF";  // white (or pale blue/gray)

export default function CircularProgressSVG({ percent = 40, filledColor = FILLED_COLOR, emptyColor = EMPTY_COLOR, width = 176, height = 170 }) {
  const total = SEGMENTS.length;
  const filledCount = Math.round((percent / 100) * total);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 176 170" fill="none">
      {SEGMENTS.map((seg, i) => (
        <rect
          key={i}
          {...seg.props}
          fill={i < filledCount ? filledColor : emptyColor}
        />
      ))}
    </svg>
  );
}

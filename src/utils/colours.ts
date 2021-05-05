import { Color } from '@material-ui/lab/Alert';
import { CommonColors } from '@material-ui/core/styles/createPalette';

interface color {
  [key: string]: string;
}

export const colors: color = {
  a: '#ffbc58',
  b: '#420420',
  c: '#bada55',
  d: '#002060',
  e: '#d3ffce',
  f: '#b6fcd5',
  g: '#b4eeb4',
  h: '#a0db8e',
  i: '#00ff00',
  j: '#7f00ff',
  k: '#d4af37',
  l: '#094276',
  m: '#505c5e',
  n: '#000000',
  o: '#317256',
  p: '#FFE3E3',
  q: '#99cccc',
  r: '#954bff',
  s: '#D1EAFF',
  t: '#d9a0c6',
  u: '#d0a0d9',
  v: '#a9d9a0',
  w: '#024500',
  x: '#301d12',
  y: '#596e78',
  z: '#a8d3ee',
};

export const getColorCode = (color: string) => colors[color];

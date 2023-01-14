import * as React from 'react';
import { Image, View } from 'react-native';

const GRID = Array(8).fill(0);

function background(x: number, y: number) {
  return (x + y) % 2 === 0 ? '#FFDEAD' : '#DFB787';
}

export function Board({ size, top, left }: { size: number, top: number, left: number }) {
  return (
    <View style={{ borderWidth: 2, position: 'absolute', top, left }}>
      {GRID.map((_, y) => (
        <View key={y} style={{ height: size, flexDirection: 'row' }}>
          {GRID.map((_, x) => (
          <View
            key={x}
            style={{
              width: size,
              height: size,
              backgroundColor: background(x, y),
            }}
          />
          ))}
        </View>
      ))}
      <Image source={require('../../assets/bq.png')} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: size * 0.8,
        height: size * 0.8,
      }} />
    </View>
  );
}

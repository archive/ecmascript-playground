test('object entries', () => {
  const fruit = {
    [Symbol()]: 1,
    'type': 'banana',
    'color': 'yellow'
  };

  const result = Object.entries(fruit);

  expect(result).toEqual([
    ['type', 'banana'],
    ['color', 'yellow']
  ]);
});

test('object values', () => {
  const fruit = {
    [Symbol()]: 1,
    'type': 'banana',
    'color': 'yellow'
  };

  const result = Object.values(fruit);

  expect(result).toEqual(['banana', 'yellow']);
});
test('string padding start', () => {
  const one = '1'.padStart(3, 0);
  const ten = '10'.padStart(3, 0);
  const hundred = '100'.padStart(3, 0);

  expect(one).toBe('001');
  expect(ten).toBe('010');
  expect(hundred).toBe('100');
});

test('string padding end', () => {
  const one = '1'.padEnd(3, ' ');
  const ten = '10'.padEnd(3, ' ');
  const hundred = '100'.padEnd(3, ' ');

  expect(one).toBe('1  ');
  expect(ten).toBe('10 ');
  expect(hundred).toBe('100');
});

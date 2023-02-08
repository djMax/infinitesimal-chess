interface ListElement {
  value: number;
  rest: ListElement | undefined;
}

function arrayToList(array: number[]): ListElement | undefined {
  if (array.length === 0) {
    return undefined;
  }

  const [first, ...rest] = array;
  return {
    value: first,
    rest: arrayToList(rest),
  };
}

function listToArray(list: ListElement | undefined): number[] {
  if (!list) {
    return [];
  }
  return [list.value, ...listToArray(list.rest)];
}

function sort(list: ListElement): ListElement {
  if (!list.rest) {
    return list;
  }
  return insertWhenLess(sort(list.rest), list.value);
}

function insertWhenLess(list: ListElement | undefined, value: number): ListElement {
  if (!list || value < list.value) {
    return {
      value,
      rest: list,
    };
  }
  return {
    value: list.value,
    rest: insertWhenLess(list.rest, value),
  };
}

describe('List sort', () => {
  it('should make a list', () => {
    const list = arrayToList([1, 8, 2, 9, 3, 5]);
    const sorted = sort(list!);
    console.log(listToArray(sorted));
  });
});
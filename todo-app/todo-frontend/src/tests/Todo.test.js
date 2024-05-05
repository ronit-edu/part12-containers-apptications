import React from 'react';
import { render } from '@testing-library/react';
import "@testing-library/jest-dom";
import Todo from '../Todos/Todo';

test('render todo', () => {
  const todo = {text: "todoText", done: false}
  const doneInfo = "doneInfo"
  const notDoneInfo = "notDoneInfo"
  const { getByText } = render(<Todo todo={todo} doneInfo={doneInfo} notDoneInfo={notDoneInfo} />);
  expect(getByText("todoText")).toBeInTheDocument()
  expect(getByText("notDoneInfo")).toBeInTheDocument()
});
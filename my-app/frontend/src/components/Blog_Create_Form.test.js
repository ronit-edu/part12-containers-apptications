import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog_Create_Form from "./Blog_Create_Form";

test("renders blog with title and author", async () => {
  const blog = {
    title: "Ls oalst",
    author: "Epr Konnsn",
    url: "http://lst.com",
  };

  const create_blog = jest.fn();
  const user = userEvent.setup();

  const container = render(<Blog_Create_Form create_blog={create_blog} />).container;

  const title_input = container.querySelector("#title_input");
  const author_input = container.querySelector("#author_input");
  const url_input = container.querySelector("#url_input");
  const submit_button = screen.getByText("create");

  await user.type(title_input, blog.title);
  await user.type(author_input, blog.author);
  await user.type(url_input, blog.url);
  await user.click(submit_button);

  expect(create_blog.mock.calls[0][0].title).toBe(blog.title);
  expect(create_blog.mock.calls[0][0].author).toBe(blog.author);
  expect(create_blog.mock.calls[0][0].url).toBe(blog.url);
});
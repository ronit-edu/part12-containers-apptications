import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders blog with title and author", () => {
  const blog = {
    title: "Ls oalst",
    author: "Epr Konnsn",
    url: "http://lst.com",
    likes: 42,
    user: {
      username: "pertti",
      name: "Pertti Penanen",
      id: "65b7ad7a77bde3365f4caa51"
    },
    id: "65be4f80cc2a2ee8c723710d"
  };

  render(<Blog blog={blog} />);
  const title = screen.getByText("Ls oalst", {exact: false});
  const author = screen.getByText("Epr Konnsn", {exact: false});
  const url = screen.queryByText("http://lst.com");
  const likes = screen.queryByText("42");
  expect(title).toBeDefined();
  expect(author).toBeDefined();
  expect(url).toBeNull();
  expect(likes).toBeNull();
});

test("renders blog with title, author, url, likes after view button clicked", async () => {
  const blog = {
    title: "Ls oalst",
    author: "Epr Konnsn",
    url: "http://lst.com",
    likes: 42,
    user: {
      username: "pertti",
      name: "Pertti Penanen",
      id: "65b7ad7a77bde3365f4caa51"
    },
    id: "65be4f80cc2a2ee8c723710d"
  };

  const current_user = {
    username: "pertti",
    name: "Pertti Penanen",
    id: "65b7ad7a77bde3365f4caa51"
  };

  render(<Blog blog={blog} user={current_user} />);

  const user = userEvent.setup();
  const view_button = screen.getByText("view");
  await user.click(view_button);

  const title = screen.getByText("Ls oalst", {exact: false});
  const author = screen.getByText("Epr Konnsn", {exact: false});
  const url = screen.getByText("http://lst.com");
  const likes = screen.getByText("42");
  expect(title).toBeDefined();
  expect(author).toBeDefined();
  expect(url).toBeDefined();
  expect(likes).toBeDefined();
});

test("like button calls event handler", async () => {
  const blog = {
    title: "Ls oalst",
    author: "Epr Konnsn",
    url: "http://lst.com",
    likes: 42,
    user: {
      username: "pertti",
      name: "Pertti Penanen",
      id: "65b7ad7a77bde3365f4caa51"
    },
    id: "65be4f80cc2a2ee8c723710d"
  };

  const current_user = {
    username: "pertti",
    name: "Pertti Penanen",
    id: "65b7ad7a77bde3365f4caa51"
  };

  const add_like = jest.fn();

  render(<Blog blog={blog} user={current_user} add_like={add_like}/>);

  const user = userEvent.setup();
  const view_button = screen.getByText("view");
  await user.click(view_button);

  const like_button = screen.getByText("like");
  await user.click(like_button);
  await user.click(like_button);

  expect(add_like.mock.calls).toHaveLength(2);
});
describe("Blog app", function() {
  beforeEach(function() {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    cy.create_user({
      username: "pertti",
      name: "Pertti Pasanen",
      password: "pertti1234"
    });
    cy.create_user({
      username: "elka",
      name: "Elka Elanen",
      password: "elka1234"
    });
    cy.visit("");
  });

  it("Login form is shown", function() {
    cy.contains("username");
    cy.contains("password");
  });

  describe("Login",function() {
    it("succeeds with correct credentials", function() {
      cy.get("input:first").type("pertti");
      cy.get("input:last").type("pertti1234");
      cy.get("#login_button").click();
      cy.contains("Pertti Pasanen logged in");

    });

    it("fails with wrong credentials", function() {
      cy.get("input:first").type("pertti");
      cy.get("input:last").type("wrong1234");
      cy.get("#login_button").click();
      cy.get(".error")
        .should("contain", "wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)");
    });
  });

  describe("When logged in", function() {
    beforeEach(function() {
      cy.login({
        username: "elka",
        password: "elka1234"
      });
      cy.create_blog({
        title: "lasgeselka",
        author: "mrelka",
        url: "http://elkaa.za"
      });
      cy.login({
        username: "pertti",
        password: "pertti1234"
      });
      cy.create_blog({
        title: "dailymall",
        author: "reporter",
        url: "http://hs.fi"
      });
      cy.create_blog({
        title: "mayoneyougey",
        author: "jarkko",
        url: "http://guthib.com"
      });
      cy.create_blog({
        title: "hasl",
        author: "lest",
        url: "http://lest.ge"
      });
    });

    it("A blog can be created", function() {
      cy.contains("new blog").click();
      cy.get("#title_input").type("pertti title");
      cy.get("#author_input").type("pertti author");
      cy.get("#url_input").type("pertti url");
      cy.get("button:contains('create')").click();
      cy.contains("pertti title pertti author");
    });

    it("A blog can be liked", function() {
      cy.contains("mayoneyougey")
        .contains("view").click();
      cy.contains("like").click();
      cy.contains("1");
    });
    it("A blog can be deleted by the creator", function() {
      cy.contains("mayoneyougey")
        .contains("view").click();
      cy.contains("remove").click();
      cy.get(".blog").contains("mayoneyougey").should("not.exist");
    });
    it("remove button not visible for not creators", function() {
      cy.contains("lasgeselka")
        .contains("view").click();
      cy.contains("remove").should("not.exist");
    });
    it("blogs are ordered by likes", function() {
      cy.contains("lasgeselka").contains("view").click();
      cy.contains("mayoneyougey").contains("view").click();

      cy.contains("lasgeselka").parent().find("button:contains('like')").click();
      cy.contains("mayoneyougey").parent().find("button:contains('like')").click();
      cy.contains("mayoneyougey").parent().find("button:contains('like')").click();
      cy.get(".blog").eq(0).should("contain", "mayoneyougey");
      cy.get(".blog").eq(1).should("contain", "lasgeselka");
    });
  });

});
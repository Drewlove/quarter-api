const knex = require("knex");
const app = require("../src/app");
const {
  makeRows,
  makeUpdatedRow,
  makeNewRow,
  makeMaliciousRow,
} = require("./departments.fixtures");
const { expect } = require("chai");

const config = {
  table: {
    name: "department",
    columns: ["department_name"],
    xssColumn: "department_name",
    updatedColumn: {
      department_name: "updated department name",
    },
  },
  endpoint: "/api/departments/test",
  userId: "1",
  rowIdName: "department_id",
};

describe(`${config.table.name} endpoints`, function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());
  before("clean the table", () =>
    db.raw(`TRUNCATE table ${config.table.name} RESTART IDENTITY CASCADE`)
  );

  afterEach("cleanup", () =>
    db.raw(`TRUNCATE table ${config.table.name} RESTART IDENTITY CASCADE`)
  );

  describe(`GET ${config.endpoint}`, () => {
    context(`Given no rows in table ${config.table.name}`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get(`${config.endpoint}/${config.userId}`)
          .expect(200, []);
      });
    });
  });

  context(
    `Given there are rows in table ${config.table.name} in the database`,
    () => {
      const testRows = makeRows();
      const filteredRowsById = testRows.filter(
        (row) => row.app_user_id === config.userId
      );
      beforeEach("insert rows", () => {
        return db.into(config.table.name).insert(testRows);
      });
      it("responds with 200 and all of the rows matching userId", () => {
        return supertest(app)
          .get(`${config.endpoint}/${config.userId}`)
          .expect(200, filteredRowsById);
      });
    }
  );

  context(`Given an XSS attack`, () => {
    const { maliciousRow, expectedRow } = makeMaliciousRow();
    beforeEach("insert malicious row", () => {
      return db.into(config.table.name).insert(maliciousRow);
    });

    it("removes XSS attack content", () => {
      return supertest(app)
        .get(`${config.endpoint}/${config.userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body[0][config.table.xssColumn]).to.eql(
            expectedRow[config.table.xssColumn]
          );
        });
    });
  });

  describe(`GET ${config.endpoint}/${config.userId}/:rowIdName`, () => {
    const rowIdName = 2;
    context(`Given no rows`, () => {
      it(`responds with 404`, () => {
        return supertest(app)
          .get(`${config.endpoint}/${config.userId}/${rowIdName}`)
          .expect(404, {
            error: {
              message: `Row from table: '${config.table.name}' doesn't exist`,
            },
          });
      });
    });

    context("Given there are rows in the database", () => {
      const rowIdName = 1;
      const testRows = makeRows();
      beforeEach("insert rows", () => {
        return db.into(config.table.name).insert(testRows);
      });
      it("responds with 200 and the specified row", () => {
        return supertest(app)
          .get(`${config.endpoint}/${config.userId}/${rowIdName}`)
          .expect(200, testRows[rowIdName - 1]);
      });
    });

    context("Given an XSS attack row", () => {
      const rowIdName = 1;
      const { maliciousRow, expectedRow } = makeMaliciousRow();
      beforeEach("insert malicious row", () => {
        return db.into(config.table.name).insert(maliciousRow);
      });
      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`${config.endpoint}/${config.userId}/${rowIdName}`)
          .expect(200)
          .expect((res) => {
            expect(res.body[config.table.xssColumn]).to.eql(
              expectedRow[config.table.xssColumn]
            );
          });
      });
    });
  });

  describe(`POST ${config.endpoint}/${config.userId}`, () => {
    const testRow = makeNewRow();
    it(`creates a row, responding with 201 and the new row`, () => {
      return supertest(app)
        .post(`${config.endpoint}/${config.userId}`)
        .send(testRow)
        .expect(201)
        .expect((res) => {
          Object.keys(res.body).forEach((key) => {
            expect(res.body[key]).to.eql(testRow[key]);
          });

          expect(res.body).to.have.property(`${config.rowIdName}`);
          expect(res.headers.location).to.eql(
            `${config.endpoint}/${config.userId}/${res.body[config.rowIdName]}`
          );
        })
        .then((res) =>
          supertest(app)
            .get(
              `${config.endpoint}/${config.userId}/${
                res.body[config.rowIdName]
              }`
            )
            .expect(res.body)
        );
    });

    config.table.columns.forEach((field) => {
      const newRow = makeNewRow();
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newRow[field];
        return supertest(app)
          .post(`${config.endpoint}/${config.userId}`)
          .send(newRow)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });

    it("removes XSS attack content from response", () => {
      const { maliciousRow, expectedRow } = makeMaliciousRow();
      return supertest(app)
        .post(`${config.endpoint}/${config.userId}`)
        .send(maliciousRow)
        .expect(201)
        .expect((res) => {
          expect(res.body[config.xss_column]).to.eql(
            expectedRow[config.xss_column]
          );
        });
    });
  });

  describe(`DELETE ${config.endpoint}/${config.userId}/1`, () => {
    context(`Given no rows`, () => {
      it(`responds with 404`, () => {
        const testrowIdName = 1;
        return supertest(app)
          .delete(`${config.endpoint}/${config.userId}/${testrowIdName}`)
          .expect(404, {
            error: {
              message: `Row from table: '${config.table.name}' doesn't exist`,
            },
          });
      });
    });

    context("Given there are rows in table", () => {
      const testRows = makeRows();
      beforeEach("insert rows", () => {
        return db.into(config.table.name).insert(testRows);
      });
      it("responds with 204 and removes the row", () => {
        const idToRemove = 1;
        return supertest(app)
          .delete(`${config.endpoint}/${config.userId}/${idToRemove}`)
          .expect(204)
          .then((res) => {
            const expectedRows = testRows.filter(
              (row) => row[config.table.rowIdName] !== idToRemove
            );
            supertest(app)
              .get(`${config.endpoint}/${config.userId}`)
              .expect(expectedRows);
          });
      });
    });
  });

  describe(`PATCH ${config.endpoint}/${config.userId}/1`, () => {
    context(`Given no rows`, () => {
      it(`responds with 404`, () => {
        const rowIdName = 1;
        return supertest(app)
          .patch(`${config.endpoint}/${config.userId}/${rowIdName}`)
          .expect(404, {
            error: {
              message: `Row from table: '${config.table.name}' doesn't exist`,
            },
          });
      });
    });

    context("Given there are rows in the database", () => {
      const testRows = makeRows();
      beforeEach("insert rows", () => {
        return db.into(config.table.name).insert(testRows);
      });

      it("responds with 204 and updates the row", () => {
        const idToUpdate = 1;
        const updatedRow = makeUpdatedRow();
        const expectedRow = {
          ...testRows[idToUpdate - 1],
          ...updatedRow,
        };

        return supertest(app)
          .patch(`${config.endpoint}/${config.userId}/${idToUpdate}`)
          .send(updatedRow)
          .expect(204)
          .then((res) => {
            supertest(app)
              .get(`${config.endpoint}/${config.userId}/${idToUpdate}`)
              .then((res) => {
                expect(expectedRow).to.eql(res.body);
              });
          });
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 1;
        return supertest(app)
          .patch(`${config.endpoint}/${config.userId}/${idToUpdate}`)
          .send({ irrelevantField: "foo" })
          .expect(400, {
            error: {
              message: `Request body content must contain at least one of the following: ${config.table.columns}`,
            },
          });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 1;

        const expectedRow = {
          ...testRows[idToUpdate - 1],
          ...config.table.updatedColumn,
        };

        return supertest(app)
          .patch(`${config.endpoint}/${config.userId}/${idToUpdate}`)
          .send({
            ...config.table.updatedColumn,
            fieldToIgnore: "should not be in GET response",
          })
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`${config.endpoint}/${config.userId}/${idToUpdate}`)
              .expect(expectedRow)
          );
      });
    });
  });
});

const knex = require("knex");
const app = require("../src/app");
const fixtures = require("./roles.fixtures");
const { expect } = require("chai");

const config = {
  allTables: ["department", "role"],
  referenceTables: ["department"],
  table: {
    name: "role",
    columns: ["role_name", "department_id"],
    sortColumn: "role_name",
    nullColumns: [],
    xssColumn: "role_name",
    updatedColumn: {
      role_name: "new head chef",
    },
  },
  endpoint: "/api/roles/test",
  userId: "1",
  rowIdName: "role_id",
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

  const fillReferenceTables = () => {
    const testRows = fixtures.makeRows();
    config.referenceTables.forEach((key) => {
      beforeEach(`insert ${key} rows`, () => {
        return db.into(key).insert(testRows[key]);
      });
    });
  };

  const fillAllTables = () => {
    const testRows = fixtures.makeRows();
    config.allTables.forEach((key) => {
      beforeEach(`insert ${key} rows`, () => {
        return db.into(key).insert(testRows[key]);
      });
    });
  };

  const fillTestTableMaliciousRow = () => {
    const { maliciousRow } = fixtures.makeMaliciousRow();
    beforeEach(`insert ${config.table.name} rows`, () => {
      return db.into(config.table.name).insert(maliciousRow);
    });
  };

  after("disconnect from db", () => db.destroy());
  config.allTables.forEach((key) => {
    before("clean the table", () =>
      db.raw(`TRUNCATE table ${key} RESTART IDENTITY CASCADE`)
    );
  });

  config.allTables.forEach((key) => {
    afterEach("cleanup", () =>
      db.raw(`TRUNCATE table ${key} RESTART IDENTITY CASCADE`)
    );
  });

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
    `Given there are rows in table(s): ${config.table.name}, ${config.referenceTables} in the database`,
    () => {
      const testRows = fixtures.makeRows();
      const filteredRowsById = testRows[config.table.name].filter(
        (row) => row.app_user_id === config.userId
      );
      fillAllTables();
      it("responds with 200 and all of the rows matching userId", () => {
        return supertest(app)
          .get(`${config.endpoint}/${config.userId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.length).to.eql(filteredRowsById.length);
          })
          .expect((res) => {
            let sortedRes = res.body.sort((a, b) => {
              return a[config.table.sortColumn].localeCompare(
                b[config.table.sortColumn]
              );
            });
            let sortedfilteredRowsById = filteredRowsById.sort((a, b) => {
              return a[config.table.sortColumn].localeCompare(
                b[config.table.sortColumn]
              );
            });
            expect(sortedRes).to.eql(sortedfilteredRowsById);
          });
      });
    }
  );

  context(`Given an XSS attack`, () => {
    const { expectedRow } = fixtures.makeMaliciousRow();
    fillReferenceTables();
    fillTestTableMaliciousRow();
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

  describe(`GET ${config.endpoint}/${config.userId}/1`, () => {
    const rowId = 1;
    context(`Given no rows`, () => {
      it(`responds with 404`, () => {
        return supertest(app)
          .get(`${config.endpoint}/${config.userId}/${rowId}`)
          .expect(404, {
            error: {
              message: `Row from table: '${config.table.name}' doesn't exist`,
            },
          });
      });
    });

    context("Given there are rows in the database", () => {
      const rowId = 1;
      const testRows = fixtures.makeRows();
      fillAllTables();
      it("responds with 200 and the specified row", () => {
        return supertest(app)
          .get(`${config.endpoint}/${config.userId}/${rowId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).to.eql(testRows[config.table.name][0]);
          });
      });
    });

    context("Given an XSS attack row", () => {
      const rowId = 1;
      const { maliciousRow, expectedRow } = fixtures.makeMaliciousRow();
      fillReferenceTables();
      beforeEach("insert malicious row", () => {
        return db.into(config.table.name).insert(maliciousRow);
      });
      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`${config.endpoint}/${config.userId}/${rowId}`)
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
    fillReferenceTables();
    const testRow = fixtures.makeNewRow();
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
            .expect((res) => {
              expect(res.body).to.eql(testRow);
            })
        );
    });

    config.table.columns.forEach((field) => {
      if (config.table.nullColumns.indexOf(field) === -1) {
        const newRow = fixtures.makeNewRow();
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newRow[field];
          return supertest(app)
            .post(`${config.endpoint}/${config.userId}`)
            .send(newRow)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` },
            });
        });
      }
    });

    it("removes XSS attack content from response", () => {
      const { maliciousRow, expectedRow } = fixtures.makeMaliciousRow();
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
      const testRows = fixtures.makeRows();
      const filteredRowsById = testRows[config.table.name].filter(
        (row) => row.app_user_id === config.userId
      );
      fillAllTables();
      it("responds with 204 and removes the row", () => {
        const idToRemove = 1;
        return supertest(app)
          .delete(`${config.endpoint}/${config.userId}/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`${config.endpoint}/${config.userId}`)
              .expect((res) => {
                const expectedRows = filteredRowsById.filter(
                  (row) => row[config.rowIdName] !== idToRemove
                );
                expect(res.body).to.eql(expectedRows);
              })
          );
      });
    });
  });

  describe(`PATCH ${config.endpoint}/${config.userId}/1`, () => {
    context(`Given no rows`, () => {
      it(`responds with 404`, () => {
        const rowId = "1";
        return supertest(app)
          .patch(`${config.endpoint}/${config.userId}/${rowId}`)
          .expect(404, {
            error: {
              message: `Row from table: '${config.table.name}' doesn't exist`,
            },
          });
      });
    });

    context("Given there are rows in the database", () => {
      const testRows = fixtures.makeRows();
      fillAllTables();

      it("responds with 204 and updates the row", () => {
        const idToUpdate = 1;
        const updatedRow = fixtures.makeUpdatedRow();
        const expectedRow = {
          ...testRows[config.table.name][idToUpdate - 1],
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
          ...testRows[config.table.name][idToUpdate - 1],
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
              .expect((res) => {
                expect(res.body).to.eql(expectedRow);
              })
          );
      });
    });
  });
});

function makeRows() {
  return [
    {
      department_id: 1,
      app_user_id: "1",
      department_name: "kitchen",
    },
    {
      department_id: 2,
      app_user_id: "1",
      department_name: "service",
    },
    {
      department_id: 3,
      app_user_id: "2",
      department_name: "back of house",
    },
    {
      department_id: 4,
      app_user_id: "2",
      department_name: "front of house",
    },
  ];
}

function makeUpdatedRow() {
  const row = {
    department_id: 1,
    app_user_id: "1",
    department_name: "updated department name",
  };
  return row;
}

function makeNewRow() {
  const row = {
    department_name: "management",
    department_id: 1,
    app_user_id: "1",
  };
  return row;
}

function makeMaliciousRow() {
  const maliciousRow = {
    department_id: 1,
    app_user_id: "1",
    department_name:
      'Naughty naughty very naughty <script>alert("xss");</script>',
  };
  const expectedRow = {
    ...maliciousRow,
    department_name:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
  };
  return {
    maliciousRow,
    expectedRow,
  };
}

module.exports = {
  makeRows,
  makeUpdatedRow,
  makeNewRow,
  makeMaliciousRow,
};

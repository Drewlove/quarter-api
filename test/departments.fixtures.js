function makeRows() {
  return [
    {
      id: 1,
      app_user_id: 1,
      department_name: "kitchen",
    },
    {
      id: 2,
      app_user_id: 1,
      department_name: "service",
    },
    {
      id: 3,
      app_user_id: 2,
      department_name: "back of house",
    },
    {
      id: 4,
      app_user_id: 2,
      department_name: "front of house",
    },
  ];
}

function makeRow() {
  return [
    {
      id: 5,
      app_user_id: 1,
      department_name: "management",
    },
  ];
}

function makeMaliciousRow() {
  const maliciousRow = {
    id: 4,
    app_user_id: 2,
    department_name:
      'Naughty naughty very naughty <script>alert("xss");</script>',
  };
  const expectedRow = {
    ...maliciousRow,
    title:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
  };
  return {
    maliciousRow,
    expectedRow,
  };
}

module.exports = {
  makeRows,
  makeRow,
  makeMaliciousRow,
};

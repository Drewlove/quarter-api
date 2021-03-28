const fixtures = {
  makeRows() {
    return {
      department: [
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
      ],
      role: [
        {
          department_id: 1,
          role_id: 1,
          app_user_id: "1",
          role_name: "head chef",
        },
        {
          department_id: 1,
          role_id: 2,
          app_user_id: "1",
          role_name: "sous chef",
        },
        {
          department_id: 2,
          role_id: 3,
          app_user_id: "1",
          role_name: "waiter",
        },
        {
          department_id: 2,
          role_id: 4,
          app_user_id: "1",
          role_name: "busser",
        },
      ],
    };
  },

  makeUpdatedRow() {
    const row = {
      department_id: 1,
      app_user_id: "1",
      role_name: "new head chef",
    };
    return row;
  },

  makeNewRow() {
    const row = {
      role_name: "host",
      department_id: 2,
      app_user_id: "1",
      role_id: 1,
    };
    return row;
  },

  makeMaliciousRow() {
    const maliciousRow = {
      department_id: 1,
      role_id: 1,
      app_user_id: "1",
      role_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    };
    const expectedRow = {
      ...maliciousRow,
      role_name:
        'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    };
    return {
      maliciousRow,
      expectedRow,
    };
  },
};

module.exports = fixtures;

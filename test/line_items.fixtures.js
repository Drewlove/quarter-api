function makeRows() {
  return [
    {
      line_item_id: 1,
      app_user_id: "1",
      line_item_category: "sales",
      line_item_name: "food",
      amount: "100.00",
      line_item_amount_type: "dollars",
      percent_of: null,
    },
    {
      line_item_id: 2,
      app_user_id: "1",
      line_item_category: "sales",
      line_item_name: "beverage",
      amount: "25.00",
      line_item_amount_type: "dollars",
      percent_of: null,
    },
    {
      line_item_id: 3,
      app_user_id: "1",
      line_item_category: "cogs",
      line_item_name: "food",
      amount: "30.00",
      line_item_amount_type: "percent",
      percent_of: 1,
    },
    {
      line_item_id: 4,
      app_user_id: "1",
      line_item_category: "cogs",
      line_item_name: "beverage",
      amount: "10.00",
      line_item_amount_type: "percent",
      percent_of: 2,
    },
    {
      line_item_id: 5,
      app_user_id: "2",
      line_item_category: "sales",
      line_item_name: "food",
      amount: "50.00",
      line_item_amount_type: "dollars",
      percent_of: null,
    },
    {
      line_item_id: 6,
      app_user_id: "2",
      line_item_category: "sales",
      line_item_name: "beverage",
      amount: "10.00",
      line_item_amount_type: "dollars",
      percent_of: null,
    },
    {
      line_item_id: 7,
      app_user_id: "2",
      line_item_category: "cogs",
      line_item_name: "food",
      amount: "25.00",
      line_item_amount_type: "percent",
      percent_of: 5,
    },
    {
      line_item_id: 8,
      app_user_id: "2",
      line_item_category: "cogs",
      line_item_name: "beverage",
      amount: "12.00",
      line_item_amount_type: "percent",
      percent_of: 6,
    },
  ];
}

function makeUpdatedRow() {
  const row = {
    line_item_id: 1,
    app_user_id: "1",
    line_item_category: "sales",
    line_item_name: "updated food",
    amount: "100.00",
    line_item_amount_type: "dollars",
    percent_of: null,
  };
  return row;
}

function makeNewRow() {
  const row = {
    line_item_id: 1,
    app_user_id: "1",
    line_item_category: "sales",
    line_item_name: "merchandise",
    amount: "75.00",
    line_item_amount_type: "dollars",
    percent_of: null,
  };
  return row;
}

function getNewRow() {
  const row = {
    line_item_id: 1,
    app_user_id: "1",
    line_item_category: "sales",
    line_item_name: "merchandise",
    amount: "75.00",
    line_item_amount_type: "dollars",
    percent_of: null,
  };
  return row;
}

function makeMaliciousRow() {
  const maliciousRow = {
    line_item_id: 1,
    app_user_id: 1,
    line_item_category: "sales",
    line_item_name:
      'Naughty naughty very naughty <script>alert("xss");</script>',
    amount: 75.0,
    line_item_amount_type: "dollars",
    percent_of: null,
  };
  const expectedRow = {
    ...maliciousRow,
    line_item_name:
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
  getNewRow,
  makeMaliciousRow,
};

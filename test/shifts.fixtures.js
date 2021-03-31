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
          department_id: 2,
          role_id: 2,
          app_user_id: "1",
          role_name: "server",
        },
        {
          department_id: 2,
          role_id: 3,
          app_user_id: "2",
          role_name: "baker",
        },
        {
          department_id: 2,
          role_id: 4,
          app_user_id: "2",
          role_name: "service",
        },
        {
          department_id: 2,
          role_id: 5,
          app_user_id: "1",
          role_name: "host",
        },
      ],
      shift: [
        {
          app_user_id: "1",
          shift_day: [0, 1, 2, 3, 4],
          shift_department: 1,
          shift_role: 1,
          shift_start: "07:00:00",
          shift_end: "15:00:00",
          people: 3,
          wage: "15.00",
          payroll_tax: "7.65",
        },
        {
          app_user_id: "1",
          shift_day: [0, 1, 2, 3, 4],
          shift_department: 2,
          shift_role: 2,
          shift_start: "15:00:00",
          shift_end: "18:30:00",
          people: 2,
          wage: "20.00",
          payroll_tax: "7.65",
        },
        {
          app_user_id: "2",
          shift_day: [2, 3, 4, 5, 6],
          shift_department: 3,
          shift_role: 3,
          shift_start: "16:00:00",
          shift_end: "23:00:00",
          people: 4,
          wage: "13.50",
          payroll_tax: "7.65",
        },
        {
          app_user_id: "2",
          shift_day: [2, 3, 4, 5, 6],
          shift_department: 4,
          shift_role: 4,
          shift_start: "12:00:00",
          shift_end: "22:00:00",
          people: 2,
          wage: "20.00",
          payroll_tax: "7.65",
        },
      ],
    };
  },

  makeShiftsWithRelationalColumns() {
    return [
      {
        shift_id: 1,
        department_name: "kitchen",
        role_name: "head chef",
        app_user_id: "1",
        shift_day: [0, 1, 2, 3, 4],
        shift_department: 1,
        shift_role: 1,
        shift_start: "07:00:00",
        shift_end: "15:00:00",
        people: 3,
        wage: "15.00",
        payroll_tax: "7.65",
      },
      {
        shift_id: 2,
        department_name: "service",
        role_name: "server",
        app_user_id: "1",
        shift_day: [0, 1, 2, 3, 4],
        shift_department: 2,
        shift_role: 2,
        shift_start: "15:00:00",
        shift_end: "18:30:00",
        people: 2,
        wage: "20.00",
        payroll_tax: "7.65",
      },
      {
        shift_id: 3,
        department_name: "back of house",
        role_name: "baker",
        app_user_id: "2",
        shift_day: [2, 3, 4, 5, 6],
        shift_department: 3,
        shift_role: 3,
        shift_start: "16:00:00",
        shift_end: "23:00:00",
        people: 4,
        wage: "13.50",
        payroll_tax: "7.65",
      },
      {
        shift_id: 4,
        department_name: "front of house",
        role_name: "service",
        app_user_id: "2",
        shift_day: [2, 3, 4, 5, 6],
        shift_department: 4,
        shift_role: 4,
        shift_start: "12:00:00",
        shift_end: "22:00:00",
        people: 2,
        wage: "20.00",
        payroll_tax: "7.65",
      },
    ];
  },

  makeUpdatedRow() {
    const row = {
      department_name: "kitchen",
      role_name: "head chef",
      app_user_id: "1",
      shift_day: [0, 1, 2, 3, 4],
      shift_department: 1,
      shift_role: 1,
      shift_start: "07:00:00",
      shift_end: "15:00:00",
      people: 3,
      wage: "17.50",
      payroll_tax: "7.65",
    };
    return row;
  },

  makeNewRow() {
    const row = {
      shift_id: 1,
      app_user_id: "1",
      shift_day: [2, 3, 4],
      shift_department: 2,
      shift_role: 5,
      shift_start: "07:00:00",
      shift_end: "15:00:00",
      people: 1,
      wage: "12.00",
      payroll_tax: "7.65",
    };
    return row;
  },
  makeNewRowWithRelationalData() {
    const row = {
      department_name: "service",
      role_name: "host",
      shift_id: 1,
      app_user_id: "1",
      shift_day: [2, 3, 4],
      shift_department: 2,
      shift_role: 5,
      shift_start: "07:00:00",
      shift_end: "15:00:00",
      people: 1,
      wage: "12.00",
      payroll_tax: "7.65",
    };
    return row;
  },
};

module.exports = fixtures;

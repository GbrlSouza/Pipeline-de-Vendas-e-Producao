async function fetchTasks() {
  const response = await fetch('http://localhost:3000/tasks');
  return response.json();
}

fetchTasks().then((tasks) => {
  const ganttData = tasks.map(task => ({
    TaskID: task.id,
    TaskName: task.name,
    StartDate: new Date(task.start_date),
    EndDate: new Date(task.end_date),
    Status: task.status,
  }));

  new ej.gantt.Gantt({
    dataSource: ganttData,
    height: '400px',
    taskFields: {
      id: 'TaskID',
      name: 'TaskName',
      startDate: 'StartDate',
      endDate: 'EndDate',
    },
  }).appendTo('#Gantt');
});
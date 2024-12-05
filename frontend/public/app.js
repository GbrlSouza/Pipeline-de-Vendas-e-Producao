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

  const gantt = new ej.gantt.Gantt({
    dataSource: ganttData,
    height: '400px',
    allowEditing: true,
    allowTaskbarEditing: true,
    editSettings: {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    },
    toolbar: ['Add', 'Edit', 'Update', 'Cancel', 'Delete'],
    taskFields: {
      id: 'TaskID',
      name: 'TaskName',
      startDate: 'StartDate',
      endDate: 'EndDate',
      progress: 'Progress',
    },
    actionBegin: function (args) {
      if (args.requestType === 'beforeSave') {
        fetch(`http://localhost:3000/update-task`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(args.data),
        })
        .then(response => response.json())
        .then(data => console.log('Tarefa atualizada', data))
        .catch(error => console.error('Erro ao salvar:', error));
      }
    }
  });

  gantt.appendTo('#Gantt');
});

const grid = new ej.grids.Grid({
  dataSource: [],
  allowPaging: true,
  editSettings: {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog',
  },
  toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
  columns: [
    { field: 'id', headerText: 'ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
    { field: 'name', headerText: 'Tarefa', textAlign: 'Left', width: 200 },
    { field: 'stage', headerText: 'Fase', textAlign: 'Left', width: 150 },
    { field: 'start_date', headerText: 'Data de Início', textAlign: 'Left', type: 'date', format: 'yMd', width: 150, editType: 'datepickeredit' },
    { field: 'end_date', headerText: 'Data de Término', textAlign: 'Left', type: 'date', format: 'yMd', width: 150, editType: 'datepickeredit' },
    { field: 'status', headerText: 'Status', textAlign: 'Left', width: 150 }
  ],
  actionBegin: function (args) {
    if (args.requestType === 'save') {
      fetch('http://localhost:3000/update-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args.data),
      })
      .then(response => response.json())
      .then(data => console.log('Tarefa salva no grid', data))
      .catch(error => console.error('Erro ao salvar:', error));
    }
  }
});

grid.appendTo('#Grid');

fetchTasks().then((tasks) => {
  grid.dataSource = tasks.map(task => ({
    id: task.id,
    name: task.name,
    stage: task.stage,
    start_date: new Date(task.start_date),
    end_date: new Date(task.end_date),
    status: task.status,
  }));
});

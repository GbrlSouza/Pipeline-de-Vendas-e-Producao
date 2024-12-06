async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:3000/tasks');
    if (!response.ok) throw new Error('Erro ao buscar tarefas');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return [];
  }
}

function initializeGantt(tasks) {
  const ganttData = tasks.map((task) => ({
    TaskID: task.id,
    TaskName: task.name,
    StartDate: new Date(task.start_date),
    EndDate: new Date(task.end_date),
    Status: task.status,
    Progress: task.progress,
    unemployment_rate: task.unemployment_rate || 0
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
      unemployment_rate: 'UnemploymentRate',
    },
    enableVirtualization: true,
    enableTimelineVirtualization: true,
    columns: [
      { field: 'TaskName', headerText: 'Task Name', width: '130' },
      { field: 'StartDate', headerText: 'Start Date', width: '110', format: 'yMd' },
      { field: 'EndDate', headerText: 'End Date', width: '110', format: 'yMd' },
      { field: 'Progress', headerText: 'Progress', width: '75' },
      { field: 'unemployment_rate', headerText: 'Unemployment Rate', allowFiltering: true, width: 75 },
    ],
  });

  gantt.appendTo('#Gantt');
}

function initializeGrid(tasks) {
  const gridData = tasks.map((task) => ({
    id: task.id,
    name: task.name,
    stage: task.stage,
    start_date: new Date(task.start_date),
    end_date: new Date(task.end_date),
    status: task.status,
    progress: task.progress || 0,
    unemployment_rate: task.unemployment_rate || 0
  }));

  const grid = new ej.grids.Grid({
    dataSource: gridData,
    allowPaging: true,
    editSettings: {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    },
    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
    columns: [
      { field: 'id', headerText: 'ID', isPrimaryKey: true, textAlign: 'center', width: 100 },
      { field: 'name', headerText: 'Tarefa', textAlign: 'center', width: 200 },
      { field: 'stage', headerText: 'Fase', textAlign: 'center', width: 150 },
      { field: 'start_date', headerText: 'Data de Início', textAlign: 'center', type: 'date', format: 'yMd', width: 150, editType: 'datepickeredit' },
      { field: 'end_date', headerText: 'Data de Término', textAlign: 'center', type: 'date', format: 'yMd', width: 150, editType: 'datepickeredit' },
      { field: 'status', headerText: 'Status', textAlign: 'center', width: 150 },
      { field: 'progress', headerText: 'Progresso', width: 150 },
      { field: 'unemployment_rate', headerText: 'Unemployment Rate', allowFiltering: false, width: 170 },
    ],
    actionBegin: async function (args) {
      if (args.requestType === 'save') {
        try {
          const response = await fetch('http://localhost:3000/update-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(args.data),
          });

          if (!response.ok) throw new Error('Erro ao atualizar tarefa');

          console.log('Tarefa salva com sucesso');
          const updatedTasks = await fetchTasks();
          grid.dataSource = updatedTasks.map((task) => ({
            id: task.id,
            name: task.name,
            stage: task.stage,
            start_date: new Date(task.start_date),
            end_date: new Date(task.end_date),
            status: task.status,
            progress: task.progress || 0,
            unemployment_rate: task.unemployment_rate || 0,
          }));
        } catch (error) {
          console.error('Erro ao salvar tarefa:', error);
        }
      }
    },
  });

  grid.appendTo('#Grid');
}

fetchTasks().then((tasks) => {
  initializeGantt(tasks);
  initializeGrid(tasks);
});

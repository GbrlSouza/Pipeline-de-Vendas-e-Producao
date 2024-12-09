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
    Progress: task.progress || 0,
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
    },
    toolbar: ['Add', 'Edit', 'Update', 'Cancel', 'Delete'],
    taskFields: {
      id: 'TaskID',
      name: 'TaskName',
      startDate: 'StartDate',
      endDate: 'EndDate',
      progress: 'Progress',
      status: 'Status',
    },
    columns: [
      { field: 'TaskName', headerText: 'Task Name', width: '100', editType: 'stringedit', textAlign: 'left' },
      { field: 'StartDate', headerText: 'Start Date', width: '75', format: 'yMd', editType: 'datepickeredit', textAlign: 'left' },
      { field: 'EndDate', headerText: 'End Date', width: '75', format: 'yMd', editType: 'datepickeredit', textAlign: 'left' },
      { field: 'Progress', headerText: 'Progress (%)', width: '75', editType: 'numericedit', textAlign: 'left' },
    ],
    actionBegin: async function (args) {
      if (args.requestType === 'save') {
        try {
          const updatedTask = {
            id: args.data.TaskID,
            name: args.data.TaskName,
            start_date: args.data.StartDate,
            end_date: args.data.EndDate,
            progress: args.data.Progress,
            status: args.data.Status,
          };

          const response = await fetch('http://localhost:3000/update-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
          });

          if (!response.ok) throw new Error('Erro ao atualizar tarefa');
          console.log('Tarefa atualizada com sucesso:', updatedTask);
        } catch (error) {
          console.error('Erro ao salvar tarefa:', error);
        }
      }
    },
    actionComplete: async function (args) {
      if (args.requestType === 'save') {
        console.log('Edição concluída:', args.data);

        const updatedTasks = await fetchTasks();
        this.dataSource = updatedTasks.map((task) => ({
          TaskID: task.id,
          TaskName: task.name,
          StartDate: new Date(task.start_date),
          EndDate: new Date(task.end_date),
          Progress: task.progress || 0,
          Status: task.status,
        }));
      }
    },

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
  }));

  const grid = new ej.grids.Grid({
    dataSource: gridData,
    allowPaging: true,
    editSettings: {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Normal',
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
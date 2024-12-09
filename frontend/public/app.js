document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/tasks";

  async function fetchTasks() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      return mapTasks(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      showError("Erro ao carregar as tarefas. Tente novamente.");
      return [];
    }
  }

  function mapTasks(tasks) {
    return tasks.map((task) => ({
      TaskID: task.id,
      TaskName: task.name,
      StartDate: new Date(task.start_date),
      EndDate: new Date(task.end_date),
      Progress: task.progress,
      Status: task.status,
    }));
  }

  async function saveTask(task) {
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error("Erro ao salvar a tarefa");
      location.reload();
      return await response.json();
    } catch (error) {
      console.error("Erro ao salvar a tarefa:", error);
      showError("Erro ao salvar a tarefa. Tente novamente.");
    }
  }

  function showError(message) {
    const errorDiv = document.getElementById("error-message");
    if (errorDiv) {
      errorDiv.innerText = message;
      errorDiv.style.display = "block";
      setTimeout(() => (errorDiv.style.display = "none"), 5000);
    }
  }

  async function initializeGantt() {
    const tasks = await fetchTasks();
    const currentYear = new Date().getFullYear();

    const gantt = new ej.gantt.Gantt({
      dataSource: tasks,
      height: "350px",
      width: "100%",
      toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
      rowHeight: 30,
      taskFields: {
        id: "TaskID",
        name: "TaskName",
        startDate: "StartDate",
        endDate: "EndDate",
        progress: "Progress",
        status: "Status",
      },
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
      },
      highlightWeekends: true,
      includeWeekend: true,
      gridLines: "Both",
      holidays: [
        { from: `${currentYear}-01-02`, label: "Ano Novo", textAlign: "center" },
        { from: `${currentYear + 1}-01-01`, label: "Fim do Ano", textAlign: "center" },
      ],
      columns: [
        { field: "TaskID", headerText: "ID", textAlign: "Left" },
        { field: "TaskName", headerText: "Tarefa", textAlign: "Left" },
        { field: "StartDate", headerText: "Início", textAlign: "Left" },
        { field: "EndDate", headerText: "Fim", textAlign: "Left" },
        { field: "Progress", headerText: "Progresso (%)", textAlign: "Left" },
        { field: "Status", headerText: "Status", textAlign: "Left" },
      ],
      actionBegin: async (args) => {
        if (args.requestType === "save") {
          const updatedTask = {
            id: args.data.TaskID,
            name: args.data.TaskName,
            start_date: args.data.StartDate,
            end_date: args.data.EndDate,
            progress: args.data.Progress,
            status: args.data.Status,
          };

          await saveTask(updatedTask);
        }
      },
    });

    gantt.appendTo("#GanttContainer");
  }

  async function initializeGrid() {
    const tasks = await fetchTasks();

    const grid = new ej.grids.Grid({
      dataSource: tasks,
      height: "300px",
      rowHeight: 30,
      allowPaging: true,
      pageSettings: { pageSize: 7 },
      toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: "Normal",
        locale: "pt-BR",
      },
      columns: [
        { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 30, textAlign: "Left" },
        { field: "TaskName", headerText: "Tarefa", width: 100, textAlign: "Left" },
        { field: "StartDate", headerText: "Início", type: "date", editType: "datepickeredit", format: "yMd", textAlign: "Left", width: 100 },
        { field: "EndDate", editType: "datepickeredit", headerText: "Fim", type: "date", format: "yMd", textAlign: "Left", width: 100 },
        { field: "Progress", headerText: "Progresso (%)", type: "number", textAlign: "Left", width: 100 },
        { field: "Status", headerText: "Status", textAlign: "Left", width: 100 },
      ],
      actionBegin: async (args) => {
        if (args.requestType === "save") {
          const updatedTask = {
            id: args.data.TaskID,
            name: args.data.TaskName,
            start_date: args.data.StartDate,
            end_date: args.data.EndDate,
            progress: args.data.Progress,
            status: args.data.Status,
          };

          await saveTask(updatedTask);
        }
      },
    });

    grid.appendTo("#GridContainer");
  }

  initializeGantt();
  initializeGrid();
});
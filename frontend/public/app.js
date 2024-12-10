document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/tasks";
  const SUBTASKS_API_URL = "http://localhost:3000/subtasks"; // Endpoint para subtarefas

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

  async function fetchSubtasks(taskID) {
    try {
      const response = await fetch(`${SUBTASKS_API_URL}?taskID=${taskID}`);
      const data = await response.json();
      return mapSubtasks(data);
    } catch (error) {
      console.error("Erro ao buscar subtarefas:", error);
      showError("Erro ao carregar as subtarefas. Tente novamente.");
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

  function mapSubtasks(subtasks) {
    return subtasks.map((subtask) => ({
      SubtaskID: subtask.id,
      SubtaskName: subtask.name,
      StartDate: new Date(subtask.start_date),
      EndDate: new Date(subtask.end_date),
      Status: subtask.status,
    }));
  }

  async function saveTask(task) {
    try {
      const response = await fetch(`${API_URL}/${task.TaskID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: task.TaskID,
          name: task.TaskName,
          start_date: task.StartDate.toISOString().split("T")[0],
          end_date: task.EndDate.toISOString().split("T")[0],
          progress: task.Progress,
          status: task.Status,
        }),
      });
      if (!response.ok) throw new Error("Erro ao salvar a tarefa");
      console.log("Tarefa editada com sucesso");
    } catch (error) {
      console.error("Erro ao salvar a tarefa:", error);
      showError("Erro ao salvar a tarefa. Tente novamente.");
    }
  }

  async function addTask(task) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: task.TaskName,
          start_date: task.StartDate.toISOString().split("T")[0],
          end_date: task.EndDate.toISOString().split("T")[0],
          progress: task.Progress,
          status: task.Status,
        }),
      });
      if (!response.ok) throw new Error("Erro ao adicionar a tarefa");
      console.log("Tarefa adicionada com sucesso");
    } catch (error) {
      console.error("Erro ao adicionar a tarefa:", error);
      showError("Erro ao adicionar a tarefa. Tente novamente.");
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao excluir a tarefa");
      console.log("Tarefa excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir a tarefa:", error);
      showError("Erro ao excluir a tarefa. Tente novamente.");
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

  function renderSubtasksGrid(subtasks) {
    const gridContainer = document.getElementById("SubtasksContainer");
    if (!gridContainer) return;

    gridContainer.innerHTML = ""; // Limpa o conteúdo anterior

    const grid = new ej.grids.Grid({
      dataSource: subtasks,
      height: "250px",
      columns: [
        { field: "SubtaskID", headerText: "ID", width: 100, textAlign: "Center" },
        { field: "SubtaskName", headerText: "Subtarefa", width: 200, textAlign: "Left" },
        { field: "StartDate", headerText: "Início", width: 150, textAlign: "Left" },
        { field: "EndDate", headerText: "Fim", width: 150, textAlign: "Left" },
        { field: "Status", headerText: "Status", width: 150, textAlign: "Center" },
      ],
    });

    grid.appendTo(gridContainer);
  }

  async function initializeGantt() {
    const tasks = await fetchTasks();
    const today = new Date();

    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    // if (month >= 10) {
    //   month -= 9; // Subtrai 9 do mês
    //   year += 1;  // Adiciona 1 ao ano
    // }

    const gantt = new ej.gantt.Gantt({
      dataSource: tasks,
      height: "300px",
      width: "100%",
      toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
      rowHeight: 30,
      allowResizing: false,
      taskFields: {
        id: "TaskID",
        name: "TaskName",
        startDate: "StartDate",
        endDate: "EndDate",
        progress: "Progress",
        status: "Status",
      },
      // holidays: [
      //   { from: formatDate(year - 1, month - 3, day), label: "Início" },  // 3 meses antes
      //   { from: formatDate(year, month + 3, day), label: "Fim" },  // 3 meses depois
      // ],
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
      },
      actionComplete: async (args) => {
        if (args.requestType === "save") {
          if (args.action === "add") {
            await addTask(args.data);
          } else if (args.action === "edit") {
            await saveTask(args.data);
          }
        } else if (args.requestType === "delete") {
          const taskId = args.data[0].TaskID;
          await deleteTask(taskId);
        }
      },
      rowSelected: async (args) => {
        const selectedTask = args.data;
        if (selectedTask && selectedTask.TaskID) {
          const subtasks = await fetchSubtasks(selectedTask.TaskID);
          renderSubtasksGrid(subtasks);
        }
      },
      highlightWeekends: true,
      includeWeekend: true,
      workingDays: [1, 2, 3, 4, 5],
      gridLines: "Both",
      columns: [
        { field: "TaskID", headerText: "ID", textAlign: "Left" },
        { field: "TaskName", headerText: "Tarefa", textAlign: "Left" },
        { field: "StartDate", headerText: "Início", textAlign: "Left" },
        { field: "EndDate", headerText: "Fim", textAlign: "Left" },
        { field: "Progress", headerText: "Progresso (%)", textAlign: "Left" },
        { field: "Status", headerText: "Status", textAlign: "Left" },
      ],
    });

    gantt.appendTo("#GanttContainer");
  }

  initializeGantt();
});
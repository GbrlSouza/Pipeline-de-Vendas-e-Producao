document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/tasks";

  async function initializeGantt() {
    try {
      const tasks = await fetchTasks();
      configureGantt(tasks);
    } catch (error) {
      console.error("Erro na inicialização do Gantt:", error);
      showError("Erro ao carregar as tarefas. Verifique o console para mais detalhes.");
    }
  }

  async function fetchTasks() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Erro ao buscar tarefas do servidor. Status: ${response.status}`);
      const data = await response.json();
      return mapTasks(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      throw error;
    }
  }

  function mapTasks(tasks) {
    return tasks.map((task) => {
      if (!task.start_date || !task.end_date || isNaN(new Date(task.start_date)) || isNaN(new Date(task.end_date))) {
        console.warn("Tarefa ignorada devido a dados inválidos:", task);
        return null;
      }
      return {
        TaskID: task.id,
        TaskName: task.name,
        StartDate: new Date(task.start_date),
        EndDate: new Date(task.end_date),
        Progress: task.progress,
        Status: task.status,
      };
    }).filter(Boolean);
  }

  function formatTaskPayload(task) {
    return {
      name: task.TaskName,
      start_date: task.StartDate.toISOString(),
      end_date: task.EndDate.toISOString(),
      progress: task.Progress,
      status: task.Status
    };
  }

  async function saveTask(task) {
    try {
      console.log("Salvando tarefa:", task);
      const response = await fetch(`${API_URL}/${task.TaskID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatTaskPayload(task)),
      });

      if (!response.ok) throw new Error(`Erro ao salvar a tarefa. Status: ${response.status}`);

      const updatedTasks = await fetchTasks();
      configureGantt(updatedTasks);

      console.log("Tarefa editada com sucesso:", task);
    } catch (error) {
      console.error("Erro ao salvar a tarefa:", error);
      showError("Erro ao salvar a tarefa. Tente novamente.");
    }
  }

  async function addTask(task) {
    try {
      console.log("Adicionando tarefa:", task);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatTaskPayload(task)),
      });

      if (!response.ok) throw new Error(`Erro ao adicionar a tarefa. Status: ${response.status}`);

      const updatedTasks = await fetchTasks();
      configureGantt(updatedTasks);

      console.log("Tarefa adicionada com sucesso:", task);
    } catch (error) {
      console.error("Erro ao adicionar a tarefa:", error);
      showError("Erro ao adicionar a tarefa. Tente novamente.");
    }
  }

  async function deleteTask(taskId) {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Erro ao excluir a tarefa. Status: ${response.status}`);

      const updatedTasks = await fetchTasks();
      configureGantt(updatedTasks);

      console.log("Tarefa excluída com sucesso. ID:", taskId);
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

  function configureGantt(tasks) {
    const currentYear = new Date().getFullYear();

    const gantt = new ej.gantt.Gantt({
      dataSource: tasks,
      height: "400px",
      width: "100%",
      rowHeight: 30,
      allowResizing: false,
      toolbar: ["Search", "ExcelExport", "PdfExport", "CsvExport", "Add", "Edit", "Delete", "Update", "Cancel"],
      allowExcelExport: true,
      allowPdfExport: true,
      taskFields: {
        id: "TaskID",
        name: "TaskName",
        startDate: "StartDate",
        endDate: "EndDate",
        progress: "Progress",
        status: "Status",
        dependency: "Predecessor"
      },
      selectionSettings: { mode: "Row", type: "Single" },
      allowFiltering: true,
      filterSettings: { type: "Menu" },
      allowTaskbarEditing: true,
      highlightWeekends: true,
      showTodayMarker: true,
      enableVirtualization: true,
      workingDays: [1, 2, 3, 4, 5],
      gridLines: "Both",
      holidays: [
        { from: `${currentYear}-01-02`, label: "Início do Novo" },
        { from: `${currentYear + 1}-01-01`, label: "Fim do Ano" },
      ],
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
      },
      actionBegin: async (args) => handleActionComplete(args, gantt),
      columns: [
        { field: "TaskID", headerText: "ID", width: 70, textAlign: "Left" },
        { field: "TaskName", headerText: "Tarefa", width: 200, textAlign: "Left" },
        { field: "StartDate", headerText: "Início", width: 150, textAlign: "Left" },
        { field: "EndDate", headerText: "Fim", width: 150, textAlign: "Left" },
        { field: "Progress", headerText: "Progresso (%)", width: 100, textAlign: "left" },
        { field: "Status", headerText: "Status", width: 150, textAlign: "Left" },
      ],
    });

    gantt.appendTo("#GanttContainer");
  }

  let isProcessing = false, count = 0;

  async function handleActionComplete(args, gantt) {
    if (count <= 1) {
      count++;
      return;
    }
    else if (isProcessing === true && count === 2) {
      isProcessing = false;
      count--;
      return;
    } else { isProcessing = true; }

    try {
      if (args.action === "beforeAdd") { await addTask(args.data); }
      else if (args.requestType === "beforeSave") { await saveTask(args.data); }
      else if (args.requestType === "delete") {
        const taskId = args.data[0]?.TaskID;
        if (taskId) { await deleteTask(taskId); }
      }

      if (args.requestType === "save" || args.requestType === "delete") {
        const updatedTasks = await fetchTasks();
        gantt.dataSource = updatedTasks;
        return
      }

    } catch (error) {
      console.error("Erro durante a ação no Gantt:", error);
      showError("Erro ao realizar a operação. Verifique os detalhes no console.");
    }
  }

  initializeGantt();
});
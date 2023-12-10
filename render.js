let containerPage = document.getElementById("container");

function getDataKanban(input) {
  let file = input.files[0];
  let reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    startRenderPage(JSON.parse(reader.result));
  };
}

function startRenderPage(pageData) {
  renderColumns(pageData["columns"]);
}

function renderColumns(colData) {
  colData.sort((a, b) => a.position - b.position);
  colData.forEach((element) => {
    containerPage.insertAdjacentHTML("beforeend", nodeColumn(element));
  });
}

function nodeColumn(note) {
  let tasks = "";
  note.tasks.forEach((element) => {
    tasks += nodeTask(element);
  });
  return `
        <div id="${note.id}" class="column">
          <div class="column-header" style="top: 0px">
            <div id="square__${note.id}"></div>
            <div class="header">
              <h1>${note.title}</h1>
              <button>
                <img
                  class="header__button-add"
                  onmousedown="return false"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAaElEQVR4nO2UwQkAIQwEtz3l+i9AC1k/8akhCTl9OLAPQRxIZIGHkQqgA6AzHUDZCSKPU9J2gnnpc4aS8wIGc17ghdcJuDivRnKfwEq6QCU6IpW3A2ojs9T1xFQbRfo8TRCFf3/zfMEAJn/ExjsUgToAAAAASUVORK5CYII="
                  title="Добавить задачу"
                />
              </button>
            </div>
          </div>

          ${tasks}
        </div>
        `;
}

function nodeTask(note) {
  return `
        <div
          id="${note.id}"
          class="item"
          draggable="true"
        >
          <div class="item__task-sprint-project-colors">
            <div
              class="item__task-sprint-color"
              style="background: ${note.sprintColor}"
            ></div>
            <div
              class="item__task-project-color"
              style="background: ${note.projectColor}"
            ></div>
          </div>
          <div class="item__task-code">
            <a
              href="${note.ref}"
              onmousedown="return false"
              class="item__task-code_code"
            >
              ${note.code}
            </a>
          </div>
          <div class="item__task-name">
            <span>${note.name}</span>
          </div>
          <div class="item__task-deadline-executors">
            <div class="item__task-deadline">
              <span
                class="item__task-deadline_deadline"
                title="срок выполнения"
              >
                ${note.deadline}
              </span>
            </div>
            <div class="item__task-executors-avatars">
              <img
                class="item__task-executor-avatar"
                onmousedown="return false"
                src="${note.avatarExecutor}"
                title="${note.nameExecutor}"
              />
            </div>
          </div>
          <div class="item_task-more">
            <img
            class="item_task-more-img"
            onmousedown="return false"
            onclick="moreInfoTask()"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAZElEQVR4nGNgGAWDCNTX11s1NjaGNjc3y4L4EydOZG9sbPQHYRAbJAaSA6kBqcUwoKGh4WdDQ8P/+vr6JSA+SCOID8IgNlTNUqjYT7IMqK+vX4LTgHoSvNDY2GhJ9TAcBQzkAwD8NFC2nPdBlgAAAABJRU5ErkJggg=="
            />
          </div>
        </div>
        `;
}
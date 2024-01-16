let btnOnlyExecutorChecked = null;
let previousYOffset = 0;
let valueMargin = 33;

let containerPage = document.getElementById("container");

let dragItemq = null;
let idItem = null;
let idColumn = null;

let items = null;
let columns = null;

/* Установка значения для переменной CSS */
document.documentElement.style.setProperty("--column-count", columns.length);

/* Обработчики кнопок */

function onlyExecutorChoice() {
  let elemCollections = document.getElementsByClassName(
    "choice__executor-only-btn"
  );
  if (elemCollections.length > 0) {
    if (elemCollections[0].classList.toggle("click-btn")) {
      btnOnlyExecutorChecked = true;
    } else {
      btnOnlyExecutorChecked = false;
    }
  }
}

function currentExecutor() {
  /* Добавляет при клике если нет и удаляет если есть */
  document
    .getElementById("choiceCurrentExecutorDropdownContent")
    .classList.toggle("show-content");
}

function btnMore() {
  /*Добавляет при клике если нет и удаляет если есть*/
  document
    .getElementById("choiceBtnMoreDropdownContent")
    .classList.toggle("show-content");
}

function moreInfoTask() {
  return;
}

/* Обработчики для работы со страницой */

function getDataKanban(input) {
  let file = input.files[0];
  let reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    startRenderPage(JSON.parse(reader.result));
  };
}

function getPosition() {
  if (idItem != null || idColumn != null) {
    let position = {
      idItem: idItem,
      idColumn: idColumn,
    };
    idItem = null;
    idColumn = null;
    return JSON.stringify(position);
  } else {
    return "";
  }
}

function startRenderPage(pageData) {
  renderColumns(pageData["columns"]);
  setEventsColumns();
  setEventsItems();
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

function setEventsItems() {
  items = document.querySelectorAll(".item");
  items.forEach((item) => {
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragend", dragEnd);
  });
}

function setEventsColumns() {
  columns = document.querySelectorAll(".column");
  columns.forEach((column) => {
    column.addEventListener("dragover", dragOver);
    column.addEventListener("dragenter", dragEnter);
    column.addEventListener("dragleave", dragLeave);
    column.addEventListener("drop", dragDrop);
  });
}

function updatePage(dataJson) {
  let arrayDataDOM = JSON.parse(dataJson);
  let containerColumns = undefined;
  for (let arrIndex in arrayDataDOM) {
    let dataColunm = arrayDataDOM[arrIndex];

    let jsonDataChoice = {
      currentProjectName: dataColunm.currentProjectName,
      currentExecutorName: dataColunm.currentExecutorName,
    };
    updateDataChoice(JSON.stringify(jsonDataChoice));

    let foundColumn = document.getElementById(dataColunm.idColumn);
    if (foundColumn != null) {
      if (dataColunm.todo === "update") {
        let itemsColumn = foundColumn.getElementsByClassName("item");
        for (let i = itemsColumn.length - 1; i >= 0; i--) {
          itemsColumn[i].remove();
        }
        addItems(foundColumn, dataColunm.items);
      } else {
        foundColumn.remove();
      }
    } else if (foundColumn === null) {
      if (containerColumns === undefined) {
        containerColumns = document.getElementById("container");
        if (containerColumns === undefined) {
          continue;
        }
      }
      containerColumns.insertAdjacentHTML("beforeend", dataColunm.htmlColumn);
      foundColumn = document.getElementById(dataColunm.idColumn);
      addItems(foundColumn, dataColunm.items);
    } else {
      continue;
    }
  }
  setEventsItems();
  setEventsColumns();
}

function updateDataChoice(dataJson) {
  let dataStructure = JSON.parse(dataJson);
  if (dataStructure["currentProjectName"] != undefined) {
    document.getElementsByClassName("choice__choice-project-ref")[0].innerText =
      dataStructure["currentProjectName"]; /* Обновление проекта в шапке */
  }
  if (dataStructure["currentExecutorName"] != undefined) {
    document.getElementsByClassName(
      "choice__current-executor-button"
    )[0].innerText =
      dataStructure[
        "currentExecutorName"
      ]; /* Обновление текущего исполнителя в шапке */
  }
}

function addItems(column, arrItems) {
  if (arrItems.length > 0) {
    for (let i in arrItems) {
      let textItem = arrItems[i];
      column.insertAdjacentHTML("beforeend", textItem);
    }
  }
}

function partlyUpdatePage(dataJson) {
  let dataStructure = JSON.parse(dataJson);
  let foundItem = document.getElementById(dataStructure.idItem);
  if (foundItem != null) {
    updateDataCart(foundItem, dataStructure.updateData);
    let idColumnFound = getIdColumn(foundItem);
    if (idColumnFound != dataStructure.idColumn) {
      let columnFound = document.getElementById(dataStructure.idColumn);
      let cloneItem = foundItem.cloneNode(true);
      columnFound.append(cloneItem);
      foundItem.remove();
      setEventsItems();
    }
  }
}

function getIdColumn(elementDOM) {
  if (elementDOM.className == "column") {
    return elementDOM.id;
  } else {
    return getIdColumn(elementDOM.parentNode);
  }
}

function updateDataCart(cartElement, updateData) {
  cartElement.getElementsByClassName("item__task-name")[0].innerText =
    updateData.taskName;
  cartElement.getElementsByClassName(
    "item__task-deadline_deadline"
  )[0].innerText = updateData.taskDeadline;
  cartElement.getElementsByClassName(
    "item__task-project-color"
  )[0].style.background = updateData.projectColor;

  /* Пока один исполнитель */
  let executorAvatars = cartElement.getElementsByClassName(
    "item__task-executors-avatars"
  )[0].children;
  executorAvatars[0].src = updateData.taskExecutorAvatar;
  executorAvatars[0].title = updateData.taskExecutorName;
}

/* Обработчики событий drag/drop */

function dragStart() {
  dragItemq = this;
  setTimeout(() => (this.className = "invisible"), 0);
}

function dragEnd(e) {
  this.className = "item";
  dragItemq = null;
  idItem = this.id;
  idColumn = e.target.parentElement.id;
  interactionButton.click();
}

function dragDrop(e) {
  this.append(dragItemq);
  e.preventDefault();
  idColumn = e.target.id;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter() {}

function dragLeave() {}

/* Обработчики событий */

/* Общий обработчик для всех нажатий на экран */
window.addEventListener("click", function (e) {
  if (
    e.target.tagName == "A" &&
    e.target.className == "choice__current-executor-item"
  ) {
    let choiceCurrentExecutorDropdownContent = document.getElementById(
      "choiceCurrentExecutorDropdownContent"
    );
    let currentCollection = document.getElementsByClassName(
      "choice__current-executor-button"
    );
    if (currentCollection.length > 0) {
      currentCollection[0].innerHTML = e.target.innerText;
      if (
        choiceCurrentExecutorDropdownContent.classList.contains("show-content")
      ) {
        /* Закрыть раскрывающийся список */
        choiceCurrentExecutorDropdownContent.classList.remove("show-content");
      }
    }
  } else {
    /* Закрыть раскрывающийся список, если пользователь щелкнет за его пределами */
    if (!e.target.matches(".choice__current-executor-button")) {
      let choiceCurrentExecutorDropdownContent = document.getElementById(
        "choiceCurrentExecutorDropdownContent"
      );
      if (
        choiceCurrentExecutorDropdownContent.classList.contains("show-content")
      ) {
        choiceCurrentExecutorDropdownContent.classList.remove("show-content");
      }
    }
    if (!e.target.matches(".choice__btn-more-btn")) {
      let choiceBtnMoreDropdownContent = document.getElementById(
        "choiceBtnMoreDropdownContent"
      );
      if (choiceBtnMoreDropdownContent.classList.contains("show-content")) {
        choiceBtnMoreDropdownContent.classList.remove("show-content");
      }
    }
  }
});

window.addEventListener("scroll", function (e) {
  let vertical_position = 0;
  let columnHeaders_divs = document.getElementsByClassName("column-header");
  vertical_position = this.scrollY;
  for (let i = 0; i < columnHeaders_divs.length; i++) {
    let current_div = columnHeaders_divs.item(i);
    if (this.scrollY > previousYOffset) {
      if (vertical_position > valueMargin) {
        current_div.style.top = vertical_position - valueMargin + "px";
      }
    } else {
      if (vertical_position == valueMargin) {
        current_div.style.top = 0 + "px";
      } else if (vertical_position < valueMargin) {
        current_div.style.top = vertical_position - vertical_position + "px";
      } else {
        current_div.style.top = vertical_position - valueMargin + "px";
      }
    }
    previousYOffset = this.scrollY;
  }
});

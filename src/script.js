/* Инициализация */
let btnOnlyExecutorChecked = null;
let previousYOffset = 0;
let valueMargin = 33;

let containerPage = document.getElementById("container");
let headerPage = document.getElementById("header");

let dragItemq = null;
let idItem = null;
let idColumn = null;
let idColumnOld = null;

let items = null;
let columns = null;

/* Установка значений переменных CSS */
document.documentElement.style.setProperty("--column-count", columns.length);

/* Функции для вывода и получения данных */
function startRenderPage(rawPageData) {
  pageData = JSON.parse(rawPageData);
  renderHeader(pageData);
  renderColumns(pageData["columns"]);
  setEventsColumns();
  setEventsCards();
  setEventsForPage();
}

function renderHeader(pageData) {
	
	let executorsList = "";
	pageData.executors.forEach((element) => {
		executorsList += `<a href="#" class="choice__current-executor-item" onmousedown="return false">${element.name}</a>`;
	});
	let projectName = pageData.hasOwnProperty("projectName") ? pageData.projectName : "Выберите проект";
	
	let nodeHeader =
	`<div class="choice">
		<div class="choice__executor">
			<button class="choice__executor-only-btn" onclick="onlyExecutorChoice()" title="Нажмите, чтобы установить отбор">Только исполнитель</button>
		</div>
		<span class="choice__divider"></span>
		
		<div class="choice__choice-project">
			<a href="#" class="choice__choice-project-ref" onmousedown="return false" title="Нажмите, чтобы выбрать проект">${projectName}</a>
			<img
			  class="choice__clean-project-img"
			  onmousedown="return false"
			  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAnUlEQVQ4je2QsRHCMAxFHzCMp/nJBIYFWCATsAEDOB0dqGYF7qBUAaOExkWOM+ZIm7zKp2+9kwQLM0bSIKkp1BtJw7e+dcXZAEdJcSSLwDlnRVY/pozAAehyKQE7M0uThB9SgM7M+tr/2sqT2NTCPF0C9sAVSCGEl7vf/xZKEnACtmbWu/sjhPDM0pu7e6mvtvIFaMc3y+82Zwuz5Q1klDSGhMo5OwAAAABJRU5ErkJggg=="
			  title="очистить проект"/>
			<img
			  class="choice__open-project-img"
			  onmousedown="return false"
			  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAYElEQVQ4jWNgGAWUAkZCCnx9ff/jk9+8eTNBM4g2EJscE0mmEwGobiALugCSN45t3rzZmmIDGRjICGgkQHsvYwOEkg7tNDOQ6GVfX9+jVDWQgYHBipACrGFIqbdHAWUAACAJFpqv4uI0AAAAAElFTkSuQmCC"
			  title="открыть карточку проекта"/>
		</div>
		<span class="choice__divider"></span>
		
		<div class="choice__current-executor">
			<button class="choice__current-executor-button" onclick="currentExecutor()" title="Нажмите, чтобы выбрать исполнителя">${pageData.currentExecutor}</button>
			<div class="choice__current-executor-dropdown-content" id="choiceCurrentExecutorDropdownContent">
				${executorsList}
			</div>
		</div>
		
		<div class="choice__btn-more">
			<button class="choice__btn-more-btn" onclick="btnMore()" title="Нажмите, чтобы увидеть дополнительные возможности">Еще</button>
			<div class="choice__btn-more-btn-dropdown-content" id="choiceBtnMoreDropdownContent">
				<a href="#" class="choice__btn-more-btn-item" onmousedown="return false">Обновить страницу</a>
				<a href="#" class="choice__btn-more-btn-item" onmousedown="return false">Настройки</a>
			</div>
		</div>
	</div>`
	
	headerPage.insertAdjacentHTML("beforeend", nodeHeader);
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
    tasks += nodeCard(element);
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

function nodeCard(note) {
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
              <a href="#"
                class="item__task-deadline_deadline"
                onmousedown="return false"
                title="срок выполнения">${note.deadline}</a>
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
          <div class="item_task-more"></div>
        </div>
        `;
}

function getIdColumn(elementDOM) {
  if (elementDOM.className == "column") {
    return elementDOM.id;
  } else {
    return getIdColumn(elementDOM.parentNode);
  }
}

function getParameterValue(pName = "") {
	if (pName == "btnOnlyExecutorChecked") {
		return btnOnlyExecutorChecked;
	}
}

function getPosition() {
  if (idItem != null || idColumn != null) {
    let position = {
      idItem: idItem,
      idColumn: idColumn,
	  idColumnOld: idColumnOld
    };
    idItem = null;
    idColumn = null;
	idColumnOld = null;
    return JSON.stringify(position);
  } else {
    return "";
  }
}


/* Функции для обновления данных */
function updateTheCard(rawData) {
  let updateData = JSON.parse(rawData);
  let card = document.getElementById(updateData.id);
  card.getElementsByClassName(
    "item__task-name")[0].innerText = updateData.name; /* Наименование карточки */
  card.getElementsByClassName(
    "item__task-deadline_deadline")[0].innerText = updateData.deadline; /* Сроки */
  card.getElementsByClassName(
    "item__task-project-color")[0].style.background = updateData.projectColor; /* Цвет проекта */
  
  /* Данные исполнителя */
  let executorAvatars = card.getElementsByClassName(
      "item__task-executors-avatars")[0].children;
    executorAvatars[0].src = updateData.avatarExecutor; /* Аватар строка base64 */
    executorAvatars[0].title = updateData.nameExecutor; /* Имя исполнителя */
}

function updateTheColumns(rawData) {
	let updateData = JSON.parse(rawData);
	updateData.columns.forEach((dataColumn) => {
		let columnFound = document.getElementById(dataColumn.id);
		let itemsColumn = columnFound.getElementsByClassName("item");
        for (let i = itemsColumn.length - 1; i >= 0; i--) {
          itemsColumn[i].remove();
        }
		addCards(columnFound, dataColumn.tasks);
	});
	setEventsCards();
}

function updateDataHeader(rawData) {
	let updateData = JSON.parse(rawData);
	document.getElementsByClassName("choice__choice-project-ref")[0].innerText = updateData.projectName; /* Обновление проекта в шапке */
}

function addCards(column, arrCards) {
  if (arrCards.length > 0) {
    for (let i in arrCards) {
      column.insertAdjacentHTML("beforeend", nodeCard(arrCards[i]));
    }
  }
}


/* Функции установки событий */
function setEventsColumns() {
  columns = document.querySelectorAll(".column");
  columns.forEach((column) => {
    column.addEventListener("dragover", dragOver);
    column.addEventListener("dragenter", dragEnter);
    column.addEventListener("dragleave", dragLeave);
    column.addEventListener("drop", dragDrop);
  });
}

function setEventsCards() {
  items = document.querySelectorAll(".item");
  items.forEach((item) => {
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragend", dragEnd);
  });
}

function setEventsForPage() {
	window.addEventListener("click", clickProcessing);
	window.addEventListener("scroll", scrollProcessing);
}


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

function moreInfoCard() {
  return; /* TODO */
}


/* Обработчики событий drag/drop */
function dragStart(e) {
  dragItemq = this;
  idColumnOld = e.target.parentElement.id;
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

function dragEnter() { }

function dragLeave() { }


/* Обработчики событий */
function clickProcessing(e) {
	if (e.target.tagName == "A" && e.target.className == "choice__current-executor-item") {
		let choiceCurrentExecutorDropdownContent = document.getElementById("choiceCurrentExecutorDropdownContent");
		let currentCollection = document.getElementsByClassName("choice__current-executor-button");
		if (currentCollection.length > 0) {
			currentCollection[0].innerHTML = e.target.innerText;
			if (choiceCurrentExecutorDropdownContent.classList.contains("show-content")) {
				/* Закрыть раскрывающийся список */
				choiceCurrentExecutorDropdownContent.classList.remove("show-content");
			}
		}
	} else {
		/* Закрыть раскрывающийся список, если пользователь щелкнет за его пределами */
		if (!e.target.matches(".choice__current-executor-button")) {
			let choiceCurrentExecutorDropdownContent = document.getElementById("choiceCurrentExecutorDropdownContent");
			if (choiceCurrentExecutorDropdownContent.classList.contains("show-content")) {
				choiceCurrentExecutorDropdownContent.classList.remove("show-content");
			}
		}
		if (!e.target.matches(".choice__btn-more-btn")) {
			let choiceBtnMoreDropdownContent = document.getElementById("choiceBtnMoreDropdownContent");
			if (choiceBtnMoreDropdownContent.classList.contains("show-content")) {
				choiceBtnMoreDropdownContent.classList.remove("show-content");
			}
		}
	}
}

function scrollProcessing() {
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
}

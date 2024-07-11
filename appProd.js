'use strict';

//// Get Element DOM
const tableQuery = document.querySelector(
  '.table.table-bordered.table-condensed.table-striped.show-mrtable.table-merchants-requests>tbody'
);
// console.log(tableQuery);

const trIdBody = document.querySelectorAll('tbody>tr');
// console.log(trIdBody);

const sqlText = document.querySelector('#SQLText>code').innerText.split('\n');

/*-------------------------------------------------------------------------------------------------------------------------------------------------------*/

//// Render logic
const thColumn = document.createElement('th');
thColumn.innerText = 'Select a request';
thColumn.style.width = '50px';

const inputCheckAll = document.createElement('input');
inputCheckAll.className = 'inputCheckAll';
inputCheckAll.type = 'checkbox';
inputCheckAll.value = '';
inputCheckAll.title = 'Отметить/Удалить все запросы';
inputCheckAll.style.cursor = 'pointer';

document.querySelector('thead>tr').prepend(thColumn);
thColumn.append(inputCheckAll);

for (const resultElemTr of trIdBody) {
  //   console.log(resultElemTr);
  const inputCheck = document.createElement('input');
  inputCheck.type = 'checkbox';
  inputCheck.className = 'inputCheck';
  inputCheck.value = '';
  inputCheck.id = '';
  inputCheck.style.cursor = 'pointer';

  resultElemTr.prepend(inputCheck);
}

const divTextarea = document.createElement('div');
divTextarea.className = 'container-textarea-result-data-query';

const textareaResultDataQuery = document.createElement('textarea');
textareaResultDataQuery.className = 'textarea-result-data-query';
textareaResultDataQuery.style.width = '940px';
// textareaResultDataQuery.style.width = '540px';
textareaResultDataQuery.style.height = '250px';
textareaResultDataQuery.style.fontSize = '14px';
textareaResultDataQuery.style.padding = '10px';
textareaResultDataQuery.style.margin = '20px 0px 20px 0px';
textareaResultDataQuery.style.outline = 'none';

const divBlockButton = document.createElement('div');
divBlockButton.className = 'div-block-button';

const copyBtnQuery = document.createElement('button');
copyBtnQuery.className = 'btn-copy-query';
copyBtnQuery.textContent = 'Copy Result!';

const copyBtnSQLRequest = document.createElement('button');
copyBtnSQLRequest.className = 'btn-copy-query';
copyBtnSQLRequest.textContent = 'Copy SQL Query';

const divBlockNotify = document.createElement('div');
divBlockNotify.className = 'div-block-notify';

const notifyText = document.createElement('span');
notifyText.className = 'notify-text';

document
  .querySelector(
    '.wrapper.wrapper-content.animated.fadeInRight>.row:nth-child(2)'
  )
  .prepend(divTextarea);
divTextarea.prepend(textareaResultDataQuery);
divTextarea.append(divBlockButton);
divTextarea.append(divBlockNotify);
divBlockButton.prepend(copyBtnQuery);
divBlockButton.append(copyBtnSQLRequest);
divBlockNotify.prepend(notifyText);

/*-------------------------------------------------------------------------------------------------------------------------------------------------------*/

//// Data preparation logic

//Получаем все чекбоксы с страницы в виде HTMLCollection
const checkMerchant = document.getElementsByClassName('inputCheck');
// console.log(checkMerchant);

//Добавляем в input.value значение идетификатора из тега <tr> по каждому блоку запросов
Array.from(checkMerchant).forEach((itemCheck, indexCheck) => {
  for (const indexTR of Object.keys(trIdBody)) {
    if (indexCheck == indexTR) {
      itemCheck.id = indexTR;
    }
  }
});

//Создаём массив и получаем все input элементы и маппим получение всех внутренних дочерних элементов <td> из <tr> таблицы
const checkMerchantAllHTMLCollection = Array.from(checkMerchant).map((el) => {
  return el.parentElement.children;
});
console.log(checkMerchantAllHTMLCollection);

//Получаем массив, в который маппим все значения, которые содержаться отдельные массивы всех элементов из HTMLCollection с страницы из таблицы
const arrayPreDataQuery = checkMerchantAllHTMLCollection.map((el) => {
  return [...el].map((elThisElem) => elThisElem.textContent);
});
console.log(arrayPreDataQuery);

//Добавляем в нулевой элемент массива boolean значение из свойства checked из элементов input (по умолчанию 'false')
let arrayDataQuery = new Array();
for (const item of arrayPreDataQuery) {
  item[0] == ''
    ? (item[0] = checkMerchantAllHTMLCollection[0][0].checked)
    : null;
  item[5] !== '' ? item[5] : (item[5] = 'NULL');
  arrayDataQuery.push(item);
}
// console.log(arrayDataQuery);

//Деструтуризаия полученного массива в arrayDataQuery. Преобразования полученных данных в объекты и добавления их в общий массив данных dataQuery
let dataQuery = new Array();
for (const [
  flag,
  col_ID,
  col_Datetime,
  col_Data,
  col_Response,
  col_Comment,
] of arrayDataQuery) {
  // Преобразование данных их массивов с данными в массиве arrayDataQuery (ДЛЯ БУДУЩЕГО ПРОБРАЗОВАНИЯ В ОТДЕЛЬНЫЕ СТРОКИ ВЫВОДА КАК В БД (по надобности))
  const id = col_ID.split('\n').splice(2, 1).toString();
  const direction = col_ID.split('\n').splice(4, 1).toString();
  const status = col_ID
    .split('\n')
    .splice(5, 1)
    .toString()
    .replace('Статус: ', '');
  const dateReq = col_Datetime.substring(0, 19).toString();
  const dateRes = col_Datetime.substring(19, 38).toString();
  const timeQuery = col_Datetime.substring(38).toString();

  const objectQuery = {
    flag: flag,
    id: id,
    direction: direction,
    status: status,
    dateReq: dateReq,
    dateRes: dateRes,
    request: col_Data,
    response: col_Response,
    timeQuery: timeQuery,
    comment: col_Comment,
  };

  dataQuery.push(objectQuery);
}
console.log(dataQuery);

/*-------------------------------------------------------------------------------------------------------------------------------------------------------*/

//// Event lodic

//Производим добавление/удаление ВСЕХ блоков запросов по определённому формату в блок <textarea> при проставлении чекбокса в ячейке "Select a request"
function checkedAllQuery(renderDataQueryCheck) {
  if (inputCheckAll.checked === true) {
    checkMerchantAllHTMLCollection.forEach((el) => {
      el[0].checked = inputCheckAll.checked;
      console.log(el[0].checked);
    });
    dataQuery.forEach((item) => {
      item.flag = true;
      renderDataQueryCheck(item);
    });
  } else {
    checkMerchantAllHTMLCollection.forEach((el) => (el[0].checked = false));
    dataQuery.forEach((item) => {
      item.flag = false;
      textareaResultDataQuery.innerHTML = '';
    });
  }
}

//Запускаем обработчик события клика по чекбоксу у блока с конкретным запросом из списка (событие отрабатывает индивидуально каждый раз при клике по каждому чекбоксу в отдельности)
Array.from(checkMerchant).forEach((elementCheck) => {
  elementCheck.addEventListener('click', () =>
    workCheched(elementCheck, renderDataQueryCheck)
  );
});

//Запускаем обработчик события клика по чекбоксу из ячейки "Select a request" для для добавления/удаления всех запросов в блок <textarea>. Чекбоксы в списке запросов просталяются/снимаются автоматически
inputCheckAll.addEventListener('click', () =>
  checkedAllQuery(renderDataQueryCheck)
);

//Запускаем обработчик события клика по кнопке "Copy Result"
copyBtnQuery.addEventListener('click', copyDataQuery);

//Запускаекм обработчик события клика по кнопке "Copy SQL Query"
copyBtnSQLRequest.addEventListener('click', () =>
  copyDataSQLQuery(sqlFotmater())
);

/*-------------------------------------------------------------------------------------------------------------------------------------------------------*/

//// Main logic

//Производим изменение значения ключа "flag" в заивисмости от checked/unchecked чекбоса
function workCheched(check, renderDataQueryCheck) {
  if (check.checked === true) {
    dataQuery.forEach((item, ind) => {
      if (check.id == ind) {
        item.flag = true;
        renderDataQueryCheck(item);
      }
    });
  } else {
    dataQuery.forEach((item, ind) => {
      if (check.id == ind) {
        item.flag = false;
        if (item.flag == false) {
          textareaResultDataQuery.innerHTML = '';
          dataQuery.filter((elFilter) => {
            try {
              if (elFilter.flag == true) {
                dataQuery.sort((a, b) => a > b);
                renderDataQueryCheck(elFilter);
              }
            } catch (error) {
              console.log(`Error>>> ${error}`);
            }
          });
        }
      }
    });
  }

  console.log(dataQuery);
}

//Отображаем/убираем checked/unchecked данные из запросов в блоке textarea
function renderDataQueryCheck(itemDataQuery) {
  const queryStringData =
    '******************************************************\n'
      .concat('ID: ' + itemDataQuery.id + '\n')
      .concat('Direction: ' + itemDataQuery.direction + '\n')
      .concat('DateRequest: ' + itemDataQuery.dateReq + '\n')
      .concat('DateResponse: ' + itemDataQuery.dateRes + '\n')
      .concat('Request: ' + itemDataQuery.request + '\n')
      .concat('Response: ' + itemDataQuery.response + '\n')
      .concat('Status: ' + itemDataQuery.status + '\n')
      .concat('TimeQuery: ' + itemDataQuery.timeQuery + '\n')
      .concat('Comment: ' + itemDataQuery.comment + '\n');

  return (textareaResultDataQuery.innerHTML += queryStringData);
}

//Функция копирования результата добавленных блоков запросов из textarea
function copyDataQuery() {
  const textareaVal = textareaResultDataQuery.value.trim();
  if (textareaVal !== '') {
    navigator.clipboard
      .writeText(textareaVal)
      .then((resultCopy) => {
        if (resultCopy == undefined) {
          copyBtnQuery.textContent = 'Copied!';
          setTimeout(() => {
            copyBtnQuery.textContent = 'Copy Result';
          }, 1000);
        }
      })
      .catch((error) => {
        console.log(`Error>>> ${error}`);
      });
  }
  validCopyData(textareaVal);
}

//Функция валидации копирования данных из textarea
function validCopyData(isCopy) {
  if (!isCopy) {
    notifyText.textContent = 'Отметьте блоки с запрсоами для копирования';
    textareaResultDataQuery.style.boxShadow = '0 0 0 1px red';
    textareaResultDataQuery.style.borderColor = 'red';
    divBlockNotify.classList.add('element-active-empty');
    if (divBlockNotify.classList.contains('element-active-done')) {
      divBlockNotify.classList.remove('element-active-done');
      divBlockNotify.classList.add('element-active-empty');
    }
  } else {
    notifyText.textContent = 'Данные успешно скопированы!';
    textareaResultDataQuery.style.boxShadow = '0 0 0 1px #2AAF40';
    textareaResultDataQuery.style.borderColor = '#2AAF40';
    divBlockNotify.classList.add('element-active-done');
    if (divBlockNotify.classList.contains('element-active-empty')) {
      divBlockNotify.classList.remove('element-active-empty');
      divBlockNotify.classList.add('element-active-done');
    }
  }
  divBlockNotify.style.opacity = '1';
  setTimeout(() => {
    divBlockNotify.style.opacity = '0';
  }, 2500);
}

//Форнматируем полученный массив строк из SQL. Подготовливаем строку для копирования данных
function sqlFotmater() {
  const newArraySQLData = sqlText.filter((el) => el !== '');
  let newStringSQLData;
  for (const item of newArraySQLData) {
    newStringSQLData += item.trimStart() + ' ';
  }

  const resultSQLDataString = newStringSQLData
    .replace('undefined', '')
    .replace('LIMIT 200', '\\G;')
    .trim();

  return resultSQLDataString;
}

//Функция копирования полученной строки SQL-запроса в формате вставки для прямого запроса в БД
function copyDataSQLQuery(sqlFotmater) {
  try {
    if (sqlFotmater) {
      navigator.clipboard
        .writeText(sqlFotmater)
        .then((copySQL) => {
          if (copySQL == undefined) {
            copyBtnSQLRequest.textContent = 'Copied!';
            copyBtnSQLRequest.style.borderColor = '##04e85a';
            setTimeout(() => {
              copyBtnSQLRequest.textContent = 'Copy SQL Query';
              copyBtnSQLRequest.style.borderColor = '#01a9b6';
            }, 1000);
          }
        })
        .catch((error) => console.log(`Error>>> ${error}`));
    }
  } catch (error) {
    console.log(`Error>>> ${error}`);
  }
}

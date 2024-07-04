'use strict';

//// Get Element DOM
const tableQuery = document.querySelector(
  '.table.table-bordered.table-condensed.table-striped.show-mrtable.table-merchants-requests>tbody'
);
// console.log(tableQuery);

const trIdBody = document.querySelectorAll('tbody>tr');
// console.log(trIdBody);

/*-------------------------------------------------------------------------------------------------------------------------------------------------------*/

//// Render logic11
const thColumn = document.createElement('th');
thColumn.innerText = 'Select a request';
document.querySelector('thead>tr').prepend(thColumn);

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
// textareaResultDataQuery.style.width = '940px';
textareaResultDataQuery.style.width = '540px';
textareaResultDataQuery.style.height = '250px';
textareaResultDataQuery.style.fontSize = '14px';
textareaResultDataQuery.style.padding = '10px';
textareaResultDataQuery.style.marginBottom = '20px';

document
  .querySelector(
    '.wrapper.wrapper-content.animated.fadeInRight>.row:nth-child(2)'
  )
  .prepend(divTextarea);
divTextarea.prepend(textareaResultDataQuery);

/*-------------------------------------------------------------------------------------------------------------------------------------------------------*/

//// Data preparation logic

//Получаем все чекбоксы с страницы в виде HTMLCollection
const checkMerchant = document.getElementsByClassName('inputCheck');
console.log(checkMerchant);

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
  return [...el].map((elThisElem) => elThisElem.innerText);
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
console.log(arrayDataQuery);

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
  const id = col_ID.split('\n').splice(0, 1).toString();
  const direction = col_ID.split('\n').splice(2, 1).toString();
  const status = col_ID
    .split('\n')
    .splice(3, 1)
    .toString()
    .replace('Статус: ', '');
  const dateReq = col_Datetime.split('\n').splice(0, 1).toString();
  const dateRes = col_Datetime.split('\n').splice(1, 1).toString();
  const timeQuery = col_Datetime.split('\n').splice(2, 1).toString();

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

Array.from(checkMerchant).forEach((elementCheck) => {
  elementCheck.addEventListener('click', () =>
    workCheched(elementCheck, renderDataQueryCheck)
  );
});

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

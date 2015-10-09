'use strict';

var phoneBook = [];

/*
 Функция добавления записи в телефонную книгу.
 На вход может прийти что угодно, будьте осторожны.
 */
module.exports.add = function add(name, phone, email) {

    function isValidPhone(phone) {
        return /^((\+?\d{1,4})[\- ]?)?((\(\d{3}\)|\d{3})[\- ]?)[\d\- ]{7,10}$/.test(phone);
    }

    function isValidEmail(email) {
        return /^[\w\d\.-]+@([\w\u0410-\u044F\d-]+)(\.[\w\u0410-\u044F\d]+)+$/.test(email);
    }

    var countAdd = 0;

    if (isValidPhone(phone) && isValidEmail(email)) {
        var person = {
            name: name,
            phone: phone,
            email: email
        };
        phoneBook.push(person);
        countAdd++;
    }
    return countAdd;
};

/*
    Функция ищет индексы элементов, соответствующих переданному запросу.
 */
function findRecords(query) {
    var foundRecords = [];
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].name.indexOf(query) >= 0 ||
            phoneBook[i].phone.indexOf(query) >= 0 ||
            phoneBook[i].email.indexOf(query) >= 0) {
            foundRecords.push(i);
        }
    }
    return foundRecords;
}


/*
   Функция поиска записи в телефонную книгу.
   Поиск ведется по всем полям.
*/
module.exports.find = function find(query) {
    var foundRecord;
    if (query) {
        var foundRecords = findRecords(query);
        for (var i = 0; i < foundRecords.length; i++) {
            foundRecord = phoneBook[foundRecords[i]];
            console.log(foundRecord.name + ', ' + foundRecord.phone + ', ' + foundRecord.email);
        }
    } else {
        for (var j = 0; j < phoneBook.length; j++) {
            foundRecord = phoneBook[j];
            console.log(foundRecord.name + ', ' + foundRecord.phone + ', ' + foundRecord.email);
        }
    }
};


/*
    Функция удаления записи в телефонной книге.
 */
module.exports.remove = function remove(query) {
    var toDel = findRecords(query);
    for (var i = 0; i < toDel.length; i++) {
        phoneBook.splice(toDel[i], 1);
    }
    console.log('Удалено контактов: ' + toDel.length.toString());
};


/*
    Функция импорта записей из файла (задача со звёздочкой!).
 */
module.exports.importFromCsv = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8').split('\n');
    var temp;
    var countExp = 0;
    for (var i = 0; i < data.length; i++) {
        temp = data[i].split(';');
        countExp += module.exports.add(temp[0], temp[1], temp[2]);
    }
    console.log('Добавлено контактов: ' + countExp.toString());
};


/*
    Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
 */
module.exports.showTable = function showTable() {

    var cellWidth = 30;

    function chopString(string, len) {
        if (string.length <= len) {
            return string;
        } else {
            return string.substring(0, len - 3) + '...';
        }
    }

    function createLine(start, middle, end, line) {
        line = line || '─';
        var cellWidthArray = new Array(cellWidth + 1);
        return start + cellWidthArray.join(line) +
            middle + cellWidthArray.join(line) +
            middle + cellWidthArray.join(line) +
            end + '\n';
    }


    function createStartLine() {
        return createLine('\n╭', '┬', '╮');
    }

    function createIntermediateLine() {
        return createLine('├', '┼', '┤');
    }

    function createThickIntermediateLine() {
        return createLine('┝', '┿', '┥', '━');
    }

    function createEndLine() {
        return createLine('╰', '┴', '╯');
    }

    function createTextLine(name, phone, email) {

        name = chopString(name, cellWidth - 1);
        phone = chopString(phone, cellWidth - 1);
        email = chopString(email, cellWidth - 1);

        return '│ ' + name + new Array(cellWidth - name.length).join(' ') +
            '│ ' + phone + new Array(cellWidth - phone.length).join(' ') +
            '│ ' + email + new Array(cellWidth - email.length).join(' ') +
            '│\n';
    }

    var header = [{name: 'Имя', phone: 'Телефон', email: 'email'}];

    console.log(header.concat(phoneBook).reduce(function (prev, curr, idx, array) {
        var result = prev + createTextLine(curr.name, curr.phone, curr.email);
        if (idx === 0) {
            result += createThickIntermediateLine();
        } else if (idx === array.length - 1) {
            result += createEndLine();
        } else {
            result += createIntermediateLine();
        }
        return result;
    }, createStartLine()));

};

'use strict';

var fs = require('fs');

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

    if (isValidPhone(phone) && isValidEmail(email)) {
        var person = {
            name: name,
            phone: phone,
            email: email
        };
        phoneBook.push(person);
        return true;
    }
    return false;
};

/*
    Функция ищет индексы элементов, соответствующих переданному запросу.
 */
function findRecords(query) {
    var foundRecords = [];
    query = (query || '').toLowerCase();
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].name.toLowerCase().indexOf(query) >= 0 ||
            phoneBook[i].phone.indexOf(query) >= 0 ||
            phoneBook[i].email.toLowerCase().indexOf(query) >= 0) {
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
    var foundRecords = query ? findRecords(query).map(function (idx) {
        return phoneBook[idx];
    }) : phoneBook;
    foundRecords.forEach(function (record) {
        console.log(record.name + ', ' + record.phone + ', ' + record.email);
    });
};


/*
    Функция удаления записи в телефонной книге.
 */
module.exports.remove = function remove(query) {
    var toDel = findRecords(query);
    phoneBook = phoneBook.filter(function (obj, idx) {
        return toDel.indexOf(idx) < 0;
    });
    console.log('Удалено контактов: ' + toDel.length.toString());
};


/*
    Функция импорта записей из файла (задача со звёздочкой!).
 */
module.exports.importFromCsv = function importFromCsv(filename) {
    var data = fs.readFileSync(filename, 'utf-8').split('\n');
    var temp;
    var countExp = 0;
    for (var i = 0; i < data.length; i++) {
        temp = data[i].split(';');
        if (module.exports.add(temp[0], temp[1], temp[2])) {
            countExp++;
        }
    }
    console.log('Добавлено контактов: ' + countExp.toString());
};


/*
    Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
 */
module.exports.showTable = function showTable() {

    var cellWidth = 30;

    function repeatString(string, times) {
        return new Array(times + 1).join(string);
    }

    function chopString(string, len) {
        if (string.length <= len) {
            return string;
        } else {
            return string.substring(0, len - 3) + '...';
        }
    }

    function createLine(start, middle, end, line) {
        line = line || '─';
        var longLine = repeatString(line, cellWidth);
        return start + longLine + middle + longLine + middle + longLine + end + '\n';
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
        email = chopString(email, cellWidth - 1);

        return '│ ' + name + repeatString(' ', cellWidth - name.length - 1) +
            '│ ' + phone + repeatString(' ', cellWidth - phone.length - 1) +
            '│ ' + email + repeatString(' ', cellWidth - email.length - 1) +
            '│\n';
    }

    var header = [{name: 'Имя', phone: 'Телефон', email: 'email'}];

    console.log(header.concat(phoneBook).reduce(function (result, curr, idx, array) {
        result = result + createTextLine(curr.name, curr.phone, curr.email);
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

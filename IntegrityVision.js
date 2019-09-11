const objectsArray = [
  {
    fullName: {
      surname: 'xxx',
      firstName: 'yyy',
      middleName: 'zzz',
      date: '10.09.2019',
      boolean: true
    }
  },
  {
    fullName: {
      surname: 'XXX',
      firstName: 'YYY',
      middleName: 'ZZZ',
      date: '10.09.2019',
      boolean: false
    }
  }
]

const transformRules = {
  fullName: {
    surname: true,
    firstName: true,
    middleName: false,
    date: true,
    boolean: true,
  }
}

const locals = {
  "fullName.surname": "Прiзвище",
  "fullName.middleName": "По-батьковi",
}

let isArray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}

const isObject = obj => {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

const path = (transformRule) => {
  let pathsArray = {};

  const searchPath = (branch, str) => {
    Object.keys(branch).forEach(function (key) {
      if (isArray(branch[key]) || isObject(branch[key]))
        searchPath(branch[key], str ? str + "." + key : key);
      else
        pathsArray[key] = str ? str + "." + key : key;
    });
  }

  searchPath(transformRule, "");
  return pathsArray;
}
const objectRecursive = (object, transformRules, path, store) => {
  for(key in object) {
    let value = object[key]

    if(typeof value == 'object') {
      objectRecursive(value, transformRules[key], path, store)
    } else {
      if(transformRules[key] === false) {
        delete object[key]
        continue;
      }
      if( typeof value == 'boolean'){
        if(value == true){
          value = 'Так'
        }
        else {
          value = 'Ні'
        }
      }

      const pushObject = {
        name: checkLocalization(key, path),
        value
      }

      store.push(pushObject)

    }
  }
  return store
}

const changedObject = (object, transformRules, path) => {
  let store = []
  let secondObject = objectRecursive(object, transformRules, path, store)
  return secondObject
}

const checkLocalization = (key, path) => {
  let title = locals[path[key]]

  if(title == undefined) {
    title = key
  }

  return title
}

const concatObject = (arr) => {
  let concatedObject = JSON.parse(JSON.stringify(arr[0]))
  for(let i = 1; i < arr.length; i++) {

    for(key in arr[i]) {
      let index = concatedObject.findIndex(obj => obj.name == arr[i][key].name )

      concatedObject[index][`value${i+1}`] = arr[i][key].value
    }
  }

  return concatedObject
}

const restructureArray = (array) => {
  let restructuredArray = []

  for(let arrayIndex = 0; arrayIndex < array.length; arrayIndex++) {
    let pathLocal = path(array[arrayIndex])
    restructuredArray.push(changedObject(array[arrayIndex], transformRules, pathLocal))
  }


  return concatObject(restructuredArray)
}

console.log('[RestructuringArray]: ', objectsArray)
console.log('restructuredArray', restructureArray(objectsArray))

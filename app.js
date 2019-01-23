"use strict";
// -------------------------------- BUDGET CONTROLLER ----------------------------------

// BUDGET CONTROLLER
var budgetController = (function() {
  //  Create objects with input values
  var Income = function(id, type, description, value) {
    this.id = id;
    this.type = type;
    this.desc = description;
    this.value = value;
  };

  var Expence = function(id, type, description, value) {
    this.id = id;
    this.type = type;
    this.desc = description;
    this.value = value;
  };

  // DATA
  var data = {
    allItems: {
      inc: [],
      exp: []
    },
    total: {
      inc: [],
      exp: []
    },
    budget: 0
  };

  // Calculate Total Incomes and Expences
  var calcTotal = function(arr) {
    var sum = 0;

    for (var i = 0; i < arr.length; i++) {
      sum += +arr[i].value;
    }

    return sum;
  };

  // Delete Item
  var deleteItem = function(obj) {
    for (var i = 0; i < data.allItems[obj.type].length; i++) {
      // If elements ID === index, delete element from array
      if (data.allItems[obj.type][i].id == obj.index) {
        data.allItems[obj.type].splice(i, 1);

        data.total[obj.type].splice(i, 1);
      }
    }
  };

  return {
    // Create a new object and add to the data
    addItem: function(type, description, value) {
      var newItem, id;

      // Define ID
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      // Create new Income or Expence object
      if (type === "inc") {
        newItem = new Income(id, type, description, value);
      } else if (type === "exp") {
        newItem = new Expence(id, type, description, value);
      }

      // Add object to data
      data.allItems[type].push(newItem);

      // Add values to data
      data.total[type].push(newItem);

      return newItem;
    },

    // Delete Item
    deleteListItem: function() {
      var id = event.target.closest(".item").id;

      var arr = id.split("-");

      var obj = {
        type: arr[0],
        index: arr[1]
      };

      deleteItem(obj);
    },

    // Calculate Budget
    calculateBudget: function() {
      var income = calcTotal(data.total.inc);
      var expence = calcTotal(data.total.exp);

      data.budget = income - expence;

      if (income) {
        var perc = Math.round((expence / income) * 100);
      } else {
        perc = -1;
      }

      var allAmounts = {
        inc: income,
        exp: expence,
        budget: data.budget,
        perc: perc
      };

      return allAmounts;
    },

    calcPercentages: function() {
      var item = data.allItems.exp[0];
    },

    // storage Data in local storage
    setStorage: function() {
      localStorage.setItem("data", JSON.stringify(data));
    },

    // Get Data from local storage
    getStorage: function() {
      var localData = JSON.parse(localStorage.getItem("data"));
      return localData;
    },

    // Update Data
    updateData: function(storedData) {
      data.allItems = storedData.allItems;
      data.total = storedData.total;
      data.budget = storedData.budget;
    },
  };
})();

// -------------------------------- UI CONTROLLER ----------------------------------

// UI CONTROLLER
var UIController = (function() {
  // DOM elements
  var DOMelements = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    container: ".container",
    inc: ".income__list",
    exp: ".expenses__list",
    budgetOut: ".budget__value",
    incomeOut: ".budget__income--value",
    expenceOut: ".budget__expenses--value",
    expencePerc: ".budget__expenses--percentage",
    date: ".budget__title--month"
  };

  // New DOM Element classes
  var newDOM = {
    listItem: "item clearfix",
    itemDesc: "item__description",
    itemRight: "right clearfix",
    itemValue: "item__value",
    itemDel: "item__delete",
    itemButton: "item__delete--btn",
    perc: "item__percentage"
  };

  // Create Element
  var createElement = function(elem, obj, ...children) {
    var element = document.createElement(elem);

    for (var key in obj) {
      element[key] = obj[key];
    }

    if (children.length > 0) {
      children.forEach(function(child) {
        if (typeof child === "string" || typeof child === "number") {
          child = document.createTextNode(child);
        }

        element.appendChild(child);
      });
    }

    return element;
  };

  // Get Current Month and Year
  var getDate = function() {
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    var date = new Date();

    var currentDate = " " + months[date.getMonth()] + " " + date.getFullYear();

    return currentDate;
  };

  // Format number
  var formatNumber = function(num, type) {
    var numberSplit, int, dec;

    num = Math.abs(num).toFixed(2);

    numberSplit = num.split(".");

    int = numberSplit[0];
    dec = numberSplit[1];

    if (int.length > 3) {
      int =
        int.substr(0, int.length - 3) +
        "," +
        int.substr(int.length - 3, int.length);
    }

    return (type === "inc" ? "+" : "-") + " " + int + "." + dec;
  };

  return {
    // Get DOM elements class names
    getDOM: function() {
      return DOMelements;
    },

    // Get Values from inputs
    getValues: function() {
      return {
        type: document.querySelector(DOMelements.inputType).value,
        description: document.querySelector(DOMelements.inputDescription).value,
        value: document.querySelector(DOMelements.inputValue).value
      };
    },

    // Clear input
    clearInput: function() {
      document.querySelector(DOMelements.inputDescription).value = "";
      document.querySelector(DOMelements.inputValue).value = "";

      document.querySelector(DOMelements.inputDescription).focus();
    },

    // Add new item to UI
    addListItem: function(obj) {
      var percentage = "";
      var itemPerc = "";

      // Clear HTML
      document.querySelector(DOMelements.inc).innerHTML = "";
      document.querySelector(DOMelements.exp).innerHTML = "";

      // Create new listItem
      for (var key in obj) {
        for (var i = 0; i < obj[key].length; i++) {
          
          var itemBtn = createElement(
            "div",
            { className: newDOM.itemButton },
            "x"
          );
          var itemDel = createElement(
            "div",
            { className: newDOM.itemDel },
            itemBtn
          );
          var itemDesc = createElement(
            "div",
            { className: newDOM.itemValue },
            obj[key][i].value
          );
          var itemRight = createElement(
            "div",
            { className: newDOM.itemRight },
            itemDesc,
            itemPerc,
            itemDel
          );
          var itemTitle = createElement(
            "div",
            { className: newDOM.itemDesc },
            obj[key][i].desc
          );
          var listItem = createElement(
            "div",
            {
              className: newDOM.listItem,
              id: obj[key][i].type + "-" + obj[key][i].id
            },
            itemTitle,
            itemRight
          );
          var wrapper = createElement(
            "div",
            { className: ".wrapper" },
            listItem
          );

          var text = wrapper.innerHTML;

          // Write new HTML
          document.querySelector(
            DOMelements[obj[key][i].type]
          ).innerHTML += text;
        }
      }
    },

    // Display BUDGET
    displayBudget: function(obj) {
      var type;

      obj.budget >= 0 ? (type = "inc") : (type = "exp");

      document.querySelector(DOMelements.budgetOut).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMelements.incomeOut).textContent = formatNumber(
        obj.inc,
        "inc"
      );
      document.querySelector(DOMelements.expenceOut).textContent = formatNumber(
        obj.exp,
        "exp"
      );

      if (obj.perc > 0) {
        document.querySelector(DOMelements.expencePerc).textContent =
          obj.perc + "%";
      } else {
        document.querySelector(DOMelements.expencePerc).textContent = "---";
      }
    },

    // Display Date
    displayDate: function() {
      document.querySelector(DOMelements.date).textContent = getDate();
    },

    // Change input color
    changeInput: function() {
      var fields = document.querySelectorAll(
        DOMelements.inputType +
          "," +
          DOMelements.inputDescription +
          "," +
          DOMelements.inputValue
      );

      for (var i = 0; i < fields.length; i++) {
        fields[i].classList.toggle("red-focus");
      }

      document.querySelector(DOMelements.addBtn).classList.toggle("red");
    }
  };
})();

// -------------------------------- APPLICATION CONTROLLER ----------------------------------

// APP CONTROLLER
var appController = (function(budgetCtrl, UICtrl) {
  // Get DOM elements
  var DOM = UICtrl.getDOM();

  // Set Event on Add Button
  var setEventListeners = function() {
    document.querySelector(DOM.addBtn).addEventListener("click", function() {
      addItem();
    });

    // Set event on ENTER key
    document.body.addEventListener("keypress", function(event) {
      if (event.keyCode === 13) {
        addItem();
      }
    });

    // Set event on Delete Button
    document
      .querySelector(DOM.container)
      .addEventListener("click", function(event) {
        if (event.target.className === "item__delete--btn") {
          deleteItem();
        }
      });

    // Add class red-focus for inputs
    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UICtrl.changeInput);
  };

  // UPDATE DATA
  var updateData = function() {
    // Get data from local storage
    var storedData = budgetCtrl.getStorage();

    // Update data using stored data
    if (storedData) {
      budgetCtrl.updateData(storedData);

      // Display list Items
      UICtrl.addListItem(storedData.allItems);
    }

    // Display Budget
    var budget = budgetCtrl.calculateBudget();

    UICtrl.displayBudget(budget);
  };

  // ADD NEW ITEM
  var addItem = function() {
    // Get Input Values
    var input = UICtrl.getValues();

    // If inputs are empty, block adding item
    if (input.description && input.value) {
      // Get New Object
      budgetCtrl.addItem(input.type, input.description, input.value);

      // Calculate budget
      budgetCtrl.calculateBudget();

      // Set data to local storage
      budgetCtrl.setStorage();

      // get updated data from local storage
      var storage = budgetCtrl.getStorage();

      // Add new listItem
      UICtrl.addListItem(storage.allItems);
    }
    // Clear Input
    UICtrl.clearInput();

    UICtrl.displayBudget(budgetCtrl.calculateBudget());
  };

  // DELETE ITEM
  var deleteItem = function(e) {
    // Call Delete function
    budgetCtrl.deleteListItem();

    // Delete from data
    budgetCtrl.setStorage();

    // Update data
    updateData();
  };

  return {
    // Initialization
    init: function() {
      setEventListeners();
      updateData();
      UICtrl.displayDate();
      budgetCtrl.calcPercentages();
    }
  };
})(budgetController, UIController);

appController.init();

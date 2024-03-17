"use-strict";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://shopping-item-tracker-d8bbc-default-rtdb.asia-southeast1.firebasedatabase.app/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const itemsInDB = ref(database, "items");

const inputEl = document.querySelector("#input-el");
const addBtn = document.querySelector("#add-btn");
const ulEl = document.querySelector("#shopping-list");

addBtn.addEventListener("click", function () {
  let inputValue = inputEl.value;
  if (inputValue === "") {
    alert("Enter an Item");
  } else {
    push(itemsInDB, inputValue);
    clearInput();
  }
});

onValue(itemsInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingList();
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
      render(currentItem);
    }
  } else {
    ulEl.innerHTML = "No Items here yet";
  }
});

function clearShoppingList() {
  ulEl.innerHTML = "";
}

function clearInput() {
  inputEl.value = "";
}

function render(item) {
  let itemID = item[0];
  let itemValue = item[1];
  let newEl = document.createElement("li");
  newEl.textContent = itemValue;
  ulEl.append(newEl);

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `items/${itemID}`);

    remove(exactLocationOfItemInDB);
  });
}

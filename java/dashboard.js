// Sample Data
let pantryItems = [];
let shoppingList = [];

// DOM Elements
const inventoryForm = document.getElementById("inventoryForm");
const inventoryItemsList = document.getElementById("inventoryItems");
const recipeSuggestions = document.getElementById("recipeSuggestions");
const expirationAlerts = document.getElementById("expirationAlerts");
const shoppingListDiv = document.getElementById("shoppingList");
const generateShoppingListButton = document.getElementById("generateShoppingList");
const logoutButton = document.getElementById("logoutButton");
const voiceCommandButton = document.getElementById("voiceCommandButton");

// Add Item to Pantry
inventoryForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const itemName = document.getElementById("itemName").value;
  const itemQuantity = document.getElementById("itemQuantity").value;
  const expirationDate = document.getElementById("expirationDate").value;

  const newItem = {
    name: itemName,
    quantity: itemQuantity,
    expiration: expirationDate,
  };

  pantryItems.push(newItem);
  renderInventory();
  checkExpiration();
  suggestRecipes();
  inventoryForm.reset();
});

// Render Inventory List
function renderInventory() {
  inventoryItemsList.innerHTML = "";
  pantryItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} (Qty: ${item.quantity}, Exp: ${item.expiration})</span>
      <button onclick="removeItem(${index})">Remove</button>
    `;
    inventoryItemsList.appendChild(li);
  });
}

// Remove Item from Pantry
function removeItem(index) {
  pantryItems.splice(index, 1);
  renderInventory();
  checkExpiration();
  suggestRecipes();
}

// Check Expiration Dates
function checkExpiration() {
  const today = new Date().toISOString().split("T")[0];
  const expiringItems = pantryItems.filter((item) => item.expiration <= today);

  if (expiringItems.length > 0) {
    expirationAlerts.innerHTML = `
      <p style="color: red;">The following items are expiring soon:</p>
      <ul>
        ${expiringItems.map((item) => `<li>${item.name} (Exp: ${item.expiration})</li>`).join("")}
      </ul>
    `;
  } else {
    expirationAlerts.innerHTML = `<p>No items are expiring soon.</p>`;
  }
}

// Suggest Recipes (Mock Function)
function suggestRecipes() {
  const ingredients = pantryItems.map((item) => item.name).join(", ");
  recipeSuggestions.innerHTML = `
    <p>Based on your pantry items (${ingredients}), here are some recipe ideas:</p>
    <ul>
      <li>Recipe 1</li>
      <li>Recipe 2</li>
      <li>Recipe 3</li>
    </ul>
  `;
}

// Generate Shopping List
generateShoppingListButton.addEventListener("click", () => {
  shoppingList = pantryItems.filter((item) => item.quantity <= 2).map((item) => item.name);
  shoppingListDiv.innerHTML = `
    <p>Shopping List:</p>
    <ul>
      ${shoppingList.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
});

// Voice Recognition with Multilingual Support
voiceCommandButton.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US"; // Default language (can be dynamically changed)
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let step = 1; // Tracks the current step in the process
  let itemName, itemQuantity;

  // Start the voice recognition process
  recognition.start();

  // Step 1: Ask for the item name
  speak("Please say the name of the item.", recognition.lang);

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();

    switch (step) {
      case 1:
        itemName = transcript;
        speak(`You said: ${itemName}. Please say the quantity.`, recognition.lang);
        step = 2;
        break;
      case 2:
        itemQuantity = parseInt(transcript);
        if (isNaN(itemQuantity)) {
          speak("Sorry, I didn't catch that. Please say the quantity again.", recognition.lang);
        } else {
          speak(`You said: ${itemQuantity}. Please manually enter the expiration date.`, recognition.lang);
          document.getElementById("itemName").value = itemName;
          document.getElementById("itemQuantity").value = itemQuantity;
          step = 1; // Reset for the next item
        }
        break;
    }
  };

  recognition.onend = () => {
    if (step !== 1) {
      recognition.start(); // Continue listening for the next step
    }
  };

  recognition.onerror = (event) => {
    console.error("Voice recognition error:", event.error);
    speak("Sorry, there was an error. Please try again.", recognition.lang);
    step = 1; // Reset the process
  };
});

// Text-to-Speech Function with Multilingual Support
function speak(text, lang = "en-US") {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang; // Set the language for speech synthesis
  window.speechSynthesis.speak(utterance);
}

// Logout
logoutButton.addEventListener("click", () => {
  alert("Logging out...");
  window.location.href = "index.html";
});

// Initial Load
renderInventory();
checkExpiration();
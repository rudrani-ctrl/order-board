// --- 1. Firebase Setup ---
const firebaseConfig = {
  // paste your firebase config here
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- 2. Add Order ---
function addOrder() {
  const customer = document.getElementById("customer").value;
  const items = document.getElementById("items").value;
  const notes = document.getElementById("notes").value;

  if (!customer || !items) return alert("Fill all fields");

  db.collection("orders").add({
    customer,
    items,
    notes,
    status: "New",
    timestamp: Date.now()
  });

  document.getElementById("customer").value = "";
  document.getElementById("items").value = "";
  document.getElementById("notes").value = "";
}

// --- 3. Display Orders in Real-Time ---
db.collection("orders").orderBy("timestamp").onSnapshot(snapshot => {
  ["new","preparing","ready","collected"].forEach(s => {
    document.getElementById(s).innerHTML = "";
  });

  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "order";
    div.innerHTML = `
      <strong>${data.customer}</strong><br>
      ${data.items}<br>
      <em>${data.notes}</em><br>
      <button onclick="move('${doc.id}', '${data.status}')">Next →</button>
    `;

    document.getElementById(data.status.toLowerCase()).appendChild(div);
  });
});

// --- 4. Move Order Through Stages ---
function move(id, status) {
  const next = {
    "New": "Preparing",
    "Preparing": "Ready",
    "Ready": "Collected",
    "Collected": "Collected"
  };

  db.collection("orders").doc(id).update({
    status: next[status]
  });
}

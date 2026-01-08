import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const db = getFirestore();
const modal_container = document.getElementById("modal_carpool_container");
const modal_form = document.getElementById("modal_carpool_box");
const close_button = document.getElementById("cancel_button");
const open_button = document.getElementById("open_modal");
const form = document.getElementById("carpool_request");
const submit_button = document.getElementById("submit_button");
form.onsubmit = async function(e) {
    e.preventDefault();
    submit_button.disabled = true;
    const text = {
        Name: document.getElementById("name").value,
        Date: document.getElementById("date").value,
        Time: document.getElementById("time").value,
        Gender: document.getElementById("gender").value,
        PickupPoint: document.getElementById("pickup_point").value,
        Destination: document.getElementById("destination").value,
        Number_of_people: document.getElementById("number_of_people").value,
        Contact_details: document.getElementById("contact_details").value,
        Vehicle_details: document.getElementById("vehicle_details").value,
        Additional_Details: document.getElementById("additional_information").value,
        Timestamp: serverTimestamp()
    };
    try {
        await addDoc(collection(db, "rides"), text);
        console.log("form data", text);
        form.reset();
        modal_container.classList.remove("display");
        modal_container.classList.add("hide_modal");
    } catch (error) {
        console.error(error);
    } finally {
        submit_button.disabled = false;
    }
}
modal_container.onclick = function(event) {
    if (event.target === modal_container) {
        modal_container.classList.remove("display");
        modal_container.classList.add("hide_modal");
    }
};
close_button.onclick = function() {
    modal_container.classList.remove("display");
    modal_container.classList.add("hide_modal");
};
open_button.onclick = function() {
    modal_container.classList.add("display");
    modal_container.classList.remove("hide_modal");
};

onSnapshot(q, (snapshot) => {
    const feed = document.getElementById("cabpool_page");

    snapshot.docChanges().forEach((change) => {
        const poolData = change.doc.data();
        const requestId = change.doc.id;

        const timeString = poolData.Timestamp 
            ? new Date(poolData.Timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : "Just now";

        const cardHTML = `
            <div style="margin-bottom: 15px;">
                <h3 style="margin:0; color:#3e1cb9; font-size: 1.4em;">📍 To: ${poolData.Destination}</h3>
                <p style="margin:5px 0; color: #bbb; font-size: 0.95em;"><strong>From:</strong> ${poolData.PickupPoint}</p>
            </div>
            
            <div style="color: #eee; line-height: 1.5; font-size: 0.95em; margin-bottom: 12px;">
                I <strong>${poolData.Name}</strong> (${poolData.Gender}) have a vehicle leaving on 
                <span style="color:#3e1cb9">${poolData.Date}</span> at <span style="color:#3e1cb9">${poolData.Time}</span>. 
                Looking for <strong>${poolData.Number_of_people}</strong> people.
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div style="background:#252525; padding:10px; border-radius:8px; border: 1px solid #333;">
                    <small style="color:#777; display:block; margin-bottom:4px;">Contact</small>
                    📞 ${poolData.Contact_details}
                </div>
                <div style="background:#252525; padding:10px; border-radius:8px; border: 1px solid #333;">
                    <small style="color:#777; display:block; margin-bottom:4px;">Vehicle</small>
                    🚗 ${poolData.Vehicle_details || 'Not specified'}
                </div>
            </div>

            ${poolData.Additional_Details ? `
                <div style="background:#222; padding:10px; border-radius:8px; font-style:italic; font-size:0.85em; color:#999; border-left: 3px solid #444;">
                    "${poolData.Additional_Details}"
                </div>
            ` : ''}

            <div style="height: 20px;"></div>
            <span style="position:absolute; bottom:12px; right:15px; color:#555; font-size:0.75em; font-weight: bold;">
                🕒 ${timeString}
            </span>
        `;

        if (change.type === "added") {
            const card = document.createElement("div");
            card.className = "pool-request-card";
            card.id = requestId;
            card.style = "background:#1a1a1a; border:1px solid #333; margin:15px 0; padding:20px; border-radius:12px; border-left:6px solid #3e1cb9; position:relative; box-shadow: 0 4px 15px rgba(0,0,0,0.3); font-family: sans-serif; transition: transform 0.2s;";
            card.innerHTML = cardHTML;
            feed.prepend(card);
        }

        if (change.type === "modified") {
            const existingCard = document.getElementById(requestId);
            if (existingCard) {
                existingCard.innerHTML = cardHTML;
            }
        }
        if (change.type === "removed") {
            const cardToRemove = document.getElementById(requestId);
            if (cardToRemove) {
                cardToRemove.remove();
            }
        }
    });
});
const rulesTextArea = document.getElementById("rules");
const r = await chrome.storage.local.get("rules");
rulesTextArea.value = JSON.stringify(r.rules, null, 4);


const autofillButton = document.getElementById("autofill-button");
autofillButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "suggest_autofill" }, (response) => {
            console.log(response);
        });
    });
})

const updateRulesButton = document.getElementById("update-rules-button");
updateRulesButton.addEventListener('click', async () => {
    const rulesText = document.getElementById("rules").value;
    const rules = JSON.parse(rulesText);
    await chrome.storage.local.set({ rules });
    alert("Rules updated");
});

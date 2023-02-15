function getAutofillSuggestion(input, rules) {
    // return first valid rule
    for (const rule of rules) {
        const satisfied = rule.criteria.some((c) => {
            const attribute = input[c.attribute];
            // remove non alphanumeric chars
            const simpleAttribute = attribute.replace(/[^A-Za-z0-9]/g, '');
            if (c.type === "contains_any") {
                return c.value.split(",").some((term) => {
                    return simpleAttribute.includes(term.toLowerCase());
                })
            }
        });
        if (satisfied) return rule;
    }
}

function getSuggestions(inputs, rules) {
    let suggestions = [];
    for (const input of inputs) {
        const suggestion = getAutofillSuggestion(input, rules);
        if (suggestion) {
            suggestions.push({
                input,
                suggestion
            })
        }
    }
    return suggestions;
}

function applySuggestions(suggestions) {
    for (const s of suggestions) {
        s.input.value = s.suggestion.data.value;
        s.input.style.border = "solid 4px green";
    }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log(message)
    if (message.action === "suggest_autofill") {
        const r = await chrome.storage.local.get("rules");
        if (!r) return true;
        const inputs = document.querySelectorAll('input');
        const suggestions = getSuggestions(inputs, r.rules);
        applySuggestions(suggestions);
    }
    return true
});

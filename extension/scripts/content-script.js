/**
 * 
 */
var r = {
    rules: [
        {
            data: {
                value: "Kunal"
            },
            criteria: [
                {
                    attribute: "id",
                    type: "contains_any",
                    value: "firstname,first_name"
                },
                {
                    attribute: "name",
                    type: "contains_any",
                    value: "firstname,first_name"
                }
            ]
        },
        {
            data: {
                value: "Mandalia"
            },
            criteria: [
                {
                    attribute: "id",
                    type: "contains_any",
                    value: "lastname,last_name"
                },
                {
                    attribute: "name",
                    type: "contains_any",
                    value: "lastname,last_name"
                }
            ]
        },
        {
            data: {
                value: "kunal.v.mandalia@gmail.com"
            },
            criteria: [
                {
                    attribute: "id",
                    type: "contains_any",
                    value: "email"
                },
                {
                    attribute: "name",
                    type: "contains_any",
                    value: "email"
                }
            ]
        },
        {
            data: {
                value: "07754930579"
            },
            criteria: [
                {
                    attribute: "id",
                    type: "contains_any",
                    value: "phone"
                },
                {
                    attribute: "name",
                    type: "contains_any",
                    value: "phone"
                }
            ]
        }
    ]
}

function getAutofillSuggestion(input, rules) {
    // return first valid rule
    for (const rule of rules) {
        const satisfied = rule.criteria.some((c) => {
            const attribute = input[c.attribute];
            if (c.type === "contains_any") {
                return c.value.split(",").some((term) => {
                    return attribute.includes(term);
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
        const inputs = document.querySelectorAll('input[type="text"]');
        const suggestions = getSuggestions(inputs, r.rules);
        applySuggestions(suggestions);
    }
    return true
});

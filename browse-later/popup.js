`use strict`;

/**
 * Get information about current tab
 */
let url, favurl, title;
chrome.tabs.query({
    "active": true,
    "windowId": chrome.windows.WINDOW_ID_CURRENT
}, function(tabs) {
    url = tabs[0].url;
    favurl = tabs[0].favIconUrl;
    title = tabs[0].title;
});

/**
 * Save the current tab's information into storage
 */
function save() {
    console.log("Saved here");
    const inf = [url, favurl, title]
    chrome.storage.sync.get(["list"], function(data) {
        let items = data.list;
        if(!items) {
            items = [];
        }
        items.push(inf);
        chrome.storage.sync.set({list: items}, function() {
            // Reload after adding item
            loadpage();
        });
    })
}

/**
 * Clear, remove everything that has been saved in the list
 */
function clear() {
    chrome.storage.sync.get(["list"], function(data) {
        const items = data.list;
        if(!items || items.length == 0) {
            return;
        }
        chrome.storage.sync.set({list: []}, function() {
            // reload after removing items
            document.getElementById("list").innerHTML = "";
        });
    })
}

/**
 * Rendering the list of the histories after loading from storage
 */
function renderlist(items) {
    if(!items) {
        return;
    }
    const ul = document.getElementById("list");
    ul.innerHTML = "";
    while(items.length > 0) {
        const item = items.pop();
        ul.innerHTML += "<li>\
            <a href='"+item[0]+"' target='_newtab'>"+item[2]+"</a>\
            </li>"
    }
}

function loadpage() {
    chrome.storage.sync.get(["list"], function(data) {
        items = data.list;
        renderlist(items);
    })
}


loadpage();
document.getElementById("add").onclick = save;
document.getElementById("clear").onclick = clear;
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
    let index = items.length - 1;
    while(items.length > 0) {
        const item = items.pop();
        const li = document.createElement("li");
        const img = document.createElement("img");
        if(item[1]) {
            img.setAttribute("src", item[1]);
        }
        else{
            img.setAttribute("src", "images/default.png");
        }
        li.setAttribute("data-index", index);
        li.appendChild(img);
        const a = document.createElement("a");
        a.onclick = function() {
            remove(li.getAttribute("data-index"));
        };
        a.setAttribute("href", item[0]);
        a.setAttribute("target", "_newtab");
        a.setAttribute("title", item[2]);
        const title = document.createTextNode(trimTitle(item[2]));
        a.appendChild(title);
        li.appendChild(a);
        ul.appendChild(li);
        index --;
    }
}

/**
 * Load page and get data from google storage
 */
function loadpage() {
    chrome.storage.sync.get(["list"], function(data) {
        items = data.list;
        renderlist(items);
    })
}

/**
 * Reduces the length of very long title
 */
function trimTitle(title) {
    const maxlen = 45;
    return title.length > maxlen? title.slice(0, maxlen) + "..." : title;
}

/**
 * Remove the element from the list, also remove it from the storage
 */
function remove(index) {
    chrome.storage.sync.get(["list"], function(data) {
        const items = data.list;
        items.splice(index, 1);
        chrome.storage.sync.set({list: items}, function() {
            // reload page after removing one item
            loadpage()
        })
    });
}


loadpage();
document.getElementById("add").onclick = save;
document.getElementById("clear").onclick = clear;
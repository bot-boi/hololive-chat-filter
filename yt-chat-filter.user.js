// ==UserScript==
// @name         Youtube Chat Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       bluec3real
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// ==/UserScript==


function getEnglishPrefixList() {
    return [ new RegExp(/\[EN\]/), new RegExp(/\[en\]/),
             new RegExp(/\(EN\)/), new RegExp(/\(en\)/),
             new RegExp(/^EN/), new RegExp(/^en/) ];
}


function observe() {
    console.log("creating observer");
    var chatframe, targetNode, config, callback, observer;

    chatframe = document.getElementById("chatframe");
    if (!chatframe) { console.error("couldnt find chatframe"); }

    targetNode = chatframe.contentWindow.document;
    if (!targetNode) {
        console.log("couldnt get chatframe document");
        return;
    }

    config = { childList: true, subtree: true };

    callback = function (mutationList, observer) {
        for (var mutation of mutationList) {
            // TODO: log chats with [en] prefix & the like
            var target = mutation.target;
            if (target.localName === "yt-live-chat-text-message-renderer") {
                // NOTE: includes author, timestamp, & msg txt
                var msgText = target.innerText;
                var message = target.childNodes[2].innerText;
                var prefixes = getEnglishPrefixList();
                for (var prefix of prefixes) {
                    if (prefix.test(message)) {
                        console.log("matched with " + prefix);
                        console.log(message);
                    }
                }
            }
        }
    };
    // TODO: reinit observer when the chat iframe is reloaded
    //       instead of when the main page is reloaded
    observer = new MutationObserver(callback);
    console.log("starting observer");
    observer.observe(targetNode, config);
}


function main() {
    console.log("running hololive filter thing");
    setTimeout(observe, (5 * 1000));
}


main();

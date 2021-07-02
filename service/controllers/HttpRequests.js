function postRequest({ action, callback, content }) {

    const url = this.baseUrl;
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${url}/${action}`, true);
    xhr.send(content);

    xhr.onload = function () {

        if (xhr.readyState == xhr.DONE) {
            callback(xhr.responseText);
        }

    }

}

function getRequest({ action, callback, content }) {

    const url = this.baseUrl;
    const xhr = new XMLHttpRequest();

    xhr.open("GET", `${url}/${action}`, true);
    xhr.send(content);

    xhr.onload = function () {

        if (xhr.readyState == xhr.DONE) {
            callback(xhr.responseText);
        }

    }

}
const map = new Map();
const reversemap = new Map();

let freeint = new Number(0);

module.exports = {

getShortenedURL: function (url) {
    let value = map.get(url);
    if (value) {
        return value;
    } else {
        freeint = freeint + 1;
        map.set(url, freeint);
        reversemap.set(freeint, url);
        return freeint;
    }
},

lookUpShortenedURL: function(key) {
    return reversemap.get(Number(key));
}

};
// -----------------

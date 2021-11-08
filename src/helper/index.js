var helper = {};

helper.ready = function (fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading")
    fn();
  else
    document.addEventListener('DOMContentLoaded', fn);
}

helper.parseHTML = function (str) {
  if (typeof document['createRange'] === 'function') {
    return document.createRange().createContextualFragment(str);
  } else {
    var el = document.createElement('div');
    el.innerHTML = str;
    return el.children[0];
  }
};

/*
  add/remove class
  credits: https://www.sitepoint.com/add-remove-css-class-vanilla-js/
 */
helper.addClass = function (elements, className) {

  // if there are no elements, we're done
  if (!elements) {
    return;
  }

  // if we have a selector, get the chosen elements
  if (typeof (elements) === 'string') {
    elements = document.querySelectorAll(elements);
  }

  // if we have a single DOM element, make it an array to simplify behavior
  else if (elements.tagName) {
    elements = [elements];
  }

  // add class to all chosen elements
  for (var i = 0; i < elements.length; i++) {

    // if class is not already found
    if ((' ' + elements[i].className + ' ').indexOf(' ' + className + ' ') < 0) {

      // add class
      elements[i].className += ' ' + className;
    }
  }
}
helper.removeClass = function (elements, className) {

  // if there are no elements, we're done
  if (!elements) {
    return;
  }

  // if we have a selector, get the chosen elements
  if (typeof (elements) === 'string') {
    elements = document.querySelectorAll(elements);
  }

  // if we have a single DOM element, make it an array to simplify behavior
  else if (elements.tagName) {
    elements = [elements];
  }

  // remove class from all chosen elements
  for (var i = 0; i < elements.length; i++) {
    let el = elements[i]
    if (el.classList)
      el.classList.remove(className);
    else
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

/*
  fade in/out
  credits: http://www.chrisbuttery.com/articles/fade-in-fade-out-with-javascript/
 */
// fade out
helper.fadeOut = function (el) {
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= .1) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
}
// fade in
helper.fadeIn = function (el, display) {
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}

// Ajax Request
helper.sendRequest = function (queryUrl, cb) {
  var request = new XMLHttpRequest();
  if (!request) {
    alert('Cannot create an XMLHTTP instance :(');
    return;
  }
  request.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status >= 200 && this.status < 400) {
        if (typeof cb === 'function') {
          // CALLBACK is where it handles response (ui.handleResponse)
          cb(this.responseText);
        }
      } else {
        throw new Error(`The requested Wiki responded with an error :(`)
      }
    }
  };
  // SENDS REQUEST FOR THE DATA
  request.open('GET', queryUrl, true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  request.send();
  request = null;
}

// Parse Url
// Credits: 

export default helper;
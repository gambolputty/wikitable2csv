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
helper.addClass = function (elements, myClass) {

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
    if ((' ' + elements[i].className + ' ').indexOf(' ' + myClass + ' ') < 0) {

      // add class
      elements[i].className += ' ' + myClass;
    }
  }
}
helper.removeClass = function (elements, myClass) {

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

  // create pattern to find class name
  var reg = new RegExp('(^| )' + myClass + '($| )', 'g');

  // remove class from all chosen elements
  for (var i = 0; i < elements.length; i++) {
    elements[i].className = elements[i].className.replace(reg, ' ');
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
      if (this.status === 200) {
        if (typeof cb === 'function') {
          cb(this.responseText);
        }
      } else {
        console.error('Error!');
        alert('Error sending request to "' + queryUrl + '" :(');
      }
    }
  };
  request.open('GET', queryUrl, true);
  request.send();
  request = null;
}

// Parse Url
// Credits: 

export default helper;
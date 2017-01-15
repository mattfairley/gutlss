var templates = {
  weed: [' {{NAME}}, I think you should cut down on the weed.'],
  unemployed: [' Hey {{NAME}}, get a job.', ' {{NAME}}, please get a job.', ' Maybe it\'s time to go back to school and get a useful degree, {{NAME}}.'],
  nodishes: [' And {{NAME}}, would it kill you to do the dishes every once in a while?', ' Don\'t forget to do your dishes.'],
  everything: [' Get your shit together.', ' Get your shit together.', ' Get your shit together.'],
};

function getMessage(type, name) {
  var messageArray = templates[type];
  var index = Math.floor(Math.random() * messageArray.length);
  var message = messageArray[index].replace('{{NAME}}', name);
  return message;
}

function getSelector(site) {
  switch (site) {
    case 'nytimes': {
      return {
        selector: 'p.story-content',
      };
    }
    case 'cbc': {
      return {
        selector: '.story-body .story-content ul',
        index: 0,
        elementType: 'li',
        styles: { color: '#115278' , 'font-weight': 700 },
      };
    }
    case 'sportsnet': {
      return {
        selector: '.article-body-text p',
      };
    }
    case 'thestar': {
      return {
        selector: '.article-story-body p',
      };
    }
    case 'washingtonpost': {
      return {
        selector: '.article-body p',
      };
    }
    case 'theringer': {
      return {
        selector: '.graf--p',
        index: 0,
      };
    }
    case 'polygon': {
      return {
        selector: '.c-entry-content p',
        index: 0,
      };
    }
    case 'vice': {
      return {
        selector: '.article-content p',
      };
    }
    case 'avclub': {
      return {
        selector: '.article-text p',
        index: 1,
      }
    }
    default: return { selector: 'p' };
  }
}

function createContentElement(type, styles) {
  var content = document.createElement(type);
  if (styles) {
    for (var styleRule in styles) {
      content.style[styleRule] = styles[styleRule];
    }
  }
  return content;
}

function displayText(result) {
  if (!result.userName) return;
  const hostSplit = window.location.host.split('.');
  var { selector, index, elementType, styles } = getSelector(hostSplit[hostSplit.length - 2]);
  if (!selector) return;
  selector = selector || 'p';
  elementType = elementType || 'span';
  index = index || 0;
  var elementArray = document.querySelectorAll(selector);
  var content = createContentElement(elementType, styles);
  
  if (result.level === 'high') {
    message = getMessage(result.problem, result.userName);
    const messageArray = message.trim().split(' ');
    let count = 0;
    Array.prototype.slice.call(elementArray).forEach(function(el) {
      const newText = el.textContent.split(' ').map((text) => {
        let message = messageArray[count % messageArray.length];
        count++;
        return message;
      }).join(' ');
      el.textContent = newText;
    });
  } else if (result.level === 'medium') {
    var messages = templates[result.problem].map(m => m.replace('{{NAME}}', result.userName));
    content.innerHTML = messages[0];
    var content2 = createContentElement(elementType, styles);
    content2.innerHTML = messages[1];
    var content3 = createContentElement(elementType, styles);
    content3.innerHTML = messages[2];
    elementArray[1].appendChild(content);
    elementArray[3].appendChild(content2);
    elementArray[5].appendChild(content3);
  } else if (elementArray[index]) {
    content.innerHTML = getMessage(result.problem, result.userName);
    elementArray[index].appendChild(content);
  }
}

chrome.storage.sync.get(['userName', 'problem', 'level'], displayText);

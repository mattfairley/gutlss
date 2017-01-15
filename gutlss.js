var templates = {
  weed: [' {{NAME}}, I think you should cut down on the weed.'],
  unemployed: [' {{NAME}}, please get a job - your mother and I are worried.', ' Hey {{NAME}}, get a job.', ' Random placeholder.'],
  nodishes: [' And {{NAME}}, would it kill you to do the dishes every once in a while?'],
  everything: [' Get your shit together.'],
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
      };
    }
    case 'polygon': {
      return {
        selector: '.c-entry-content p',
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
    default: return;
  }
}

function displayText(result) {
  if (!result.userName) return;
  const hostSplit = window.location.host.split('.');
  var { selector, index, elementType, styles } = getSelector(hostSplit[hostSplit.length - 2]);
  if (!selector) return;
  selector = selector || 'p';
  elementType = elementType || 'span';
  index = index || Math.floor(Math.random() * 3) + 1;
  var elementArray = document.querySelectorAll(selector);
  var content = document.createElement(elementType);
  if (styles) {
    for (var styleRule in styles) {
      content.style[styleRule] = styles[styleRule];
    }
  }
  if (result.level === 'high') {
    message = getMessage(result.problem, result.userName).trim();
    const messageArray = message.split(' ');
    let count = 0;
    Array.prototype.slice.call(elementArray).forEach(function(el) {
      const newText = el.textContent.split(' ').map((text) => {
        let message = messageArray[count % messageArray.length];
        count++;
        return message;
      }).join(' ');
      el.textContent = newText;
    });
  } else if (elementArray[index]) {
    content.innerHTML = getMessage(result.problem, result.userName);
    elementArray[index].appendChild(content);
  }
}

chrome.storage.sync.get(['userName', 'problem', 'level'], displayText);

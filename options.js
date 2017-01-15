// Saves options to chrome.storage
function saveOptions() {
  var name = document.getElementById('name').value;
  var level = document.getElementById('level').value;
  var problemEl = document.getElementById('problem');
  // var problem = .checked;
  chrome.storage.sync.set({
    userName: name,
    problem: problemEl.value,
    level: level,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  // Use default value name = 'red' and problem = true.
  chrome.storage.sync.get(['userName', 'problem', 'level'], function(items) {
    document.getElementById('name').value = items.userName;
    document.getElementById('problem').value = items.problem;
    document.getElementById('level').value = items.level;

  });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
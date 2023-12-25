
// Get relevant elements and collections
const tabbed = document.querySelector('.tabbed');
const tablist = tabbed.querySelector('ul');
const tabs = tablist.querySelectorAll('a');
const panels = tabbed.querySelectorAll('[id^="section"]');

const LEFT_ARROW_KEY = 'ArrowLeft';
const RIGHT_ARROW_KEY = 'ArrowRight';
const DOWN_ARROW_KEY = 'ArrowDown';

const HORIZONTAL_FORWARD = 'HORIZONTAL_FORWARD';
const HORIZONTAL_BACKWARD = 'HORIZONTAL_BACKWARD';
const VERTICAL_FORWARD = 'VERTICAL_FORWARD';

// The tab switching function
function switchTab(oldTab, newTab) {
  newTab.focus();
  // Make the active tab focusable by the user (Tab key)
  newTab.removeAttribute('tabindex');
  // Set the selected state
  newTab.setAttribute('aria-selected', 'true');
  oldTab.removeAttribute('aria-selected');
  oldTab.setAttribute('tabindex', '-1');
  // Get the indices of the new and old tabs to find the correct
  // tab panels to show and hide
  let index = Array.prototype.indexOf.call(tabs, newTab);
  let oldIndex = Array.prototype.indexOf.call(tabs, oldTab);
  panels[oldIndex].hidden = true;
  panels[index].hidden = false;
}

function getDirectionByKeyCode(keyCode) {
  if (typeof keyCode !== 'string') {
    throw new Error('KeyCode should have a string type');
  }

  switch (keyCode) {
    case LEFT_ARROW_KEY:
      return HORIZONTAL_BACKWARD;
    case RIGHT_ARROW_KEY:
      return HORIZONTAL_FORWARD;
    case DOWN_ARROW_KEY:
      return VERTICAL_FORWARD;
    default:
      throw new Error('There is no direction');
  }
}


window.onload = function () {
  // Choose the default section on page load
  // And scroll to the top to show nav
  window.location.hash = 'section1';
  document.documentElement.scrollTop = 0;

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      let currentTab = tablist.querySelector('[aria-selected]');
      if (e.currentTarget !== currentTab) {
        switchTab(currentTab, e.currentTarget);
      }
    });


    tab.addEventListener('keydown', event => {
      try {
        const currentTabIndex = Array.prototype.indexOf.call(tabs, event.currentTarget);
        const direction = getDirectionByKeyCode(event.key);

        event.preventDefault();

        if (direction === VERTICAL_FORWARD) {
          panels[index].focus();
          return;
        }

        const nextFocusableTabIndex = direction === HORIZONTAL_FORWARD
          ? currentTabIndex + 1
          : currentTabIndex - 1;

        if (!tabs[nextFocusableTabIndex]) {
          return;
        }
  
        switchTab(event.currentTarget, tabs[nextFocusableTabIndex]);
      } catch(error) {
        // TODO: Catch error with wrong type, it could be using of wrong property like which or keyCode
      }
    });
  });
}
  
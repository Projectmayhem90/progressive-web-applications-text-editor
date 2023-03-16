const butInstall = document.getElementById('buttonInstall');

// Logic for installing the PWA
// Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  // Stash the event so it can be triggered later.
  window.deferredPrompt = event;
  // Show the install button
  butInstall.hidden = false;
});

// Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
  // hide install button
  butInstall.hidden = true;
  // show install prompt
  window.deferredPrompt.prompt();
  // wait for the user to respond to the prompt
  const choiceResult = await window.deferredPrompt.userChoice;
  if (choiceResult.outcome === 'accepted') {
    console.log('User accepted the install prompt');
  } else {
    console.log('User dismissed the install prompt');
  }
  // clear the deferredPrompt variable, since it can only be used once
  window.deferredPrompt = null;
});

// Add an handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
  console.log('App installed');
});
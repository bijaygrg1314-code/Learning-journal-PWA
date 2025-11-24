// ===== Clipboard API =====
function copyToClipboard(text) {
  if (!navigator.clipboard) {
    alert("Clipboard not supported in this browser.");
    return;
  }
  navigator.clipboard.writeText(text)
    .then(() => alert("Copied to clipboard!"))
    .catch(() => alert("Failed to copy."));
}

// ===== Notifications API =====
async function notifySaved(message = "Entry saved!") {
  try {
    if (!("Notification" in window)) { alert(message); return; }
    if (Notification.permission === "granted") { new Notification(message); return; }
    if (Notification.permission !== "denied") {
      const perm = await Notification.requestPermission();
      if (perm === "granted") new Notification(message);
      else alert(message);
    } else {
      alert(message);
    }
  } catch {
    alert(message);
  }
}

// Use a separate function for delete-related messages
async function notifyDeleted(message = "Entry deleted!") {
  try {
    if (!("Notification" in window)) { alert(message); return; }
    if (Notification.permission === "granted") { new Notification(message); return; }
    if (Notification.permission !== "denied") {
      const perm = await Notification.requestPermission();
      if (perm === "granted") new Notification(message);
      else alert(message);
    } else {
      alert(message);
    }
  } catch {
    alert(message);
  }
}

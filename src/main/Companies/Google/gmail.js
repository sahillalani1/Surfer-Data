async function exportGmail() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const emails = []; // will add JSON structure later + handle multiple emails in same thread!

  const mailLink = document.querySelector("div.xS[role='link']");
  if (!mailLink) {
    console.log('user not connected');
    return 'Not connected';
  }

  mailLink.click();
  await new Promise((resolve) => setTimeout(resolve, 3000));

  while (true) {
    const emailContent = document.getElementById(':3')?.innerText || '';
    if (emailContent) {
      emails.push(emailContent);
    }

    const nextParent = document.querySelector('.h0');
    if (!nextParent) {
      console.log('Navigation buttons not found');
      break;
    }

    const childNodes = Array.from(nextParent.childNodes);
    const olderButton = childNodes.find(
      (node) =>
        node.getAttribute && node.getAttribute('aria-label') === 'Older',
    );

    if (!olderButton || olderButton.getAttribute('aria-disabled') === 'true') {
      console.log('Reached the end of emails');
      break;
    }

    olderButton.click();
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  console.log('Emails collected:', emails.length);
  return emails;
}

module.exports = exportGmail;

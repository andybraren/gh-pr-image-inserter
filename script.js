// GitHub PR Review Image Inserter
// Made with <3 for designers working in a GitHubby world.

var version = "v1.2.1 (August 27, 2019)";
var counter = 0;

insertImages();
insertResults(counter);

function insertImages() {

  console.log("GitHub PR Image Inserter Started!");

  // Get the path of the repository
  var repoPath = window.location.pathname.match(/(.*)pull/)[1];
  console.log("Repo path: " + repoPath);

  // Get every file block and loop through each one
  var fileComments = document.querySelectorAll('.show-inline-notes,.has-inline-notes');
  Array.prototype.forEach.call(fileComments, function(el, i) {

    // Get the file info section
    var fileInfo = el.getElementsByClassName("file-header")[0];

    // Process Markdown file sections that aren't top-level (like READMEs) to find the folder path and commit ID
    if (fileInfo.innerText.indexOf(".md") !== -1 && fileInfo.innerText.indexOf("/") !== -1) {
      
      // Get the folder path of the file
      var folderPath = fileInfo.getElementsByTagName('a')[0].innerText.match(/(.*)\//)[1]; // web-console/knikubevirt/snapshots
      console.log("Folder path: " + folderPath);

      // Get the commit ID of the file
      if (fileInfo.getElementsByClassName('rgh-has-raw-file-link')[0]) { // Applies to older commit pages that aren't the most recent
        var commitID = fileInfo.getElementsByClassName('rgh-has-raw-file-link')[0].href.match(/blob\/(.*?)\//)[1];
        console.log("Commit ID: " + commitID);
      } else { // Applies to all other pages
        var commitID = fileInfo.getElementsByTagName('a')[0].href.match(/files\/(.*)#/)[1];  // cf261a1f8ac7d4d46d88388e0387b6e0f7de30ef
        console.log("Commit ID: " + commitID);
      }
    }
    
    // Loop through every Markdown line of the block
    var fileLines = el.getElementsByClassName("blob-code-inner");
    Array.prototype.forEach.call(fileLines, function(el, i) {

      // If the line has a Markdown-formatted image, append the image to the line
      if (el.innerHTML.match(/(?:!\[.*?\]\((.*?)\))/)) {

        // Increment the total images inserted counter
        counter++;

        // Get the image path specified in the Markdown line
        var imagePath = el.innerText.match(/(?:!\[.*?\]\((.*?)\))/)[1];
        console.log("Image path: " + imagePath)

        // Determine the image URL
        if (imagePath.startsWith("http")) {
          imageURL = imagePath;
        } else {
          imageURL = repoPath + 'raw/' + commitID + '/' + folderPath + '/' + imagePath;
        }

        // Create the image HTML
        var newImage = document.createElement('div');
        newImage.setAttribute("class", "inserted-image");
        newImage.innerHTML = '<img src="' + imageURL + '" style="max-width:100%;"></img>';
        
        // Append that image HTML right after the line if it doesn't already exist
        // This logic is terrible but whatever it works
        if (el.nextSibling) {
          if (el.nextSibling.classList) {
            if (el.nextSibling.classList.contains("inserted-image") === -1) {
              el.parentNode.insertBefore(newImage, el.nextSibling);
            }
          } else {
            el.parentNode.insertBefore(newImage, el.nextSibling);
          }
        } else {
          el.parentNode.insertBefore(newImage, el.nextSibling);
        }

      }    
    });
  });
}

function insertResults(counter) {

  // Create the Results div for a Files changed page
  resultsDiv = document.createElement('div');
  resultsDiv.setAttribute("id", "pr-inserter-results");
  resultsDiv.innerHTML = '<div class="file"> \
  <div class="file-header"> \
  <div class="file-info"> \
  <span><strong>GitHub PR Image Inserter</strong> ' + version + ' - <a href="https://andybraren.com/tools/gh-pr-image-inserter.html">Check for updates</a></span> \
  <br> \
  <span><span id="pr-inserter-count">' + counter + '</span> images inserted.</span> \
  </div></div></div>';

  // Create the Results div for a Conversation page
  resultsConversationDiv = document.createElement('div');
  resultsConversationDiv.setAttribute("id", "pr-inserter-results");
  resultsConversationDiv.innerHTML = ' \
  <div class="discussion-sidebar-item"> \
  <span><strong>GitHub PR Image Inserter</strong><span> \
  <br> \
  <span>' + version + '</span> \
  <br> \
  <a href="https://andybraren.com/tools/gh-pr-image-inserter.html">Check for updates</a> \
  <br> \
  <span><span id="pr-inserter-count">' + counter + '</span> images inserted</span> \
  </div>';

  // Insert results once
  if (document.getElementById("pr-inserter-results") == null) {
    // Files page
    if (document.getElementById("diff-0")) {
      document.getElementById("diff-0").insertAdjacentElement('beforebegin', resultsDiv);
    }
    // Conversation page
    if (document.getElementById("partial-discussion-sidebar")) {
      document.getElementById("partial-discussion-sidebar").insertAdjacentElement('afterbegin', resultsConversationDiv);
    }
  } else { // Update the counter if blocks were expanded and new images were inserted
    document.getElementById("pr-inserter-count").innerText = counter;
  }

}

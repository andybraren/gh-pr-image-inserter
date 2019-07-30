// GitHub PR Review Image Inserter
// v1.0.1
//
// Terribly-written but functional JS that inserts images directly below
// the relevant lines within the Markdown file of the "Conversation" and "Files changed" page.
//
// Made with <3 for all the designers out there who have to struggle through
// GitHub's code-oriented UI while reviewing image-oriented design work.

if (isFilesChangedPage()) {
  insertFilesChangedImages();
} else {
  insertConversationImages();
}

function isFilesChangedPage() {
  var currentPath = window.location.pathname;    // Get the current page URL
  if (currentPath.split('/').pop() == "files") { // If the URL ends in "files"
    return true;
  } else {
    return false;
  }
}

function insertFilesChangedImages() {

  // Loop through every "View file" link
  var aTags = document.getElementsByTagName("a");
  var searchText = "View file";
  for (var i = 0; i < aTags.length; i++) {
    if (aTags[i].textContent.includes(searchText)) {
      
      // Get the "View file" link itself
      var link = aTags[i].href;

      // Get the filename from that link
      var filename = link.substr(link.lastIndexOf('/') + 1);

      // Get the folder path from that link, like "org/project-directory"
      var folderPath = link.match(/.com\/(.*)\/blob/)[1];

      // Get everything after the blob part of that link (commit ID, subdirectory and image name)
      var lastPart = link.split('blob/').pop();

      // Loop through every line of the Markdown file on the page searching for
      // the same filename with a ")" at the end (Markdown-formatted image)
      var spanTags = document.getElementsByClassName("blob-code-inner");
      var spanSearchText = filename + ")";
      for (var g = 0; g < spanTags.length; g++) {
        if (spanTags[g].innerHTML.includes(spanSearchText)) {

          // Create the image URL and HTML
          var newImageURL = "/" + folderPath + "/raw/" + lastPart;
          var newImage = document.createElement('div');
          newImage.setAttribute("class", "inserted-image");
          newImage.innerHTML = '<img src="' + newImageURL + '" style="max-width:100%;"></img>';

          // Append that image HTML right after the appropriate span          
          if (spanTags[g].nextSibling) {
            if (spanTags[g].nextSibling.classList) {
              if (spanTags[g].nextSibling.classList.contains("inserted-image") === -1) {
                spanTags[g].parentNode.insertBefore(newImage, spanTags[g].nextSibling);
              }
            } else {
              spanTags[g].parentNode.insertBefore(newImage, spanTags[g].nextSibling);
            }
          } else {
            spanTags[g].parentNode.insertBefore(newImage, spanTags[g].nextSibling);
          }
        }
      }
    }
  }
  return null;
}

function insertConversationImages() {

  // Get the path of the repository
  var repoPath = window.location.pathname.match(/(.*)pull/)[1];

  // Get every file comment block and loop through each one
  var fileComments = document.getElementsByClassName("has-inline-notes");
  //console.log(fileComments);
  Array.prototype.forEach.call(fileComments, function(el, i) {

    // Get the file info section
    var fileInfo = el.getElementsByClassName("file-info")[0];
    //console.log(fileInfo);

    // Get the commit ID and folder path if the file is a non-top-level Markdown file
    if (fileInfo.innerText.indexOf(".md") !== -1 && fileInfo.innerText.indexOf("/") !== -1) {
      var folderPath = fileInfo.innerText.match(/(.*)\//)[1]; // web-console/knikubevirt/snapshots
      var commitID = fileInfo.href.match(/files\/(.*)#/)[1];
    }
    
    // Loop through every Markdown line
    var fileLines = el.getElementsByClassName("blob-code-inner");
    Array.prototype.forEach.call(fileLines, function(el, i) {

      // If the line has a Markdown-formatted image, append the image to the line
      if (el.innerHTML.match(/(?:!\[.*?\]\((.*?)\))/)) {

        // Get the image path specified in the Markdown line
        var imagePath = el.innerHTML.match(/(?:!\[.*?\]\((.*?)\))/)[1];

        // Create the image HTML
        imageURL = repoPath + 'raw/' + commitID + '/' + folderPath + '/' + imagePath;
        var newImage = document.createElement('div');
        newImage.setAttribute("class", "inserted-image");
        newImage.innerHTML = '<img src="' + imageURL + '" style="max-width:100%;"></img>';
        
        // Append that image HTML right after the line if it doesn't already exist
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
  return null;
}

# textarea-editor
Transform the HTML TEXTAREA tag into a basic text editor. The features include the inclusion of line numbers and the capability to input tabs.

![Screen capture](/images/sweeditor.png)

<h3>HOW TO USE</h3>
First, load the sweEditor.js and sweEditor.css files.
<h4>
	&nbsp;&nbsp;&nbsp;&nbsp;&lt;link rel="stylesheet" href="/css/sweEditor.css"&gt;<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&lt;script defer src="/js/sweEditor.js"&gt;&lt;/script>
</h4>
Then, place a TEXTAREA tag in your HTML.
<h4>
	&nbsp;&nbsp;&nbsp;&nbsp;&lt;textarea id="fugafuga"&gt;&lt;/textarea&gt;
</h4>
Please attach a JavaScript class to the textarea tag.
<h4>
	&nbsp;&nbsp;&nbsp;&nbsp;&lt;script&gt;<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;window.onload = (e) => {<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;const sedt = document.getElementById("fugafuga");<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (sedt) {<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;new sweEditor(sedt);<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;};<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&lt;/script&gt;
</h4>
<br>
The size of the editor is designed to automatically match the dimensions specified in the textarea tag.
<br><br>
<h4>colors,and sizes</h4>
Feel free to experiment with the CSS file for things like color, font, and text size.
  

<h3>issue</h3>
While it has been completed, there are performance issues. Text editing at the level of a few thousand lines poses no problem, but when it exceeds tens of thousands of lines, editing becomes difficult. The cause seems to be related to the use of HTML's TEXTAREA, possibly indicating a performance issue in the browser (perhaps a design flaw). It is likely that TEXTAREA is not designed to handle such lengthy texts.

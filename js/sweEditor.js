window.onload = (e) => {

	const sedt = document.querySelector(".sweEditor");
	if (sedt) {
		new sweEditor(sedt);
	}

};



class sweEditor {

	frNode;	// frame node
	lnNode;	// line number frame node
	txNode;	// textarea node
	hvNode;	// invesigater node
	sele = {start:0,end:0};	// selection letter number {start,end}
	lineNum = {start:0,end:0};	// target line number
	deleteString;
	compositStatus = false;
	composit = {};
	lineHeight;


	/*--------------------------------------------------
		コンストラクタ
	--------------------------------------------------*/
	constructor (txNode) {
		
		this.txNode = txNode;
		this.lineHeight = Number(window.getComputedStyle(this.txNode)["lineHeight"].replace(/px$/,""));

		// FrameやLineNumber及び高さ計算用要素を追加する
		this.attachFrame();

		// textareaの高さを内容に合わせて設定する
		this.adjustSize();

		// 行番号を全行に付加する
		this.lineNumbers_all();

		// イベントを付加
		this.attachEvents();

	}


	/*--------------------------------------------------
		イベントを付加
	--------------------------------------------------*/
	attachEvents = () => {

		// 日本語文字入力終了
		this.txNode.addEventListener("compositionstart",(e)=>{

			this.composit = {deleteString:this.deleteString,sele:{start:this.sele.start,end:this.sele.end},line:{start:this.lineNum.start,end:this.lineNum.end}};
			this.compositStatus = true;

		});

		// 日本語文字入力終了
		this.txNode.addEventListener("compositionend",(e)=>{

			this.compositStatus = false;

		});


		// キーダウン
		this.txNode.addEventListener("keydown",(e)=>{

			// キャレット位置
			this.sele.start = this.txNode.selectionStart;
			this.sele.end = this.txNode.selectionEnd;

			// 選択行番号の取得
			this.lineNum.start = this.getLineNum(this.sele.start);
			this.lineNum.end = this.getLineNum(this.sele.end);


			// タブ挿入
			if (e.key == "Tab") {
				e.preventDefault();
				document.execCommand("insertText", false, "\t");
			}

			// Backspace
			else if (e.key == "Backspace") {
				// キャレットの前の１文字
				if (this.sele.start == this.sele.end) {
					this.deleteString = this.txNode.value.substr(this.sele.start-1,1);
				}
				// 選択された範囲
				else {
					this.deleteString = this.txNode.value.slice(this.sele.start,this.sele.end);
				}
			}

			// Delete
			else if (e.key == "Delete") {
				// キャレットの後の１文字
				if (this.sele.start == this.sele.end) {
					this.deleteString = this.txNode.value.substr(this.sele.start,1);
				}
				// 選択された範囲
				else {
					this.deleteString = this.txNode.value.slice(this.sele.start,this.sele.end);
				}
			}

			// 入力
			else {
				// キャレットの後の１文字
				if (this.sele.start != this.sele.end) {
					this.deleteString = this.txNode.value.slice(this.sele.start,this.sele.end);
				}
			}

		});


		// 入力
		this.txNode.addEventListener("input",(e)=>{

			e.insertData = e.data;

			// 入力値がEnterだった場合
			if (e.inputType == "insertLineBreak") {
				e.insertData = "\n";
			}


			// 行番号調整
			this.adjustLineNumber(e);

		});

	};


	/*--------------------------------------------------
		行番号調整
	--------------------------------------------------*/
	adjustLineNumber = (e) => {

		// 対象行番号を消す
		for (let i=this.lineNum.start; i<=this.lineNum.end; i++) {
			// 一行分削除
			this.lnNode.removeChild(this.lnNode.children[this.lineNum.start]);
		}

		// 入力データが複数行ある
		let targetLine = {start:this.lineNum.start,end:this.lineNum.start};
		if (e.insertData) {
			targetLine.end = targetLine.start + (e.insertData.match(/\n/) ? e.insertData.match(/\n/g).length : 0);
		}

		// 対象行番号を追加
		for (let i=targetLine.start; i<=targetLine.end; i++) {
			// 行番号を一行追加
			this.addLineNumber(i,this.pickSpecLine(i));
		}

		// 後ろの行番号を合わせる
		for (let i=targetLine.end; i<this.txNode.value.match(/\n/gm).length; i++) {
			if (typeof this.lnNode.children[i] != "undefined") {
				this.lnNode.children[i].innerText = i + 1;
			}
		}

		// textareaの高さを内容に合わせて設定する
		this.adjustSize();

	};


	/*--------------------------------------------------
		特定の行を抜き出す
	--------------------------------------------------*/
	pickSpecLine = (lineNum) => {

		const regExp = new RegExp("^(?<=([^\n]*\n){"+lineNum+"})([^\n]*)(?=\n.*)$","sm");
		let stringMatch = this.txNode.value.match(regExp);

		return stringMatch[0];

	};


	/*--------------------------------------------------
		行番号の取得
	--------------------------------------------------*/
	getLineNum = (letterNum) => {

		letterNum = letterNum > this.txNode.value.length ? this.txNode.value.length : letterNum;
		const regExp = new RegExp("^.{"+letterNum+"}","sm");
		const stringHead = this.txNode.value.match(regExp);
		const lineNumMatch = stringHead[0].match(/\n/g);
		const lineNum = !lineNumMatch ? 0 : lineNumMatch.length;

		return lineNum;

	};


	/*--------------------------------------------------
		行番号を一行追加
	--------------------------------------------------*/
	addLineNumber = (i,line) => {

		this.hvNode.innerText = line;
		const height = this.hvNode.clientHeight==0 ? this.lineHeight : this.hvNode.clientHeight;

		const lineNumber = document.createElement("div");
		lineNumber.innerText = i+1;
		lineNumber.classList.add("line_number");
		lineNumber.style.height = height+"px";

		if (this.lnNode.children[i]) {
			this.lnNode.insertBefore(lineNumber,this.lnNode.children[i]);
		}
		else {
			this.lnNode.append(lineNumber);
		}

	};


	/*--------------------------------------------------
		textareaの高さを内容に合わせて設定する
	--------------------------------------------------*/
	adjustSize = () => {

		const height = this.txNode.scrollHeight;

		this.txNode.style.height = height+"px";
		this.lnNode.style.height = (height+40)+"px";

	};





	/*--------------------------------------------------
		FrameやLineNumber及び高さ計算用要素を追加する
	--------------------------------------------------*/
	attachFrame = () => {

		// Frame
		this.frNode = document.createElement("div");
		this.frNode.classList.add("sweEditor_frame");

		// Line Number Frame
		this.lnNode =document.createElement("div");
		this.lnNode.classList.add("line_number_frame");

		// Append
		this.txNode.parentElement.insertBefore(this.frNode,this.txNode);
		this.frNode.append(this.lnNode);
		this.frNode.append(this.txNode);

		// Size
		const txStyle = getComputedStyle(this.txNode);

		this.frNode.style.width = txStyle.width;
		this.frNode.style.height = txStyle.height;

		// Investigate
		this.hvNode = document.createElement("div");
		this.hvNode.classList.add("line_height_investigate");

		this.frNode.append(this.hvNode);

		const txStyle2 = getComputedStyle(this.txNode);
		this.txNode.style.width = txStyle2.width;
		this.hvNode.style.width = txStyle2.width;

	};


	/*--------------------------------------------------
		行番号を全行に付加する
	--------------------------------------------------*/
	lineNumbers_all = () => {

		// 全行削除
		this.lineNumbers_deleteAll();

		this.virtLine = this.txNode.value.split(/\n/);
		for (let i=0,ci=this.virtLine.length; i<ci; i++) {
			// 行番号を一行追加
			this.addLineNumber(i,this.virtLine[i]);
		}

	};


	/*--------------------------------------------------
		全行削除
	--------------------------------------------------*/
	lineNumbers_deleteAll = () => {

		while(this.lnNode.firstChild){
			this.lnNode.removeChild(this.lnNode.firstChild);
		}
		
	};








}
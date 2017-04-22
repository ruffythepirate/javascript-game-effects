
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Cursor {

  constructor (blinkInterval) {
    this.blinkInterval = blinkInterval;

    this.isShown = true;
  }

  start() {
    this.stop();
    this.blinkIntervalHandle = window.setInterval(() => {this.isShown = !this.isShown}, this.blinkInterval * 1000);
  }

  stop () {
    if(this.blinkIntervalHandle) {
      clearInterval(this.blinkIntervalHandle);      
    }
  }

  render(x, y, context) {
    if(!this.isShown) {
      return;
    }
    const width = context.measureText('M').width;
    const height = width* 1.2;
    context.fillRect(x, y - height + 2, width, height );
  }
}


class Typer {

  constructor (container, fontStyle, textColor, lineHeight) {
    this.fontStyle = fontStyle;
    this.textColor = textColor;

    this.container = container;
    this.lineHeight = lineHeight;

    this.cursor = new Cursor(1, textColor);
  }

  reset() {
      this.writtenText = [''];
  }

  play(textLines, characterDelay, periodDelays) {
    if(!this.isPlaying) {
      this.textLines = textLines;
      this.characterDelay = characterDelay;
      this.periodDelays = periodDelays;
      this.reset();
      this.isPlaying = true;
      this.cursor.start();
      this.scheduleNextCharacter();
    }
  }

  scheduleNextCharacter() {
      window.setTimeout( () => {this.expandTextOrFinish()}, this.characterDelay * 1000);    
  }

  hasNextCharacter() {
    const hasNext = this.getNextCharacterLineIndex() < this.textLines.length;
    return hasNext;
  }

  expandTextOrFinish() {
    const hasNext = this.hasNextCharacter();
    if(hasNext) {
      this.addNextCharacter();
      this.scheduleNextCharacter();
    }
  }

  addNextCharacter() {
    let nextLineIndex = this.getNextCharacterLineIndex();
    let nextCharacter = this.getNextCharacter();
    if(nextLineIndex >= this.writtenText.length) {
      this.writtenText.push('');
    }
    this.writtenText[nextLineIndex] += nextCharacter;
  }

  getNextCharacterLineIndex() {
    const currentLineIndex = this.writtenText.length - 1;
    const currentLineFilled = this.textLines[ currentLineIndex ].length === this.writtenText[currentLineIndex].length;
    if(currentLineFilled)  {
      return currentLineIndex + 1;
    }
    return currentLineIndex;
  }

  getNextCharacter() {
    var lineIndex = this.getNextCharacterLineIndex();
    if(lineIndex === this.writtenText.length) {
      this.writtenText.push('');
    }
    var characterInLineIndex = this.writtenText[lineIndex].length;
    return this.textLines[lineIndex][characterInLineIndex];
  }

  getRenderTopLeft(context) {
    const lineWidths = this.textLines
                        .map(l => context.measureText(l))
                        .map(m => m.width);

    const maxLineWidth = lineWidths.reduce( (p,v) => p > v ? p : v , 0);
    
    const totalHeight = this.lineHeight * this.textLines.length;

    const startX = (this.container.width - maxLineWidth) / 2;
    const startY = (this.container.height - totalHeight) / 2;

    return new Point(startX, startY);
  }

  render(context) {

    if(!this.writtenText) {
      return;
    }

    context.clearRect(0,0,this.container.width, this.container.height);

    context.fontStyle = this.fontStyle;


    const topLeft = this.getRenderTopLeft(context);

    const linesToRender = this.writtenText
    .map((v, i ) => {return { 
      yOffset: this.lineHeight * i,
      line: v
    }});

    if(linesToRender.length < 1) {
      return;
    }

    linesToRender.forEach(augmentedLine => {
      context.fillText(augmentedLine.line, topLeft.x, topLeft.y + augmentedLine.yOffset);
    });

    const lastLineWidth = context.measureText( linesToRender[linesToRender.length - 1].line).width;
    const lastLineYOffset = linesToRender[linesToRender.length - 1].yOffset;

    this.cursor.render(topLeft.x + lastLineWidth + 2 , topLeft.y + lastLineYOffset, context);

  }



  stop() {
    this.isPlaying = false;
    this.isFinished = true;
  }
}
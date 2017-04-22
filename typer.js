
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Cursor {

  constructor (blinkInterval) {
    this.blinkInterval = blinkInterval;
  }

  start() {

  }

  stop () {
    
  }

  render(x, y, context) {

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

      window.setTimeout( () => {this.expandTextOrFinish()}, this.characterDelay);
    }
  }

  hasNextCharacter() {
    const hasNext = this.getNextCharacterLineIndex() < this.textLines.length;
    return hasNext;
  }

  expandTextOrFinish() {
    const hasNext = this.hasNextCharacter();
    if(hasNext) {
      this.addNextCharacter();
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
    var characterInLineIndex = this.writtenText[lineIndex].length;
    return this.textLines[characterInLineIndex];
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

    const lastLineWidth = context.measureText( linesToRender[linesToRender.length - 1]).width;
    const lastLineYOffset = linesToRender[linesToRender.length - 1].yOffset;

    this.cursor.render(topLeft.x + lastLineWidth, topLeft.y + lastLineYOffset, context);

  }



  stop() {
    this.isPlaying = false;
    this.isFinished = true;
  }
}
import React from 'react'
class ScrollPanel extends React.Component {
  constructor (props) {
    super(props)
    this.fragment = null
    this.div = null
    this.innerDdiv = null
    this.direction = props.direction || null
    this.interval = props.interval || 0
    this.amount = props.amount || 0
    this.width = props.width || 0
    this.height = props.amount || 0
    this.textAlign = props.textAlign || 'center'
    this.upperBound = props.upperBound || 9
    this.mode = props.mode || Scroller.MODE.COUNTUP
    // Private variables
    this.stepSize = Math.ceil((this.amount + 1) * 1.0 / 10) || 2
    this.stepInterval = 0
    this.step = 1
    this.startNum = 1
    this.endNum = 1
    this.nextNum = 1
    this.firstChild = null
    this.lastChild = null
    this.count = 0
    this.state = {
      innerDivTransition: "",
      innerDivTransform: "",
      innerDivTop: 0,
      firstChildInnerHTML: this.startNum,
      lastChildInnerHTML: this.nextNum
    }
    this.innerInit()
  }

  _onTransitionEnd = () => {
    console.log("_onTransitionEnd");
    if (this.state.innerDivTransition.indexOf(' 0s') === -1) {
      this.iterate();
    } else {
      this.stop();
    }
  }

  _renderInner = () => {
    let lastChildTop = this.height
    switch (this.direction) {
      case Scroller.DIRECTION.UP   :
        lastChildTop = this.height
        break
      case Scroller.DIRECTION.DOWN :
        lastChildTop = (-this.height)
        break
    }
    return (<div key="scroller-inner-pane" style={{
      width: this.width, textAlign: this.textAlign,
      top: this.state.innerDivTop,
      transition: this.state.innerDivTransition,
      transform: this.state.innerDivTransform,
      transformOrigin: 'center center',
      onTransitionEnd: this._onTransitionEnd,
    }}>
      <div key="first-scroller-span"
           style={{
             ...this.props.style,
             height: this.height,
             fontSize: 40,
             lineHeight: this.height + 'px',
             textAlign: 'center',
             verticalAlign: 'middle',
             left: 0,
             top: 0,

             width: this.width
           }}>
        {this.state.firstChildInnerHTML}
      </div>
      <div key="last-scroller-span"
           style={{
             ...this.props.style,
             height: this.height,
             fontSize: 40,
             lineHeight: this.height + 'px',
             textAlign: 'center',
             verticalAlign: 'middle',
             left: 0,
             top: lastChildTop,
             width: this.width
           }}>
        {this.state.lastChildInnerHTML}
      </div>
    </div>)
  }

  render () {
    return (
      <div key="fragment">
        <div key="scroller" style={{
          overflow: 'hidden',
          width: this.width,
          textAlign: this.textAlign,
          height: this.height,
          fontSize: 40,
          lineHeight: this.height + 'px'
        }}>
          {this._renderInner()}
        </div>
      </div>
    )
  }

  innerInit = () => {/* To be implemented by subclasses */}
  start = (start, end) => {
    start = parseInt(start)
    end = parseInt(end)
    this.startNum = start
    this.endNum = end
    this.nextNum = this.startNum

    if (this.mode == Scroller.MODE.COUNTDOWN) {
      if (start != end) {
        this.step = (this.endNum > this.startNum) ? (this.startNum + (this.upperBound + 1) - this.endNum) : (this.startNum - this.endNum)
      } else {
        this.step = Number.MAX_VALUE
      }
    } else {
      if (start != end) {
        this.step = (this.endNum < this.startNum) ? (this.endNum + (this.upperBound + 1) - this.startNum) : (this.endNum - this.startNum)
      } else {
        this.step = Number.MAX_VALUE
      }
    }


    this.innerStart()
    // Iterate the counter numbers
    this.iterate()
  }
  innerStart = () => {/* To be implemented by subclasses */}
  iterate = () => {
    if (this.nextNum != this.endNum || this.state.lastChildInnerHTML != this.endNum) {
      // Below check is to ensure the UI is updated properly.
      // Sometimes when in low memory situation the nextNum
      // has been set to endNum, but the corresponding UI is
      // not updated to the endNum
      if (this.nextNum == this.endNum) {
        this.nextNum = parseInt(this.state.lastChildInnerHTML)
      }

      if (this.mode == Scroller.MODE.COUNTDOWN) {
        this.nextNum = (this.nextNum == 0) ? this.upperBound : (this.nextNum - 1)
      } else {
        this.nextNum = (this.nextNum == this.upperBound) ? 0 : (this.nextNum + 1)
      }

      this.innerIterate()
    }
  }
  innerIterate = () => {/* To be implemented by subclasses */}
  scroll = () => {/* To be implemented by subclasses */}
  stop = () => {/* To be implemented by subclasses */}
  revalidate = () => {
    this.nextNum = parseInt(this.nextNum)
    this.endNum = parseInt(this.endNum)
    // If next number is the same as end number, do nothing
    if (this.nextNum == this.endNum) {
      return
    }

    if (this.mode == Scroller.MODE.COUNTDOWN) {
      if (this.nextNum != this.endNum) {
        this.step = (this.endNum > this.nextNum) ? (this.nextNum + (this.upperBound + 1) - this.endNum) : (this.nextNum - this.endNum)
      } else {
        this.step = Number.MAX_VALUE
      }
    } else {
      if (this.nextNum != this.endNum) {
        this.step = (this.endNum < this.nextNum) ? (this.endNum + (this.upperBound + 1) - this.nextNum) : (this.endNum - this.nextNum)
      } else {
        this.step = Number.MAX_VALUE
      }
    }

    this.innerRevalidate()
  }
  innerRevalidate = () => {/* To be implemented by subclasses */}
  resetPosition = () => {
    this.setState({innerDivTop: 0})
  }
  getPanel = () => {
    return this.fragment
  }
  setEndNum = (endNumber) => {
    this.endNum = endNumber
  }
  setMode = (mode) => {
    this.mode = mode
  }

  componentDidMount () {
  }
}
class CSSTransitionScrollPanel extends ScrollPanel {
  constructor (props) {
    super(props)
  }

  innerInit = () => {

  }

  innerStart = () => {
    this.stepInterval = Math.max(1, Math.floor(this.interval * 1.0 / this.step))
    if (this.direction == Scroller.DIRECTION.UP) {
      this.amount = -this.amount
    }
  }

  innerIterate = () => {
    this.scroll()
  }

  scroll = () => {
    //var rand = 1.0 + (Math.random() / 100000)  // This ensures "transitionend" event will always
    // be fired when applied to transform.scaleY().
    var transformProperty = 'translate3d(0,' + this.amount + 'px,0)';// scale3d(0,' + rand + ',0)';
    var durationProperty = (this.stepInterval/1000) + 's';
    this.setState({innerDivTransform: transformProperty, innerDivTransition: 'transform ' + durationProperty + ' linear', firstChildInnerHTML: this.startNum, lastChildInnerHTML: this.nextNum})
  }

  stop = () => {
    //var rand = 1.0 + (Math.random() / 100000)
    var transformProperty = 'translate3d(0,0,0px)';// scale3d(' + rand + ',0,0)'
    var durationProperty = '0s'

    // Sometimes when in low memory situation the nextNum
    // has been set to endNum, but the corresponding UI is
    // not updated to the endNum
    this.nextNum = parseInt(this.state.lastChildInnerHTML)

    this.setState({
      innerDivTransform: transformProperty,
      innerDivTransition: 'transform ' + durationProperty + ' linear',
      firstChildInnerHTML: this.state.lastChildInnerHTML
    })
  }

  innerRevalidate = () => {
    this.stepInterval = Math.max(1, Math.floor(this.interval * 1.0 / this.step))
  }
}
class DOMScrollPanel extends ScrollPanel {
  constructor (props) {
    super(props)
  }

  innerStart = () => {
    this.stepInterval = Math.ceil((this.interval * this.stepSize) / (this.amount * this.step))
  }

  innerIterate = () => {
    // Swap first and last child
    this.setState({firstChildInnerHTML: this.state.lastChildInnerHTML, lastChildInnerHTML: this.nextNum})
    this.scroll()
  }

  scroll = () => {
    var innerDivTop = this.state.innerDivTop
    var top = parseInt(innerDivTop)
    switch (this.direction) {
      case Scroller.DIRECTION.UP:
        innerDivTop = (top - this.stepSize)
        break
      case Scroller.DIRECTION.DOWN:
        innerDivTop = (top + this.stepSize)
        break
      default:
        break
    }
    this.setState({innerDivTop: innerDivTop})
    this.scrolledAmount += this.stepSize
    if (this.scrolledAmount < this.amount) {
      // Below is ensure that the last scroll will not overflow
      this.stepSize = Math.min(this.stepSize, (this.amount - this.scrolledAmount))
      this.scrollID = setTimeout(() => {this.scroll()}, this.stepInterval)
    } else {
      if (this.scrollID != null) {
        clearTimeout(this.scrollID)
      }
      this.stop()
      this.iterate()
    }
  }

  stop = () => {
    this.scrolledAmount = 0
    this.setState({firstChildInnerHTML: this.state.lastChildInnerHTML})
    this.resetPosition()
  }

  innerRevalidate = () => {
    this.stepInterval = Math.ceil((this.interval * this.stepSize) / (this.amount * this.step))
  }
}

class ScrollerImpl extends React.Component {
  constructor (props) {
    super(props)
    this._KeyRadom = Math.random() * 1000
    this.scrollPanelArray = []
    this.propsInner = {...props}
    this.table = null
    this.beginNum = 0
    this.endNum = 0
    this.width = this.props.width
    let table = this.init(0, 0)
    this._Mode = this.props.mode
    this.state = {
      table: table,
    }
  }

  render () {
    return (
      <div key={this._KeyRadom + 'scrollPane' + this.beginNum + '_' + this.endNum}>
        <div key={this._KeyRadom + 'divFragment' + this.beginNum + '_' + this.endNum}>
          <div key={this._KeyRadom + 'scrollerRenderTable' + this.beginNum + '_' + this.endNum}>
            {this._renderTable()}
          </div>
        </div>
      </div>
    )
  }

  _renderTable = () => {
    if (!this.state.table || this.state.table.length === 0) {
      return null
    }
    return (
      <div style={this.props.style}>
        {this.state.table}
      </div>
    )
  }

  createScrollPanel = (props) => {
    if (!props.forceFallback) {
      return <CSSTransitionScrollPanel {...props} ref={this._initScrollPanel}/>
    } else {
      return <DOMScrollPanel  {...props} ref={this._initScrollPanel}/>
    }
  }

  init = (begin, end) => {
    this.oldCountArray = []
    this.newCountArray = []
    this.scrollPanelArray = []
    this.beginNum = begin
    this.endNum = end
    begin = begin + ''
    end = end + ''
    var beginLength = begin.length, endLength = end.length
    for (var i = 0; i < beginLength; ++i) {
      this.oldCountArray.push(begin.charAt(i))
    }
    for (var i = 0; i < endLength; ++i) {
      this.newCountArray.push(end.charAt(i))
    }
    // Do necessary padding
    var diff = Math.abs(beginLength - endLength)
    var maxLength = Math.max(beginLength, endLength)
    if (beginLength > endLength) {
      for (var i = 1; i <= diff; ++i) {
        this.newCountArray.unshift('0')
      }
    } else if (beginLength < endLength) {
      for (var i = 1; i <= diff; ++i) {
        this.oldCountArray.unshift('0')
      }
    }

    // Start building UI
    let table = []
    var indWidth = Math.floor(this.width / maxLength)
    this.propsInner.mode = (this.beginNum > this.endNum) ? Scroller.MODE.COUNTDOWN : Scroller.MODE.COUNTUP
    this.propsInner.width = indWidth //Set the width property
    this.innerInit(table, maxLength)
    return table
  }

  _initScrollPanel = (ref) => {
    if (ref) {
      this.scrollPanelArray.push(ref)
    }
  }

  innerInit = (table, maxLength) => {
    var separatorCount = 0
    if (this.props.separatorType !== Scroller.SEPARATOR.NONE) {
      separatorCount = this.props.separatorType + 1 - maxLength % (this.props.separatorType)
    }

    var tr = []
    var left = 0
    for (var i = 0; i < maxLength; ++i) {
      // Update props
      var td = <div key={this._KeyRadom+'scroller_td_'+i}
                    style={{left: left}}>{this.createScrollPanel(this.propsInner)}</div>
      tr.push(td)
      if (this.props.separatorType != Scroller.SEPARATOR.NONE &&
        (i + separatorCount) % this.props.separatorType === 0 && (i + 1) < maxLength) {
        left += this.propsInner.width
        var td = <div key={this._KeyRadom+'scroller-separator-pane'+i} style={{
          backgroundColor: this.propsInner.style.backgroundColor,
          color: this.propsInner.style.color,
          fontSize: 40,
          height: (this.props.amount + 10),
          lineHeight: this.props.amount + 'px',
          left: left,
          top: 0,
          verticalAlign: 'middle'
        }}> {this.props.separator} </div>
        tr.push(td)
      }
      left += this.propsInner.width
    }
    table.push(tr)
  }

  isUnmodifiableStyle = (propName) => {
    var unmodifiableAttributeNames = ['position', 'overflow']
    for (var i in unmodifiableAttributeNames) {
      if (propName.toLowerCase() === unmodifiableAttributeNames[i]) {
        return true
      }
    }
    return false
  }
  start = (number) => {
    var count = 0
    if (typeof number === 'number') {
      count = parseInt(number) + ''
    } else {
      count = number.trim().replace(/,/g, '')
    }

    let table = this.init(number, number)
    this.setState({
      table: table,
    })
  }
  scrollTo = (number) => {
    var count = (number + '').trim().replace(/,:/g, '')
    if (count.length != this.newCountArray.length) {
      let table = this.init(this.endNum, count)
      this.setState({
        table: table,
      })
    } else {
      this.beginNum = this.endNum
      this.oldCountArray = this.newCountArray
      this.endNum = count
      this.newCountArray = []
      this._Mode = (this.beginNum > this.endNum) ? Scroller.MODE.COUNTDOWN : Scroller.MODE.COUNTUP
      for (var i = 0, len = count.length; i < len; ++i) {
        this.newCountArray.push(count.charAt(i))
      }
    }

    this.refresh()
  }

  scrollFromTo = (from, to) => {
    var from = (from + '').trim().replace(/,:/g, '')
    var to = (to + '').trim().replace(/,:/g, '')
    this.start(from)
    this.scrollTo(to)
  }

  refresh = () => {
    //TODO setTimeout(() => {
    for (var i = 0, len = this.oldCountArray.length; i < len; ++i) {
      if (this.scrollPanelArray[i]) {
        if (this._Mode !== undefined) {
          this.scrollPanelArray[i].setMode(this._Mode)
        }
        this.scrollPanelArray[i].setEndNum(this.newCountArray[i])
        this.scrollPanelArray[i].revalidate()
        this.scrollPanelArray[i].iterate()
      }
    }
    //}, 1)
  }

  componentDidMount () {
    for (var i = 0, len = this.oldCountArray.length; i < len; ++i) {
      if (this.scrollPanelArray[i]) {
        this.scrollPanelArray[i].start(this.oldCountArray[i], this.oldCountArray[i])
      }
    }
  }

  componentWillUnmount () {
    console.log('ScrollerImpl componentWillUnmount')
  }
}

class TimeScrollerImpl extends ScrollerImpl {
  constructor (props) {
    super(props)
  }

  innerInit = (table, maxLength) => {
    var separatorCount = this.props.separatorType + 1 - maxLength % (this.props.separatorType)
    var tr = []
    var left = 0
    for (var i = 0; i < maxLength; ++i) {
      var props = {...this.props}
      if (i % 2 == 0) {
        if (i == 0) {
          props.upperBound = 2
        } else {
          props.upperBound = 5
        }
      }
      var td = <div key={'td_' + i} style={{left: left}}>{this.createScrollPanel(props)}</div>
      tr.push(td)
      if ((i + separatorCount) % props.separatorType === 0 && (i + 1) < maxLength) {
        left += props.width
        var td = <div key={'scroller-separator-pane' + i} style={{
          height: (this.props.amount + 10),
          fontSize: 40,
          lineHeight: this.props.amount + 'px',
          left: left,
          top: 0,
          verticalAlign: 'middle'
        }}> {this.props.separator} </div>
        tr.push(td)
      }
      left += props.width
    }
    table.push(tr)
  }
}

class Scroller extends React.Component {
  constructor (props) {
    super(props)
    this._ScrollerRef = null
  }

  _initScrollerRef = (ref) => {
    this._ScrollerRef = ref
  }

  createScrollerImpl = (props) => {
    var obj = null
    switch (props.separatorType) {
      case Scroller.SEPARATOR.TIME :
        obj = <TimeScrollerImpl {...props} ref={this._initScrollerRef}/>
        break
      case  Scroller.SEPARATOR.THOUSAND:
      default :
        obj = <ScrollerImpl {...props} ref={this._initScrollerRef}/>
        break
    }

    return obj
  }

  render () {
    return (
      <div key="scrollPane">
        {this.createScrollerImpl(this.props)}
      </div>
    )
  }

  start = (num) => {
    if (this._ScrollerRef) {
      this._ScrollerRef.start(num)
    }
  }

  scrollTo = (num) => {
    this._ScrollerRef.scrollTo(num)
  }

  scrollFromTo = (from, to) => {
    this._ScrollerRef.scrollFromTo(from, to)
  }

  componentDidMount () {
    this.start(100)
    let num = 1000
    setTimeout(function () {
      num += 1500
      this.scrollTo(num)
    }.bind(this), 5000)
  }
}

Scroller.DIRECTION = {
  UP: 1,
  DOWN: 2
}

Scroller.SEPARATOR = {
  NONE: 0,
  TIME: 2,
  THOUSAND: 3
}

Scroller.MODE = {
  COUNTUP: 0,
  COUNTDOWN: 1
}

Scroller.defaultProps = {
  direction: Scroller.DIRECTION.UP,
  interval: 5000,
  width: 400,
  amount: 250,
  separatorType: Scroller.SEPARATOR.NONE,
  separator: '',
  textAlign: 'center',
  forceFallback: false,
  mode: Scroller.MODE.COUNTUP,
}

export default Scroller
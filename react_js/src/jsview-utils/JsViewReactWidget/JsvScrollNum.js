import React from 'react'
import PropTypes from 'prop-types'

class ScrollPanel extends React.Component {
	constructor (props) {
		super(props)
		this.index = props.index
		this._TestKey = Math.random()
		// console.log('ScrollPanel index:' + this.index + ', _TestKey:' + this._TestKey + ', startNum:' + props.startNum)
		this.direction = props.direction || null
		this.interval = props.interval || 0
		this.width = props.width || 0
		this.height = props.height || 0
		this.startNum = props.startNum || 0
		this.endNum = props.startNum || 0
		let moveTop = -this.props.height * (this.startNum)
		let transformProperty = 'translate3d(0,' + moveTop + 'px,0)'
		this.state = {
			innerDivTransform: transformProperty,
			innerDivTransition: null,
			innerDivTop: 0,
			numVisible: 'visible',
			scrollNumVisible: 'visible',
			lastNum: this.startNum,
		}
	}

	_renderInner = () => {
		return (<div key="scroller-inner-pane"
					 style={{
						 width: this.width,
						 height: this.height,
						 ...this.props.textStyle,
					 }}>
			<div key="lastNum"
				 style={{
					 top: 0, left: 0,
					 width: this.width,
					 height: this.height,
					 visibility: this.state.numVisible,
					 ...this.props.textStyle,
					 lineHeight: this.height + 'px',
				 }}>
				{this.state.lastNum}
			</div>
			<div key="scroller-num"
				 style={{
					 ...this.props.textStyle,
					 width: this.props.textStyle.fontSize * 0.6,//显示多行
					 height: this.height * 20,
					 lineHeight: this.height + 'px',
					 visibility: this.state.scrollNumVisible,
					 left: (this.width - this.props.textStyle.fontSize * 0.6) / 2,
					 top: this.state.innerDivTop,
					 wordBreak: 'normal',
					 wordWrap: 'break-word',
					 overflow: 'hidden',
					 transition: this.state.innerDivTransition,
					 transform: this.state.innerDivTransform,
					 transformOrigin: 'center center',
				 }} onTransitionEnd={this._onTransitionEnd}>
				{'01234567890123456789'}
			</div>
		</div>)
	}

	render () {
		return (
			<div key="fragment">
				<div key="scroller" style={{
					overflow: 'hidden',
					width: this.width,
					height: this.height,
				}}>
					{this._renderInner()}
				</div>
			</div>
		)
	}

	scrollTo = (endNumber) => {
		let endNum = parseInt(endNumber)
		if (this.endNum == endNum) {
			return//nothing todo
		}
		this.startNum = this.endNum
		this.endNum = endNum

		let offset = this.endNum
		if (this.endNum - this.startNum < 0) {
			offset = 10 + this.endNum
		}

		let moveTop = -this.props.height * offset
		// console.log('scrollTo panel index:' + this.index + ', startNum:' + this.startNum + ', endNum:' + this.endNum + ', offset:' + offset + ', moveTop:' + moveTop)
		var transformProperty = 'translate3d(0,' + moveTop + 'px,0)'
		var durationProperty = (this.props.interval / 1000) + 's'
		this.setState({
			scrollNumVisible: 'visible',
			numVisible: 'hidden',
			innerDivTransform: transformProperty,
			innerDivTransition: 'transform ' + durationProperty + ' linear',
			lastNum: this.endNum,
		})
	}

	_onTransitionEnd = () => {
		// console.log('_onTransitionEnd, this.endNum:' + this.endNum + ', index:' + this.index + ', _TestKey:' + this._TestKey)
		let moveTop = -this.props.height * (this.endNum)
		var transformProperty = 'translate3d(0,' + moveTop + 'px,0)'
		var durationProperty = '0s'
		this.setState({
			scrollNumVisible: 'hidden',
			numVisible: 'visible',
			innerDivTransform: transformProperty,
			innerDivTransition: 'transform ' + durationProperty + ' linear',
			lastNum: this.endNum,
		})
	}

	componentWillUnmount () {
		// console.log('ScrollPanel componentWillUnmount TestKey:' + this._TestKey)
	}

	componentDidMount () {
		// console.log('ScrollPanel componentDidMount TestKey:' + this._TestKey)
	}
}

class JsvScrollNum extends React.Component {
	constructor (props) {
		super(props)
		this.oldCountArray = []
		this.newCountArray = []
		this.scrollPanelArray = []
		this.propsInner = {...props}
		this.beginNum = this.props.value
		this.endNum = this.beginNum
		let table = this.init(this.beginNum, this.endNum)
		this._RefreshTimer = null;
		this.state = {
			table: table,
		}
	}

	render () {
		return (
			<div key={'scrollPane' + this.beginNum + '_' + this.endNum}>
				<div key={'divFragment' + this.beginNum + '_' + this.endNum}>
					<div key={'scrollerRenderTable' + this.beginNum + '_' + this.endNum}>
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
		return this.state.table
	}

	createScrollPanel = (props, index) => {
		return <ScrollPanel key={'scroller_panel_' + index} index={index}
							startNum={this.oldCountArray[this.oldCountArray.length - 1 - index]} {...props}
							ref={this._initScrollPanel}/>
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
		var separatorCount = 0
		if (this.props.separatorType !== JsvScrollNum.SEPARATOR.NONE) {
			separatorCount = parseInt((maxLength - 1) / this.props.separatorType)
		}
		this.propsInner.width = this.props.itemWidth //Set the width property
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
		if (this.props.separatorType !== JsvScrollNum.SEPARATOR.NONE) {
			separatorCount = parseInt((maxLength - 1) / this.props.separatorType)
		}
		var tr = []
		var left = (maxLength - 1) * this.propsInner.width
		if (separatorCount != 0) {
			left += separatorCount * this.propsInner.width
		}

		for (var i = 0; i < maxLength; ++i) {
			console.log('innerInit i:' + i + ', left:' + left)
			// Update props
			var td = <div key={'scroller_td_' + i}
						  style={{left: left}}>{this.createScrollPanel(this.propsInner, i)}</div>
			tr.push(td)
			if (this.props.separatorType != JsvScrollNum.SEPARATOR.NONE &&
				((i + 1) < maxLength) &&
				(i + 1) % this.props.separatorType === 0) {
				left -= this.propsInner.width
				var td = <div key={'scroller-separator-pane' + i} style={{
					left: left,
					top: 0,
					width: this.propsInner.width,
					height: (this.props.height),
					...this.props.textStyle,
					lineHeight: this.props.height + 'px'
				}}>{this.props.separator}</div>
				tr.push(td)
			}
			left -= this.propsInner.width
		}
		table.push(tr)
	}

	start = (number) => {
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
			}, () => {
				this._RefreshTimer = setTimeout(() => {
					this.refresh()
				}, 1)
			})
		} else {
			this.beginNum = this.endNum
			this.oldCountArray = this.newCountArray
			this.endNum = count
			this.newCountArray = []
			for (var i = 0; i < count.length; ++i) {
				this.newCountArray.push(count.charAt(i))
			}
			this.refresh()
		}
	}

	refresh = () => {
		for (var i = this.oldCountArray.length - 1; i >= 0; i--) {
			if (this.scrollPanelArray[i]) {
				//scroll panel的顺序，与其控制的数字顺序相反，便于数据增加时，旧scroll panel不变
				this.scrollPanelArray[i].scrollTo(this.newCountArray[this.oldCountArray.length - 1 - i])
			}
		}
	}
	_ClearTimer() {
		if (this._RefreshTimer) {
			clearTimeout(this._RefreshTimer);
			this._RefreshTimer = null;
		}
	}
	componentDidMount () {
		// console.log('JsvScrollNum componentDidMount')
	}

	componentWillUnmount () {
		// console.log('JsvScrollNum componentWillUnmount')
		this._ClearTimer();
	}
}
JsvScrollNum.SEPARATOR = {
	NONE: 0,
	THOUSAND: 3
}

JsvScrollNum.propTypes = {
	value: PropTypes.number, // 初始值
	interval: PropTypes.number, // 滚动时长,单位：ms
	itemWidth: PropTypes.number, // 滚动条文字宽度
	height: PropTypes.number, // 滚动条高度
	separatorType: PropTypes.number, // 分隔符类型
	separator: PropTypes.string, // 分隔符
	textStyle: PropTypes.object //文字样式
}

JsvScrollNum.defaultProps = {
	value: 0,
	interval: 5000,
	itemWidth: 40,
	height: 100,
	separator: '',
	textAlign: 'center',
	separatorType: JsvScrollNum.SEPARATOR.NONE,
	textStyle: {
		color: 'rgba(255,255,255,1.0)',
		backgroundColor: 'rgba(0,0,0,0)',
		fontSize: 40,
		textAlign: 'center',
		verticalAlign: 'middle',
		lineHeight: '100px'
	}
}

export default JsvScrollNum
<template>
	<div :class="cls">
		<div class="calendar" id="calendar" v-show="isCalendarShow">
			<div class="tables">
				<div class="table" v-for="(page, idx) in pages">
					<table>
						<thead>
							<tr>
								<th class="prev" @click="backPage"></th>
								<th @click="monthVisible = true" colspan="5" class="month"> {{ page.date.format && page.date.format('YYYY年M月') }} <i class="triangle-right-bottom"></i></th>
								<th class="next" @click="forwardPage"></th>
							</tr>
							<tr>
								<th>周日</th>
								<th>周一</th>
								<th>周二</th>
								<th>周三</th>
								<th>周四</th>
								<th>周五</th>
								<th>周六</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="row in page.dates">
								<td :data-date="date.format('YYYY-MM-DD')" v-for="date in row" :class="date.cssClass" @click="selectDate(date,exams[date.date()-1])" @mouseover="previewDates(date)">
 									<template v-if="date.format(yearmonth) == date.format('YYYY-M')">
 										
 										<template v-if="exams[date.date()-1].day == date.date()">
 											<span class="exception" v-if="exams[date.date()-1].statu == 2">{{ date.date() }}<br>异常</span>
 											<span class="vacation" v-else-if="exams[date.date()-1].statu == 3">{{ date.date() }}<br>休假</span>
 											<span v-else>
 												<template v-if="date.format('L') == today">
							                		今
							                	</template>
												<template v-else>{{ date.date() }}</template>	
 											</span>
 											
 										</template>
 									</template>
 									
 									<template v-else>
 										<span>{{ date.date() }}</span>
 									</template>
								</td>

							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<mt-popup v-model="monthVisible" position="bottom" class="mint-popup-month">
			<mt-picker :slots="monthSlots" @change="monthDateChange" :visible-item-count="5" :show-toolbar="true">
				<div class="mint-datetime-action mint-datetime-cancel" @click="monthVisible = false">取消</div>
				<div class="mint-datetime-action mint-datetime-confirm" @click="dateClick">确定</div>
			</mt-picker>
		</mt-popup>
	</div>
</template>

<script>
	import moment from 'moment'

	const NIL = {}
	const EMPTY_FN = () => {}

	const MODE_DATE = 'date'
	const MODE_DATERANGE = 'daterange'

	export default {
		name: 'Calendar',
		data() {
			return {
				date: [NIL, NIL],
				selecting: [NIL, NIL],
				input0: '',
				input1: '',
				minDate: NIL,
				maxDate: NIL,
				pagesDate: moment(),
				pages: [{
					date: NIL,
					dates: []
				}],
				isCalendarShow: true,
				savable: true,
				isSelecting: false,
				previewEndDate: NIL,
				touchx: '',
				touchy: '',
				today: moment().format('L'),
				monthVisible: false,
				monthSlots: [{
					flex: 1,
					values: this.getMonthData(),
					className: 'slot1',
					textAlign: 'center',
					defaultIndex: 12
				}],
				monthData: '',
				checkDetail: '',
				checkedDay: ''
			}
		},
		props: {
			mode: {
				type: String,
				default: 'date'
			},
			min: {
				validator(val) {
					return moment(val).isValid()
				}
			},
			max: {
				validator(val) {
					return moment(val).isValid()
				}
			},
			value: {},
			cssClass: String,
			placeholder: String,
			dateFormatter: {
				type: String,
				default: 'YYYY-MM-DD'
			},
			dateLabelFormatter: {
				type: String,
				default: 'YYYY-MM-DD'
			},
			dateLabelSeparator: {
				type: String,
				default: ' - '
			},
			cbDate0Error: {
				type: Function,
				default: EMPTY_FN
			},
			cbDate1Error: {
				type: Function,
				default: EMPTY_FN
			},
			cbCancelClicked: {
				type: Function,
				default: EMPTY_FN
			},
			exams: Array,
			yearmonth: String,
			showDetail: Boolean,
			disableAfterToday: Boolean,
			disableAfterMonth: Boolean
			
		},
		watch: {
			value: {
				immediate: true,
				handler(val) {
					this.date = [NIL, NIL]
					this.prepareDate()
					this.isSelecting = false
				}
			},
			min: {
				immediate: true,
				handler(val) {
					this.prepareMinMax()
				}
			},
			max: {
				immediate: true,
				handler(val) {
					this.prepareMinMax()
				}
			}
		},
		computed: {
			cls() {
				let daterange = this.mode === MODE_DATERANGE
				let cls = {
					'hsy-datepicker': true,
					daterange
				}
				if(this.cssClass) {
					cls[this.cssClass] = true
				}
				return cls
			},
			date0: {
				set(newVal) {
					let date = moment(newVal)
					if(!date.isValid()) {
						if(this.cbDate0Error !== EMPTY_FN) {
							this.cbDate0Error(newVal)
							return
						} else {
							throw new Error('deformed value of date0')
						}
					}
					this.$set(this.date, 0, date)
					this.$set(this.pages, 0, {
						date: date.clone(),
						dates: []
					})
					this.selecting0 = date.clone()
				},
				get() {
					if(this.date[0] === NIL) {
						return ''
					}
					return this.date[0].format(this.dateLabelFormatter)
				}
			},
			date1: {
				set(newVal) {
					let date = moment(newVal)
					if(!date.isValid()) {
						if(this.cbDate1Error !== EMPTY_FN) {
							this.cbDate1Error(newVal)
							return
						} else {
							throw new Error('deformed value of date0')
						}
					}
					this.$set(this.date, 1, date)
					this.$set(this.pages, 1, {
						date: date.clone(),
						dates: []
					})
					this.selecting1 = date.clone()
				},
				get() {
					if(this.date[1] === NIL) {
						return ''
					}
					return this.date[1].format(this.dateLabelFormatter)
				}
			},
			selecting0: {
				set(newVal) {
					this.input0 = newVal.format(this.dateLabelFormatter)
					this.$set(this.selecting, 0, newVal)
					this.preparePages()
				},
				get() {
					return this.selecting[0].format(this.dateLabelFormatter)
				}
			},
			selecting1: {
				set(newVal) {
					this.input1 = newVal.format(this.dateLabelFormatter)
					this.$set(this.selecting, 1, newVal)
					this.preparePages()
				},
				get() {
					return this.selecting[0].format(this.dateLabelFormatter)
				}
			},
			dateLabel() {
				if(this.date0 !== '') {
					return this.date0
				}
				return this.placeholder
			},
			daterangeLabel() {
				if(this.date0 !== '' && this.date1 !== '') {
					return this.date0 + this.dateLabelSeparator + this.date1
				}
				return this.placeholder
			},
			selectedLabel() {
				return this.mode === MODE_DATE ? this.dateLabel : this.daterangeLabel
			}
		},
		methods: {
			getMonthData() {
				let monthArr = []
				for(let i = 12; i > 0; i--) {
					let month = moment().subtract(i, "months").format("YYYY年MM月")
					monthArr.push(month)
				}
				for(let i = 0; i < 12; i++) {
					let month = moment().add(i, "months").format("YYYY年MM月")
					monthArr.push(month)
				}
				return monthArr
			},
			monthDateChange(picker, values) {
				this.monthData = values
				this.monthData = values.map(function(item) {
					return item.replace(/[\u4e00-\u9fa5]/g, "-")
				})

			},
			dateClick() {
				let monthCount = 0,
					tDate = new Date(this.pagesDate),
					yDate = new Date(this.monthData)
				let yearMonth = tDate.getFullYear() - yDate.getFullYear()
				if(yearMonth == 0) {
					monthCount = this.pagesDate.month() - yDate.getMonth()
				} else {
					monthCount = yearMonth * 12 - (yDate.getMonth() - this.pagesDate.month())
				}
				this.pagesDate.subtract(monthCount, 'month')
				this.preparePages()
				this.monthVisible = false

			},
			prepareDate() {
				if(this.value === undefined) return

				let value = this.value
				if(this.mode === MODE_DATE) {
					if(Array.isArray(value) && value.length) {
						this.date0 = value[0]
					} else {
						this.date0 = value
					}
				} else if(this.mode === MODE_DATERANGE && Array.isArray(value) && value.length === 2) {
					this.date0 = value[0]
					this.date1 = value[1]
				}

				if(this.date[0] !== NIL) {
					this.pagesDate = this.date[0].clone()
				}
			},
			prepareMinMax() {
				if(this.min) {
					this.minDate = moment(this.min)
				}
				if(this.max) {
					this.maxDate = moment(this.max)
				}
				if(this.minDate !== NIL && this.maxDate !== NIL && this.minDate.isAfter(this.maxDate)) {
					throw new Error("'min' should same or before of 'max'")
				}
			},
			isSameYearMonthDay(date, date1) {

				return date.isSame(date1, 'year') && date.isSame(date1, 'month'), date.isSame(date1, 'day')
			},
			isSelectingStart(date) {
				return this.isSameYearMonthDay(date, this.selecting[0])
			},
			isSelectingBetween(date) {
				if(this.MODE_DATE) {
					return true
				}
				if(this.isSelecting) {
					return this.previewEndDate !== NIL && date.startOf('day').isAfter(this.selecting[0]) && date.startOf('day').isBefore(this.previewEndDate)
				}
				return date.startOf('day').isAfter(this.selecting[0]) && date.startOf('day').isBefore(this.selecting[1])
			},
			isSelectingEnd(date) {
				if(this.MODE_DATE) {
					return true
				}
				return !this.isSelecting && this.isSameYearMonthDay(date, this.selecting[1])
			},
			prepareDates(date) {

				date = date.clone()
				date.date(1)
				let dayOfWeek = date.day()
				let dates = []
				let d
				for(let i = dayOfWeek; i > 0; i--) {
					d = date.clone().subtract(i, 'days')
					d.cssClass = {
						off: true,
						unabled: true
					}
					dates.push(d)
				}

				let cssDate = (date) => {

					let start = this.isSelectingStart(d)
					if(this.mode === MODE_DATERANGE) {
						let between = this.isSelectingBetween(d)
						let end = this.isSelectingEnd(d)
						d.cssClass = {
							start,
							between,
							end
						}
					} else {
						d.cssClass = {
							active: start
						}

					}
					return d
				}

				d = date.clone()
				dates.push(cssDate(d))
				for(let i = 1, len = date.daysInMonth(); i < len; i++) {
					d = date.clone().add(i, 'days')
					dates.push(cssDate(d))
				}
				date = dates[dates.length - 1]
				let tail = 42 - dates.length
				for(let i = 1; i <= tail; i++) {
					d = date.clone().add(i, 'days')
					d.cssClass = {
						off: true
					}
					dates.push(d)
				}
				let row = []
				let rows = [row]

				dates.forEach((date) => {
					if(this.disableAfterToday){
						if(date > new Date()) {
							date.cssClass = {
								unabled: true
							}
						}	
					}
					if(row.length !== 7) {
						row.push(date)
					} else {
						row = [date]
						rows.push(row)
					}
				})
				return rows
			},
			preparePages() {

				let date = this.pagesDate
				let dates = this.prepareDates(date)
				this.$set(this.pages, 0, {
					date,
					dates
				})
				if(this.mode === MODE_DATERANGE) {
					date = this.pagesDate.clone()
					date.add(1, 'month')
					let dates = this.prepareDates(date)
					this.$set(this.pages, 1, {
						date,
						dates
					})
				}
			},
			selectDate(date,dateObj) {
				this.checkDetail = dateObj
				this.checkedDay = moment(date).format('YYYY-MM-DD') 
				this.$emit('checkedVal',moment(this.checkedDay).format('YYYY-MM-DD'));
				if(date.cssClass && date.cssClass.off) return
				if(this.mode === MODE_DATE) {
					this.selecting0 = date
					return
				}
				if(!this.isSelecting || this.isSelecting && date.isBefore(this.selecting[0])) {
					this.savable = false
					this.isSelecting = true
					this.selecting0 = date
				} else {
					this.savable = true
					this.isSelecting = false
					this.previewEndDate = NIL
					this.selecting1 = date
				}
			},
			backPage() {
				this.pagesDate.subtract(1, 'month')
				this.preparePages()
			},
			forwardPage() {
				this.pagesDate.add(1, 'month')
				this.preparePages()
			},
			dateFromLabelStr(str) {
				let date = moment(str, this.dateLabelFormatter)
				if(date.isValid()) return date
				date = moment(str)
				if(date.isValid()) return date
				return moment.invalid()
			},
			hideCalendar() {
				this.isCalendarShow = false
			},
			previewDates(date) {
				if(this.isSelecting) {
					this.previewEndDate = date
					this.preparePages()
				}
			},
			touchstart() {
				this.touchx = event.changedTouches[0].clientX;
				this.touchy = event.changedTouches[0].clientY;
			},

			touchend() {
				var distantY = event.changedTouches[0].clientY - this.touchy > 0 ? event.changedTouches[0].clientY - this.touchy : this.touchy - event.changedTouches[0].clientY;
				if(event.changedTouches[0].clientX - this.touchx > 50 && distantY < 50) {
					this.backPage()
				} else if(this.touchx - event.changedTouches[0].clientX > 50 && distantY < 50) {
					//不显示大于当月数据
					if(this.disableAfterMonth){
						let pdate = this.pagesDate.add(1, 'month')
						if(pdate > new Date()) {
							this.pagesDate.subtract(1, 'month')
							return false
						} else {
							this.pagesDate.subtract(1, 'month')
							this.forwardPage()
						}	
					}else{
						this.forwardPage()
					}
				}
				this.$emit('callback',moment(this.pagesDate).format('YYYY-MM'));
			}

		},
		mounted() {
			this.$emit('callback',moment(this.pagesDate).format('YYYY-MM'));
			document.getElementById("calendar").addEventListener("touchstart", this.touchstart);
			document.getElementById("calendar").addEventListener("touchend", this.touchend);

		},
		destroyed() {
			/*document.removeEventListener('click', this.autoHide, false)*/
			/*document.getElementById("calendar").removeEventListener("touchstart", this.touchstart);
			document.getElementById("calendar").removeEventListener("touchend", this.touchend);*/
		}
	}
</script>

<style>
	.hsy-datepicker {
		display: inline-block;
		font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
		font-weight: 400;
		font-size: 14px;
		position: relative;
		width: 100%;
	}
	
	.hsy-datepicker .calendar {
		display: inline-block;
		background: #fff;
		width: 100%;
	}
	
	.hsy-datepicker .calendar .input input {
		display: block;
		padding: 0;
		border: 1px solid #979797;
		margin-bottom: 13px;
		border-radius: 4px;
		width: 100%;
		font-size: 13px;
		color: #6A7288;
		height: 30px;
		line-height: 30px;
		text-align: center;
		outline: none;
	}
	
	.hsy-datepicker .calendar .input input:focus {
		border: 1px solid #0097FF;
	}
	
	.hsy-datepicker .calendar .tables {
		white-space: nowrap;
	}
	
	.hsy-datepicker .calendar .table table {
		border-collapse: collapse;
		border-spacing: 0;
		width: 100%;
	}
	
	.hsy-datepicker .calendar .table table th {
		width: 14.28%;
		text-align: center;
	}
	
	.hsy-datepicker .calendar .table thead th.prev,
	.hsy-datepicker .calendar .table thead th.next {
		padding: 15px;
		border-radius: 4px;
		display: block;
		cursor: pointer;
	}
	
	.hsy-datepicker .calendar .table thead th.month {
		text-align: center;
		font-size: 24px;
	}
	
	.hsy-datepicker .calendar .table thead tr:last-child th {
		padding: 10px 0;
	}
	
	.hsy-datepicker .calendar .table thead th.prev:hover,
	.hsy-datepicker .calendar .table thead th.next:hover {
		background-color: #888;
	}
	
	.hsy-datepicker .calendar .table thead th.prev {
		background: #9B9B9B url('../../assets/arrow-left-white.svg') no-repeat center center;
		margin-left: 15px;
	}
	
	.hsy-datepicker .calendar .table thead th.next {
		background: #9B9B9B url('../../assets/arrow-right-white.svg') no-repeat center center;
	}
	
	.hsy-datepicker .calendar .table thead th {
		color: #333;
		font-weight: normal;
	}
	
	.hsy-datepicker .calendar .table {
		color: #6a7288;
	}
	
	.hsy-datepicker .calendar .table tr {
		width: 100%;
	}
	
	.hsy-datepicker .calendar .table td {
		width: 14.28%;
		text-align: center;
		height: 50px;
	}
	.hsy-datepicker .calendar .table td .exception{
		color: #ef7a6b;
	}
	.hsy-datepicker .calendar .table td .vacation{
		color: #ff8a00
	}
	
	.hsy-datepicker .calendar .table td:hover {
		width: 20px;
		height: 20px;
		padding: 5px;
		border-radius: 4px;
		white-space: nowrap;
		cursor: pointer;
		background-color: ##58B7FF;
		color: #333;
	}
	
	.hsy-datepicker .calendar .table td.off,
	.hsy-datepicker .calendar .table td.unabled {
		color: #ccc;
	}
	
	.hsy-datepicker .calendar .table td.off {
		visibility: hidden;
	}
	
	.hsy-datepicker .calendar .table td.off:hover {
		background-color: #fff;
		cursor: default;
	}
	
	.hsy-datepicker .calendar .table td.start {
		background-color: #58B7FF;
		color: #fff;
		border-radius: 4px 0 0 4px;
	}
	
	.hsy-datepicker .calendar .table td.active {
		background-color: #ff8a00;
		color: #fff;
		border-radius: 4px;
	}
	
	.hsy-datepicker .calendar .table td.active .exception ,.hsy-datepicker .calendar .table td.active .vacation{
		color: #fff;
	}
	
	.hsy-datepicker .calendar .table td.between {
		background-color: #B9E6FF;
		color: #6A7289;
	}
	
	.hsy-datepicker .calendar .table td.between+td:not(.end):hover {
		border-radius: 0;
	}
	
	.hsy-datepicker .calendar .table td.between:hover {
		border-radius: 0;
		background-color: ##58B7FF;
	}
	
	.hsy-datepicker .calendar .table td.end {
		background-color: #58B7FF;
		color: #fff;
		border-radius: 0 4px 4px 0;
	}
	
	.hsy-datepicker .calendar .table td.start.end {
		border-radius: 4px;
	}
	
	.hsy-datepicker .calendar .confirm {
		text-align: right;
		padding: 10px 0;
		padding-bottom: 0;
	}
	
	.hsy-datepicker .calendar .confirm button {
		border: 0;
		border-radius: 3px;
		color: #fff;
		width: 80px;
		height: 33px;
		outline: none;
		cursor: pointer;
		font-size: 12px;
	}
	
	.hsy-datepicker .calendar .confirm button.yes {
		background-color: #58B7FF;
	}
	
	.hsy-datepicker .calendar .confirm button.yes:disabled {
		background-color: #58B7FF;
		cursor: not-allowed;
	}
	
	.hsy-datepicker .calendar .confirm button.no {
		background-color: #9B9B9B;
		margin-left: 7px;
	}
	
	.hsy-datepicker .left {
		float: left;
	}
	
	.hsy-datepicker .right {
		float: right;
	}
	
	.hsy-datepicker .calendar .confirm::after {
		content: "";
		clear: both;
	}
	
	.hsy-datepicker.daterange .table {
		display: inline-block;
	}
	
	.hsy-datepicker.daterange .table:first-child th.next {
		visibility: hidden;
	}
	
	.hsy-datepicker.daterange .table:last-child {
		margin-left: 10px;
	}
	
	.hsy-datepicker.daterange .table:last-child th.prev {
		visibility: hidden;
	}
	
	.hsy-datepicker.daterange .confirm button {
		float: none
	}
	
	.hsy-datepicker .selected {
		display: inline-block;
		border: 1px solid #fff;
		border-radius: 5px;
		height: 28px;
		line-height: 28px;
		padding: 0;
		background-color: #0097FF;
		color: #fff;
		outline: none;
		font-size: 0;
		position: relative;
		cursor: pointer;
	}
	
	.hsy-datepicker .selected>.input {
		display: inline-block;
		padding: 0 15px;
		height: 100%;
		font-size: 12px;
		vertical-align: top;
	}
	
	.hsy-datepicker .selected>.handler {
		display: inline-block;
		vertical-align: top;
		width: 28px;
		height: 28px;
		background: url('../../assets/light-arrow-down.svg') no-repeat right center;
		background-size: contain;
	}
	
	.triangle-right-bottom {
		width: 0;
		height: 0;
		border-bottom: 8px solid #000;
		border-left: 8px solid transparent;
		position: relative;
		top: -12px;
	}
	
	.mint-popup-month {
		width: 100%;
	}
	
	.picker-toolbar {
		background-color: #f1f0f0;
		color: #4a4a4a;
		padding: 0 15px;
	}
	
	.picker-toolbar .mint-datetime-action {
		color: #4a4a4a;
	}
	
	.picker-toolbar .mint-datetime-cancel {
		text-align: left;
	}
	
	.picker-toolbar .mint-datetime-confirm {
		text-align: right;
	}
</style>
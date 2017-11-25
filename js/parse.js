linear = false;
var chart1, chart2, chart3, chart4;
var chartAry = [];
// Setup the listeners.
var IDselecter = document.getElementById('IDselecter');
//var notlog1 = document.getElementById('notlog1');
//var log1 = document.getElementById('log1');
//var notlog2 = document.getElementById('notlog2');
//var log2 = document.getElementById('log2');
//var notlog3 = document.getElementById('notlog3');
//var log3 = document.getElementById('log3');
//var notlog4 = document.getElementById('notlog4');
//var log4 = document.getElementById('log4');

var preChartBtn = document.getElementById('preChartBtn');
var nextChartBtn = document.getElementById('nextChartBtn');


var leftBtn = document.getElementById("leftBtn");
var rightBtn = document.getElementById("rightBtn");


//var notlogAry = [notlog1,notlog2,notlog3,notlog4];
//var logAry = [log1,log2,log3,log4];

IDselecter.addEventListener('change', changeID, false);
//notlog1.addEventListener('click',function(){setNotLog(0)});
//log1.addEventListener('click', function(){setLog(0)});
//notlog2.addEventListener('click',function(){setNotLog(1)});
//log2.addEventListener('click', function(){setLog(1)});
//notlog3.addEventListener('click',function(){setNotLog(2)});
//log3.addEventListener('click', function(){setLog(2)});
//notlog4.addEventListener('click',function(){setNotLog(3)});
//log4.addEventListener('click', function(){setLog(3)});
preChartBtn.addEventListener('click', preChart);
nextChartBtn.addEventListener('click', nextChart);

function preChart(){
	if (IDselecter.value > 0){
		IDselecter.value--;
	    changeID();
	}
}

function nextChart(){
	if (IDselecter.value < num-1){
		IDselecter.value++;
		changeID();
	}
}

//function setNotLog(i) {
//	chartAry[i].setOption({
//        xAxis : {
//            type : 'value'
//		}
//	})
//}
//function setLog(i) {
//	chartAry[i].setOption({
//        xAxis : {
//            type : 'log'
//		}
//	})
//}

//判断浏览器是否支持FileReader.readAsBinaryString
var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";

var signals = [];
var num = 0; //记录signal的序号
var signalNames = [];  //记录signal的名称
var index;  //记录特征点的范围


function signal(data) { //构造函数
    function split(data) {
        var T = [],
        logT = [],
        Y = [];
        for (var i = 0; i < data.length; i++) {
            T.push(data[i][0]);
            logT.push(Math.log(data[i][0]) / Math.LN10); //对横坐标取10为底的对数
            Y.push(data[i][1]);
        }
        return [T, logT, Y];
    }
    function combine(X, Y) {
        var newData = [];
        console.assert(X.length == Y.length);
        for (var i = 0; i < X.length; i++) {
            newData.push([X[i], Y[i]]);
        }
        return newData;
    }

    function getDerivative(d, x, p) { //d为导数的阶数，x为横坐标的数据，p为系数
        var exp = "";
        var dy = [];
        if (d == 1) {
            for (var i = d; i < p.length; i++) {
                exp = exp + "+" + p[i].toString() + "*" + i.toString() + "* Math.pow(x[j]," + (i - d).toString() + ")"; //exp look like: "+p[1]*1*Math.pow(x, 0) + +p[2]*2*Math.pow(x, 1) ..."
            }
        }
        if (d == 2) {
            for (var i = d; i < p.length; i++) {
                exp = exp + "+" + p[i].toString() + "*" + i.toString() + "*" + (i - 1).toString() + "* Math.pow(x[j]," + (i - d).toString() + ")"; //exp look like: "+p[1]*1*Math.pow(x, 0) + +p[2]*2*Math.pow(x, 1) ..."
            }
        }
        for (var j = 0; j < x.length; j++) {
            dy.push(eval(exp));
        }
        return dy; //dy为导数的值（数组形式）
    }
    function getCurvature(d1, d2) {
        console.assert(d1.length == d2.length);
        var c = [];
        for (var i = 0; i < d1.length; i++) {
            c.push(Math.log(Math.abs(d2[i]) / Math.pow(1 + Math.pow(d1[i], 2), 1.5)) / Math.LN10); //对曲率取了对数
        }
        return c;
    }
	function calculateSampleX(rangeStart,rangeEnd,num){
		var sampleX = [];
		var step = (rangeEnd - rangeStart)/(num - 1);
		var temp = rangeStart;
		sampleX.push(temp);
		for (var i = 0; i < num - 1; i++) {
			temp = temp + step;
			sampleX.push(temp);
		}
		return sampleX;
	}
	function calculateSampleY(x, reg){
		var sampleY = [];
		for (var i = 0; i < x.length; i++) {
			var temp = 0;
			for (var n=0; n < reg.parameter.length;n++)
				temp += reg.parameter[n]*Math.pow(x[i],n);
			sampleY.push(temp);
		}
		return sampleY;
	}
	
    this.data = data; //t,y
    this.num = num;
	this.name = signalNames[num];
    var splitedData = split(data);
    var T = splitedData[0];
    var logT = splitedData[1];
    var Y = splitedData[2];

    this.logData = combine(logT, Y); //log(t),y  仅用作拟合，不用于画图
    if (linear) {
		var linearReg = ecStat.regression('polynomial', data, 16);  //以t,y 进行拟合
		this.regression = linearReg;
		//以回归后函数进行均匀采样
		var samplePointsNum = Math.pow(2, Math.floor(Math.log(data.length) / Math.LN2)); //采样点个数：为最接近原数据点个数的2的整次幂
		var sampleX = calculateSampleX(T[0],T[T.length-1],samplePointsNum);
		var sampleY = calculateSampleY(sampleX, linearReg);
		//以下以sampleY计算FFT及wavelet
		//fft
		var complexY = [];
		var fftX = [];
		var fftY = [];
		for (var i = 0; i < sampleY.length; i++) {
			complexY.push(new Complex(sampleY[i], 0)); //实部sampleY[i]，虚部0
		}
		var fftComplexResult = ft.FFT(complexY);
		for (var i = 0; i < fftComplexResult.length; i++) {
			fftX.push(fftComplexResult[i].re);
		    fftY.push(fftComplexResult[i].im);
		}
		this.fft = combine(fftX, fftY);
		//wavelet
		waveletY = haarWaveletTransform(sampleY);
		this.wavelet = combine(sampleX, waveletY)
        //曲率
		var d1Y = getDerivative(1, T, linearReg.parameter);
		var d2Y = getDerivative(2, T, linearReg.parameter);
		var cY = getCurvature(d1Y, d2Y);
		this.C = cY;
		this.d1Data = combine(T, d1Y); //t, dy
		this.d2Data = combine(T, d2Y); //t, ddy
		this.cData = combine(T, cY); //t, C
		//this.d1 = d1();
		//this.d2 = d2();
	}
	
	else {
		var reg = ecStat.regression('polynomial', this.logData, 16);  //以log(t),y 进行拟合
		this.regression = reg;
		//以回归后函数进行均匀采样
		var samplePointsNum = Math.pow(2, Math.floor(Math.log(data.length) / Math.LN2)); //采样点个数：为最接近原数据点个数的2的整次幂
		var sampleX = calculateSampleX(logT[0],logT[logT.length-1],samplePointsNum);
		var sampleY = calculateSampleY(sampleX, reg);
		//以下以sampleY计算FFT及wavelet
		//fft
		var complexY = [];
		var fftX = [];
		var fftY = [];
		for (var i = 0; i < sampleY.length; i++) {
			complexY.push(new Complex(sampleY[i], 0)); //实部sampleY[i]，虚部0
		}
		var fftComplexResult = ft.FFT(complexY);
		for (var i = 0; i < fftComplexResult.length; i++) {
			fftX.push(fftComplexResult[i].re);
		    fftY.push(fftComplexResult[i].im);
		}
		this.fft = combine(fftX, fftY);
		//wavelet
		waveletY = haarWaveletTransform(sampleY);
		this.wavelet = combine(sampleX, waveletY)
		//曲率
		var d1Y = getDerivative(1, logT, reg.parameter);
		var d2Y = getDerivative(2, logT, reg.parameter);
		var cY = getCurvature(d1Y, d2Y);
		this.logC = cY;
		//this.d1LogData = combine(logT, d1Y); //log(t),dy
		//this.d2LogData = combine(logT, d2Y); //log(t),ddy
		this.d1Data = combine(T, d1Y); //t, dy
		this.d2Data = combine(T, d2Y); //t, ddy
		this.cData = combine(T, cY); //t, log(c)
		//this.cLogData = combine(logT, cY); //log(t), log(c)
		//this.d1 = d1();
		//this.d2 = d2();
	}
	this.featurePoints = [];
}



function fixdata(Bdata) {
    //浏览器无法直接读取二进制文件时的处理函数
    var o = "",
    l = 0,
    w = 10240;
    for (; l < Bdata.byteLength / w; ++l)
        o += String.fromCharCode.apply(null, new Uint8Array(Bdata.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(Bdata.slice(l * w)));
    return o;
}

function processFiles(files, callback) {
	for (var i = 0, f; f = files[i]; i++) { //依次读取选中的文件
        var reader = new FileReader();
        reader.onload = function (e) {
            var Bdata = e.target.result; //Bdata为以二进制格式读取的文件
            parsing(Bdata);
        }
        if (rABS)
            reader.readAsBinaryString(f);
        else
            reader.readAsArrayBuffer(f);
    }
	if (callback) {
		callback();
	}
}

function parsing(Bdata) { //将Bdata解析为可处理的string/json/HTML等
    try {
        if (rABS) {
            workbook = XLSX.read(Bdata, {
                    type : 'binary'
                }); //将Bdata解析为workbook
        } else {
            var arr = fixdata(Bdata);
            workbook = XLSX.read(btoa(arr), {
                    type : 'base64'
                });
        }
    } catch (e) {
        console.log(e);
        alert("Error parsing the workbooks.");
    }
    csv = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]); //只处理sheet1中的数据
    //其他可选：sheet_to_json, sheet_to_html, sheet_to_formulae
    //csv中存储所有表格文件转换得到的csv(type:string)
    //console.log(csv);
    csvToAry(csv);
    //每获得一个csv，就进行处理，算出后续画出图形所需要的所有必须数据
}

function csvToAry(c) {
    var tempAry = c.split("\n"); //look like [["2,3,4,5"],[...],...]
	var startLine = 0;
	if (tempAry[0].match("names")) {  //如果首行能匹配到names
		signalNames = signalNames.concat(tempAry[0].split(",").slice(1));  //slice截取，忽略"names"
		startLine = 1;
	};
    for (var i = startLine; i < tempAry.length - 1; i++) {  //最后是一个空字符串
		tempAry[i] = tempAry[i].split(",").map(s => +s); //look like [[2,3,4,5],[...]]
    }
    var amount = tempAry[1].length - 1; //一个csv中所包含的信号数量，以第二行判断，避开名称行
    if (headByValue)  //!!!如果用户选择使用value来限定范围。这个判断方式使得headByValue不能为0
	{
		for (var i = 0; i < amount; i++) {
			var data = [];
			for (var j = 0; j < tempAry.length; j++) {
				if ((tempAry[j][0] > headByValue) && (tempAry[j][0] < endByValue))
					data.push([tempAry[j][0], tempAry[j][i + 1]]); //get data like [[2,3],[...],...]
			}
			if (!startLine)   //无名称行时
			    signalNames.push("auto No."+num.toString());
			signals.push(new signal(data));
			var signalOption = new Option(signalNames[num], num);
			IDselecter.options.add(signalOption);
			num++; //将每一个新信号，添加进选择框
		}
	}
	else {
		for (var i = 0; i < amount; i++) {
			var data = [];
			if (!head) {  //!!!这里设定了在用户未输入head与end时，默认的范围
				head = 2;
				end = tempAry.length - 165; //只使用从head到end的数据
			}
			if (head < 0)  //head与end不能超出索引范围
				head = 0;
			if (end > tempAry.length)
				end = tempAry.length;
			for (var j = head; j < end; j++) {
				data.push([tempAry[j][0], tempAry[j][i + 1]]); //get data like [[2,3],[...],...]
			}
			if (!startLine)   //无名称行时
			    signalNames.push("auto No."+num.toString());
			signals.push(new signal(data));
			var signalOption = new Option(signalNames[num], num);
			IDselecter.options.add(signalOption);
			num++; //将每一个新信号，添加进选择框
		}
	}
    if (signals.length != 0) {
        preProcess();
    } //!!!全部数据生成完毕后，通过交互读取数据范围等
}


function preProcess() {
	chart0 = echarts.init(document.getElementById('chart0'), "dark");
	var next2 = document.getElementById('next2');
	
	for (var i = 0; i < signals.length; i++){
		chart0Options.series.push({name:"signal"+i.toString(), type:"line", sampling:"average",symbol:"none", itemStyle:{normal:{color:"#A9A9A9"}},data:signals[i].cData}); //对chart0使用了sampling:"average"进行降采样，优化性能
		chart0Options.series.push({name:"ssignal"+i.toString(), type:"scatter", symbolSize:3, z:100, data:signals[i].cData});  //brush只支持散点图，因此使用散点覆盖于line上方
	}
	chart0.setOption(chart0Options, true);
	chart0.on('brushselected', brushed);
	next2.addEventListener('click', getFeaturePoints);
}

function getFeaturePoints() {
	if (!index) 
		return;  //未选择特征点范围时不向后执行
	var range = splitIndex();
	findMaxPoint(range); //寻找极大值点
	initialDraw(); //画初始图
}

function splitIndex() {
	var range = [];
	var tmp = [];
	for (var i = 0; i < index.length-1; i++) {
		if (index[i]+1 == index[i+1]) {
			tmp.push(index[i]);
		}
		else {
			tmp.push(index[i]);
			range.push(tmp);
			tmp = [];
		}
	}
	range.push(tmp);
	return range;
}

function findMaxPoint(range) {
	for (var k = 0; k < signals.length; k++) { //对每一个信号
		for (var i = 0; i < range.length; i++)  //对每一个范围寻找极大值点
		{
			var find = false;
			for (var j = 0; j < range[i].length; j++) { //index遍历range每个点
			    p = range[i][j];  //p为真实的下标
				if ( (signals[k].cData[p][1] > signals[k].cData[p-1][1]) && (signals[k].cData[p][1] > signals[k].cData[p+1][1]) ) {
					signals[k].featurePoints.push(p);  //signals[k].featurePoints存储的是特征点的index
					find = true;
					break;
				}
				
			}
			if (!(find)) {
				signals[k].featurePoints.push(p);  //若未找到极大值点，以范围中最后一个点的后一个点作为极大值点
			}
		}
	}
}

function brushed(params) {
	index = params.batch[0].selected[0].dataIndex;  //!!!特征点的范围目前仅由第一条曲线的index决定
}
//****************从此处开始所有数据均由signals[x]. 获得
//初始化

//初始option


//function changeData(option, dataAry) { //注意这里是引用而非赋值（克隆）
//    for (var i = 0; i < option.series.length; i++) {
//        option.series[i].data = dataAry[i]
//    }
//}

function initMarkPoints(chart, chartNum) {
	var pointsData = [], pointsC = [], pointsD1 = [], pointsD2 = [];
	for (i = 0; i < signals[chartNum].featurePoints.length; i++){
		pointsData.push({coord:signals[chartNum].data[signals[chartNum].featurePoints[i]]});  //[{coord:[x, y]}, {coord:[x, y]}] 的对象数组
		pointsC.push({coord:signals[chartNum].cData[signals[chartNum].featurePoints[i]]});
		pointsD1.push({coord:signals[chartNum].d1Data[signals[chartNum].featurePoints[i]]});
		pointsD2.push({coord:signals[chartNum].d2Data[signals[chartNum].featurePoints[i]]});
	}
	chart.setOption ({
		series:[{
            name: 'data',
            markPoint: {data: pointsData},
        },
		{
            name: 'curvature',
            markPoint: {data: pointsC},
		},
		{
            name: '2ndDerivative',
            markPoint: {data: pointsD2},
		},
		{
            name: '1stDerivative',
            markPoint: {data: pointsD1},
		}]
	});
}

function changeData(chart, chartNum) {
	chart.setOption ({
		series:[{
            name: 'data',
            data: signals[chartNum].data
        },
		{
            name: 'curvature',
            data: signals[chartNum].cData
		},
		{
            name: '2ndDerivative',
            data: signals[chartNum].d2Data
		},
		{
            name: '1stDerivative',
            data: signals[chartNum].d1Data
		}]
	});
	initMarkPoints(chart, chartNum);  //在更新过图上数据之后还需要重绘特征点
}

function initialDraw() {
	chart1 = echarts.init(document.getElementById('chart1'),"dark");
    chart2 = echarts.init(document.getElementById('chart2'),"dark");
    chart3 = echarts.init(document.getElementById('chart3'),"dark");
    chart4 = echarts.init(document.getElementById('chart4'),"dark");
    chartAry = [chart1, chart2, chart3, chart4];
	chart1.setOption(initOption, true);
	chart1.setOption(
	{
		legend:{
			selected:{
				"data":true, "curvature":false, "2ndDerivative":false, "1stDerivative":false
			}
		},
	});
	changeData(chart1, 0);
	
    chart2.setOption(initOption, true);
	chart2.setOption(
	{
		legend:{
			selected:{
				"data":false, "curvature":true, "2ndDerivative":false, "1stDerivative":false
			}
		},
	});
	changeData(chart2, 0);
	
    chart3.setOption(initOption, true);
	chart3.setOption(
	{
		legend:{
			selected:{
				"data":false, "curvature":false, "2ndDerivative":true, "1stDerivative":false
			}
		},
	});
	changeData(chart3, 0);
	
    chart4.setOption(initOption, true);
	chart4.setOption(
	{
		legend:{
			selected:{
				"data":false, "curvature":false, "2ndDerivative":false, "1stDerivative":true
			}
		},
	});
	changeData(chart4, 0);
    
	chart1.on('click', dealChartOnClick);
	chart2.on('click', dealChartOnClick);
	chart3.on('click', dealChartOnClick);
	chart4.on('click', dealChartOnClick);
}

function dealChartOnClick(params) { 
		var pointIndex = params.dataIndex;
		var chartNum = IDselecter.value;
		setMoveFunction(leftBtn, -1);
		setMoveFunction(rightBtn, 1);
		function setMoveFunction(buttonObj, step) {
			buttonObj.onclick = function() {
				signals[chartNum].featurePoints[pointIndex] += step;
				initMarkPoints(chart1, chartNum);
				initMarkPoints(chart2, chartNum);
				initMarkPoints(chart3, chartNum);
				initMarkPoints(chart4, chartNum);
			};
		}
}

function changeID() {
	var chartNum = IDselecter.value;
	for (var j = 0; j < chartAry.length; j++) {
	    changeData(chartAry[j], chartNum);
	}
}

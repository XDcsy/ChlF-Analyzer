var chart0Options ={
//			dataZoom: [
//            {
//                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
//                start: 0,      // 左边在 10% 的位置。
//                end: 100,         // 右边在 60% 的位置。
//			      realtime:false  //关闭拖动时的实时更新
//            },
//            {
//                type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
//                start: 0,      // 左边在 10% 的位置。
//                end: 100,         // 右边在 60% 的位置。
//				  realtime:false
//            }
//            ],
			
	animation: false,  //关闭动画，提高性能
	
    toolbox : {
        feature : {
                brush: {
                    type: ['lineX', 'keep','clear']
                }
        }
    },
	
            brush: {
            xAxisIndex: 0,
            brushLink: 'all',
            outOfBrush: {
                colorAlpha: 0
            },
			throttleType: 'debounce',  //设置事件延迟提升性能
            throttleDelay: 300,
        },
	
    xAxis : {
        type : 'log', //'log'为对数轴
        name : 'time',
        splitLine : { //分隔线
            lineStyle : {
                type : 'dashed'
            }
        },
    },
    yAxis : {
            type : 'value',
            splitLine : {
                lineStyle : {
                    type : 'dashed'
                }
            },
    },
	series:[]
}

